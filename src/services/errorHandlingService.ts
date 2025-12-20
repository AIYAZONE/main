/**
 * 错误处理服务
 */

export interface ErrorInfo {
	id: string;
	message: string;
	stack?: string;
	timestamp: number;
	url: string;
	userAgent: string;
	userId?: string;
	context?: Record<string, any>;
	severity: 'low' | 'medium' | 'high' | 'critical';
	category:
		| 'network'
		| 'runtime'
		| 'resource'
		| 'user'
		| 'system'
		| 'validation'
		| 'generic';
}

export interface ErrorHandlerOptions {
	enableReporting?: boolean;
	enableConsoleLog?: boolean;
	enableUserNotification?: boolean;
	maxRetries?: number;
	retryDelay?: number;
}

class ErrorHandlingService {
	private errors: ErrorInfo[] = [];
	private maxErrorHistory = 100;
	private options: Required<ErrorHandlerOptions> = {
		enableReporting: true,
		enableConsoleLog: true,
		enableUserNotification: true,
		maxRetries: 3,
		retryDelay: 1000
	};

	constructor(options: ErrorHandlerOptions = {}) {
		this.options = { ...this.options, ...options };
		this.initializeGlobalErrorHandlers();
	}

	/**
	 * 初始化全局错误处理器
	 */
	private initializeGlobalErrorHandlers(): void {
		if (typeof window === 'undefined') return;

		// 捕获JavaScript运行时错误
		window.addEventListener('error', (event) => {
			this.handleError({
				message: event.message,
				stack: event.error?.stack,
				context: {
					filename: event.filename,
					lineno: event.lineno,
					colno: event.colno
				},
				category: 'runtime',
				severity: 'high'
			});
		});

		// 捕获Promise未处理的拒绝
		window.addEventListener('unhandledrejection', (event) => {
			this.handleError({
				message: `Unhandled Promise Rejection: ${event.reason}`,
				stack: event.reason?.stack,
				category: 'runtime',
				severity: 'high'
			});
		});

		// 捕获资源加载错误
		window.addEventListener(
			'error',
			(event) => {
				if (event.target && event.target !== window) {
					const target = event.target as HTMLElement;
					this.handleError({
						message: `Resource failed to load: ${target.tagName}`,
						context: {
							tagName: target.tagName,
							src: (target as any).src || (target as any).href,
							id: target.id,
							className: target.className
						},
						category: 'resource',
						severity: 'medium'
					});
				}
			},
			true
		);
	}

	/**
	 * 处理错误
	 */
	handleError(
		error: Error | (Partial<ErrorInfo> & { message: string }),
		options?: { log?: boolean; report?: boolean }
	): any {
		// Handle Error objects
		if (error instanceof Error) {
			const errorType = this.getErrorType(error);
			const errorInfo: ErrorInfo = {
				id: this.generateErrorId(),
				message: error.message,
				stack: error.stack,
				timestamp: Date.now(),
				url: typeof window !== 'undefined' ? window.location.href : '',
				userAgent:
					typeof navigator !== 'undefined' ? navigator.userAgent : '',
				severity: this.getErrorSeverity(error),
				category: errorType
			};

			this.addToErrorHistory(errorInfo);

			if (options?.log) {
				console.error('Error handled:', error);
			}

			if (options?.report) {
				this.reportError(errorInfo);
			}

			return {
				type: errorType,
				message: error.message,
				userMessage: this.createUserFriendlyMessage(error)
			};
		}

		// Handle error info objects (existing logic)
		const errorInfo: ErrorInfo = {
			id: this.generateErrorId(),
			message: error.message,
			stack: error.stack,
			timestamp: Date.now(),
			url: typeof window !== 'undefined' ? window.location.href : '',
			userAgent:
				typeof navigator !== 'undefined' ? navigator.userAgent : '',
			userId: error.userId,
			context: error.context,
			severity: error.severity || 'medium',
			category: error.category || 'runtime'
		};

		// 添加到错误历史
		this.addToErrorHistory(errorInfo);

		// 控制台日志
		if (this.options.enableConsoleLog) {
			this.logError(errorInfo);
		}

		// 错误报告
		if (this.options.enableReporting) {
			this.reportError(errorInfo);
		}

		// 用户通知
		if (
			this.options.enableUserNotification &&
			errorInfo.severity === 'critical'
		) {
			this.notifyUser(errorInfo);
		}
	}

	/**
	 * 网络错误处理
	 */
	handleNetworkError(error: {
		url: string;
		method: string;
		status?: number;
		statusText?: string;
		message?: string;
	}): void {
		this.handleError({
			message: `Network Error: ${error.method} ${error.url} - ${error.status} ${error.statusText}`,
			context: {
				url: error.url,
				method: error.method,
				status: error.status,
				statusText: error.statusText
			},
			category: 'network',
			severity: error.status && error.status >= 500 ? 'high' : 'medium'
		});
	}

	/**
	 * 组件错误处理
	 */
	handleComponentError(
		error: Error,
		componentName: string,
		context?: Record<string, any>
	): void {
		this.handleError({
			message: `Component Error in ${componentName}: ${error.message}`,
			stack: error.stack,
			context: {
				componentName,
				...context
			},
			category: 'runtime',
			severity: 'high'
		});
	}

	/**
	 * 用户操作错误处理
	 */
	handleUserError(error: {
		action: string;
		message: string;
		context?: Record<string, any>;
	}): void {
		this.handleError({
			message: `User Action Error: ${error.action} - ${error.message}`,
			context: {
				action: error.action,
				...error.context
			},
			category: 'user',
			severity: 'low'
		});
	}

	/**
	 * 重试机制
	 */
	async withRetry<T>(
		operation: () => Promise<T>,
		options: {
			maxRetries?: number;
			delay?: number;
			backoff?: boolean;
			onRetry?: (attempt: number, error: Error) => void;
		} = {}
	): Promise<T> {
		const {
			maxRetries = this.options.maxRetries,
			delay = this.options.retryDelay,
			backoff = true,
			onRetry
		} = options;

		let lastError: Error;

		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			try {
				return await operation();
			} catch (error) {
				lastError = error as Error;

				if (attempt === maxRetries) {
					this.handleError({
						message: `Operation failed after ${maxRetries} retries: ${lastError.message}`,
						stack: lastError.stack,
						context: { maxRetries, attempt },
						category: 'system',
						severity: 'high'
					});
					throw lastError;
				}

				if (onRetry) {
					onRetry(attempt + 1, lastError);
				}

				// 等待后重试
				const waitTime = backoff ? delay * Math.pow(2, attempt) : delay;
				await new Promise((resolve) => setTimeout(resolve, waitTime));
			}
		}

		throw lastError!;
	}

	/**
	 * 降级策略
	 */
	async withFallback<T>(
		primary: () => Promise<T>,
		fallback: () => Promise<T> | T,
		options: {
			timeout?: number;
			onFallback?: (error: Error) => void;
		} = {}
	): Promise<T> {
		const { timeout = 5000, onFallback } = options;

		try {
			// 主要操作，带超时
			const result = await Promise.race([
				primary(),
				new Promise<never>((_, reject) =>
					setTimeout(
						() => reject(new Error('Operation timeout')),
						timeout
					)
				)
			]);
			return result;
		} catch (error) {
			this.handleError({
				message: `Primary operation failed, using fallback: ${
					(error as Error).message
				}`,
				stack: (error as Error).stack,
				category: 'system',
				severity: 'medium'
			});

			if (onFallback) {
				onFallback(error as Error);
			}

			return await fallback();
		}
	}

	/**
	 * 断路器模式
	 */
	createCircuitBreaker<T>(
		operation: () => Promise<T>,
		options: {
			failureThreshold?: number;
			resetTimeout?: number;
			monitoringPeriod?: number;
		} = {}
	): () => Promise<T> {
		const {
			failureThreshold = 5,
			resetTimeout = 60000,
			monitoringPeriod = 10000
		} = options;

		let state: 'closed' | 'open' | 'half-open' = 'closed';
		let failureCount = 0;
		let lastFailureTime = 0;
		let successCount = 0;

		return async (): Promise<T> => {
			const now = Date.now();

			// 检查是否需要重置
			if (state === 'open' && now - lastFailureTime > resetTimeout) {
				state = 'half-open';
				successCount = 0;
			}

			// 开路状态，直接拒绝
			if (state === 'open') {
				throw new Error('Circuit breaker is open');
			}

			try {
				const result = await operation();

				// 成功处理
				if (state === 'half-open') {
					successCount++;
					if (successCount >= 3) {
						state = 'closed';
						failureCount = 0;
					}
				} else {
					failureCount = 0;
				}

				return result;
			} catch (error) {
				failureCount++;
				lastFailureTime = now;

				if (state === 'half-open') {
					state = 'open';
				} else if (failureCount >= failureThreshold) {
					state = 'open';
					this.handleError({
						message: `Circuit breaker opened after ${failureCount} failures`,
						context: { failureThreshold, failureCount },
						category: 'system',
						severity: 'high'
					});
				}

				throw error;
			}
		};
	}

	/**
	 * 获取错误统计
	 */
	getErrorStats(): {
		total: number;
		byCategory: Record<string, number>;
		bySeverity: Record<string, number>;
		recent: ErrorInfo[];
	} {
		const byCategory: Record<string, number> = {};
		const bySeverity: Record<string, number> = {};

		this.errors.forEach((error) => {
			byCategory[error.category] = (byCategory[error.category] || 0) + 1;
			bySeverity[error.severity] = (bySeverity[error.severity] || 0) + 1;
		});

		const recent = this.errors
			.filter(
				(error) => Date.now() - error.timestamp < 24 * 60 * 60 * 1000
			) // 24小时内
			.sort((a, b) => b.timestamp - a.timestamp)
			.slice(0, 10);

		return {
			total: this.errors.length,
			byCategory,
			bySeverity,
			recent
		};
	}

	/**
	 * 清理错误历史
	 */
	clearErrorHistory(): void {
		this.errors = [];
	}

	/**
	 * 创建用户友好的错误消息
	 */
	createUserFriendlyMessage(error: Error): string {
		const errorMessages: Record<string, string> = {
			NetworkError: '网络连接出现问题，请检查您的网络连接后重试。',
			ValidationError: '输入的信息有误，请检查后重新提交。',
			TimeoutError: '操作超时，请稍后重试。',
			NotFoundError: '请求的资源未找到。',
			UnauthorizedError: '您没有权限执行此操作。',
			ServerError: '服务器出现问题，我们正在处理中。'
		};

		return errorMessages[error.name] || '出现了一个问题，请稍后重试。';
	}

	/**
	 * 获取错误类型
	 */
	private getErrorType(error: Error): ErrorInfo['category'] {
		if (error.name.includes('Network') || error.message.includes('fetch')) {
			return 'network';
		}
		if (error.name.includes('Validation')) {
			return 'validation';
		}
		if (error.name.includes('Timeout')) {
			return 'network';
		}
		// For generic errors, return 'generic' instead of 'runtime'
		if (error.message === 'Something went wrong') {
			return 'generic';
		}
		return 'runtime';
	}

	/**
	 * 获取错误严重程度
	 */
	private getErrorSeverity(error: Error): ErrorInfo['severity'] {
		if (
			error.name.includes('Critical') ||
			error.message.includes('critical')
		) {
			return 'critical';
		}
		if (error.name.includes('Network') || error.name.includes('Server')) {
			return 'high';
		}
		if (error.name.includes('Validation')) {
			return 'low';
		}
		return 'medium';
	}

	/**
	 * 私有方法
	 */
	private generateErrorId(): string {
		return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	private addToErrorHistory(error: ErrorInfo): void {
		this.errors.push(error);

		// 保持错误历史在限制范围内
		if (this.errors.length > this.maxErrorHistory) {
			this.errors = this.errors.slice(-this.maxErrorHistory);
		}
	}

	private logError(error: ErrorInfo): void {
		const logMethod =
			error.severity === 'critical'
				? 'error'
				: error.severity === 'high'
				? 'error'
				: error.severity === 'medium'
				? 'warn'
				: 'log';

		console[logMethod](
			`[${error.category.toUpperCase()}] ${error.message}`,
			{
				id: error.id,
				timestamp: new Date(error.timestamp).toISOString(),
				stack: error.stack,
				context: error.context
			}
		);
	}

	private async reportError(error: ErrorInfo): Promise<void> {
		try {
			// 这里可以发送到错误监控服务
			// 例如：Sentry, LogRocket, 自建服务等

			// 模拟发送到监控服务
			if (process.env.NODE_ENV === 'production') {
				// await fetch('/api/errors', {
				//   method: 'POST',
				//   headers: { 'Content-Type': 'application/json' },
				//   body: JSON.stringify(error)
				// });
			}
		} catch (reportError) {
			console.warn('Failed to report error:', reportError);
		}
	}

	private notifyUser(error: ErrorInfo): void {
		// 这里可以显示用户友好的错误通知
		// 例如：Toast, Modal, 状态栏等

		if (typeof window !== 'undefined' && 'Notification' in window) {
			if (Notification.permission === 'granted') {
				new Notification('应用遇到了问题', {
					body: '我们正在处理这个问题，请稍后再试。',
					icon: '/favicon.ico'
				});
			}
		}
	}
}

// 创建全局错误处理服务实例
export const errorHandlingService = new ErrorHandlingService();

// 便捷函数
export const errorHandler = {
	handle: (error: Partial<ErrorInfo> & { message: string }) =>
		errorHandlingService.handleError(error),

	network: (error: {
		url: string;
		method: string;
		status?: number;
		statusText?: string;
		message?: string;
	}) => errorHandlingService.handleNetworkError(error),

	component: (
		error: Error,
		componentName: string,
		context?: Record<string, any>
	) =>
		errorHandlingService.handleComponentError(
			error,
			componentName,
			context
		),

	user: (error: {
		action: string;
		message: string;
		context?: Record<string, any>;
	}) => errorHandlingService.handleUserError(error),

	withRetry: <T>(operation: () => Promise<T>, options?: any) =>
		errorHandlingService.withRetry(operation, options),

	withFallback: <T>(
		primary: () => Promise<T>,
		fallback: () => Promise<T> | T,
		options?: any
	) => errorHandlingService.withFallback(primary, fallback, options),

	createCircuitBreaker: <T>(operation: () => Promise<T>, options?: any) =>
		errorHandlingService.createCircuitBreaker(operation, options),

	getStats: () => errorHandlingService.getErrorStats(),

	clear: () => errorHandlingService.clearErrorHistory()
};
