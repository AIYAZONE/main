/**
 * 性能监控工具
 */

interface PerformanceMetrics {
	name: string;
	startTime: number;
	endTime?: number;
	duration?: number;
	metadata?: Record<string, any>;
}

class PerformanceMonitor {
	private metrics: Map<string, PerformanceMetrics> = new Map();
	private observers: PerformanceObserver[] = [];

	constructor() {
		this.initializeObservers();
	}

	/**
	 * 初始化性能观察器
	 */
	private initializeObservers() {
		if (
			typeof window === 'undefined' ||
			!('PerformanceObserver' in window)
		) {
			return;
		}

		try {
			// 观察导航性能
			const navObserver = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				entries.forEach((entry) => {
					if (entry.entryType === 'navigation') {
						this.trackNavigationMetrics(
							entry as PerformanceNavigationTiming
						);
					}
				});
			});
			navObserver.observe({ entryTypes: ['navigation'] });
			this.observers.push(navObserver);

			// 观察资源加载性能
			const resourceObserver = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				entries.forEach((entry) => {
					if (entry.entryType === 'resource') {
						this.trackResourceMetrics(
							entry as PerformanceResourceTiming
						);
					}
				});
			});
			resourceObserver.observe({ entryTypes: ['resource'] });
			this.observers.push(resourceObserver);

			// 观察长任务
			if ('PerformanceObserver' in window) {
				try {
					const longTaskObserver = new PerformanceObserver((list) => {
						const entries = list.getEntries();
						entries.forEach((entry) => {
							this.trackLongTask(entry);
						});
					});
					longTaskObserver.observe({ entryTypes: ['longtask'] });
					this.observers.push(longTaskObserver);
				} catch (e) {
					// longtask 可能不被支持
					console.warn('Long task observation not supported');
				}
			}
		} catch (error) {
			console.warn('Performance monitoring setup failed:', error);
		}
	}

	/**
	 * 开始性能测量
	 */
	startMeasure(name: string, metadata?: Record<string, any>): void {
		try {
			const startTime =
				typeof window !== 'undefined' && window.performance
					? window.performance.now()
					: Date.now();
			this.metrics.set(name, {
				name,
				startTime,
				metadata
			});

			// 使用 Performance API 标记
			if (
				typeof window !== 'undefined' &&
				window.performance &&
				'mark' in window.performance
			) {
				window.performance.mark(`${name}-start`);
			}
		} catch (error) {
			console.warn('Performance measurement start failed:', error);
		}
	}

	/**
	 * 结束性能测量
	 */
	endMeasure(name: string): PerformanceMetrics | null {
		try {
			const metric = this.metrics.get(name);
			if (!metric) {
				console.warn(`No measurement started for: ${name}`);
				return null;
			}

			const endTime =
				typeof window !== 'undefined' && window.performance
					? window.performance.now()
					: Date.now();
			const duration = endTime - metric.startTime;

			const completedMetric: PerformanceMetrics = {
				...metric,
				endTime,
				duration
			};

			this.metrics.set(name, completedMetric);

			// 使用 Performance API 测量
			if (
				typeof window !== 'undefined' &&
				window.performance &&
				'mark' in window.performance &&
				'measure' in window.performance
			) {
				window.performance.mark(`${name}-end`);
				try {
					window.performance.measure(
						name,
						`${name}-start`,
						`${name}-end`
					);
				} catch (e) {
					// 忽略测量错误
				}
			}

			this.reportMetric(completedMetric);
			return completedMetric;
		} catch (error) {
			console.warn('Performance measurement end failed:', error);
			return null;
		}
	}

	/**
	 * 获取性能指标
	 */
	getMetric(name: string): PerformanceMetrics | undefined {
		return this.metrics.get(name);
	}

	/**
	 * 获取所有性能指标
	 */
	getAllMetrics(): PerformanceMetrics[] {
		return Array.from(this.metrics.values());
	}

	/**
	 * 跟踪导航性能
	 */
	private trackNavigationMetrics(entry: PerformanceNavigationTiming) {
		const metrics = {
			dns: entry.domainLookupEnd - entry.domainLookupStart,
			tcp: entry.connectEnd - entry.connectStart,
			ssl:
				entry.secureConnectionStart > 0
					? entry.connectEnd - entry.secureConnectionStart
					: 0,
			ttfb: entry.responseStart - entry.requestStart,
			download: entry.responseEnd - entry.responseStart,
			domParse: entry.domContentLoadedEventStart - entry.responseEnd,
			domReady:
				entry.domContentLoadedEventEnd -
				entry.domContentLoadedEventStart,
			loadComplete: entry.loadEventEnd - entry.loadEventStart,
			total: entry.loadEventEnd - entry.startTime
		};

		console.log('Navigation Performance:', metrics);
		this.reportMetric({
			name: 'navigation',
			startTime: entry.startTime,
			endTime: entry.loadEventEnd,
			duration: metrics.total,
			metadata: metrics
		});
	}

	/**
	 * 跟踪资源加载性能
	 */
	private trackResourceMetrics(entry: PerformanceResourceTiming) {
		// 只跟踪关键资源
		const criticalResources = ['.js', '.css', '.vue', '.ts'];
		const isCritical = criticalResources.some((ext) =>
			entry.name.includes(ext)
		);

		if (isCritical) {
			const duration = entry.responseEnd - entry.startTime;

			// 标记慢资源
			if (duration > 1000) {
				console.warn(
					`Slow resource detected: ${entry.name} (${duration.toFixed(
						2
					)}ms)`
				);
			}

			this.reportMetric({
				name: `resource-${entry.name.split('/').pop()}`,
				startTime: entry.startTime,
				endTime: entry.responseEnd,
				duration,
				metadata: {
					url: entry.name,
					size: entry.transferSize,
					type: entry.initiatorType
				}
			});
		}
	}

	/**
	 * 跟踪长任务
	 */
	private trackLongTask(entry: PerformanceEntry) {
		console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
		this.reportMetric({
			name: 'longtask',
			startTime: entry.startTime,
			endTime: entry.startTime + entry.duration,
			duration: entry.duration,
			metadata: {
				type: 'longtask'
			}
		});
	}

	/**
	 * 报告性能指标
	 */
	private reportMetric(metric: PerformanceMetrics) {
		// 这里可以发送到分析服务
		// 例如：Google Analytics, 自定义分析服务等

		// 开发环境下输出到控制台
		if (process.env.NODE_ENV === 'development') {
			console.log('Performance Metric:', metric);
		}
	}

	/**
	 * 获取核心 Web 指标
	 */
	getCoreWebVitals(): Promise<Record<string, number>> {
		return new Promise((resolve) => {
			const vitals: Record<string, number> = {};

			// LCP (Largest Contentful Paint)
			if ('PerformanceObserver' in window) {
				try {
					const lcpObserver = new PerformanceObserver((list) => {
						const entries = list.getEntries();
						const lastEntry = entries[entries.length - 1];
						vitals.lcp = lastEntry.startTime;
						lcpObserver.disconnect();
					});
					lcpObserver.observe({
						entryTypes: ['largest-contentful-paint']
					});
				} catch (e) {
					console.warn('LCP measurement not supported');
				}
			}

			// FID (First Input Delay) - 需要用户交互
			if ('PerformanceObserver' in window) {
				try {
					const fidObserver = new PerformanceObserver((list) => {
						const entries = list.getEntries();
						entries.forEach((entry: any) => {
							vitals.fid =
								entry.processingStart - entry.startTime;
						});
						fidObserver.disconnect();
					});
					fidObserver.observe({ entryTypes: ['first-input'] });
				} catch (e) {
					console.warn('FID measurement not supported');
				}
			}

			// CLS (Cumulative Layout Shift)
			if ('PerformanceObserver' in window) {
				try {
					let clsValue = 0;
					const clsObserver = new PerformanceObserver((list) => {
						const entries = list.getEntries();
						entries.forEach((entry: any) => {
							if (!entry.hadRecentInput) {
								clsValue += entry.value;
							}
						});
						vitals.cls = clsValue;
					});
					clsObserver.observe({ entryTypes: ['layout-shift'] });
				} catch (e) {
					console.warn('CLS measurement not supported');
				}
			}

			// 等待一段时间后返回结果
			setTimeout(() => {
				resolve(vitals);
			}, 3000);
		});
	}

	/**
	 * 清理资源
	 */
	destroy() {
		this.observers.forEach((observer) => observer.disconnect());
		this.observers = [];
		this.metrics.clear();
	}
}

// 创建全局实例
export const performanceMonitor = new PerformanceMonitor();

// 便捷函数
export const startMeasure = (name: string, metadata?: Record<string, any>) => {
	performanceMonitor.startMeasure(name, metadata);
};

export const endMeasure = (name: string) => {
	return performanceMonitor.endMeasure(name);
};

export const measureAsync = async <T>(
	name: string,
	fn: () => Promise<T>,
	metadata?: Record<string, any>
): Promise<T> => {
	startMeasure(name, metadata);
	try {
		const result = await fn();
		endMeasure(name);
		return result;
	} catch (error) {
		endMeasure(name);
		throw error;
	}
};

export const measureSync = <T>(
	name: string,
	fn: () => T,
	metadata?: Record<string, any>
): T => {
	startMeasure(name, metadata);
	try {
		const result = fn();
		endMeasure(name);
		return result;
	} catch (error) {
		endMeasure(name);
		throw error;
	}
};

// 页面加载性能测量
export const measurePageLoad = (pageName: string) => {
	if (typeof window === 'undefined') return;

	window.addEventListener('load', () => {
		try {
			// 检查 performance API 是否可用
			if (
				typeof window !== 'undefined' &&
				window.performance &&
				window.performance.getEntriesByType
			) {
				const navigation = window.performance.getEntriesByType(
					'navigation'
				)[0] as PerformanceNavigationTiming;
				if (navigation) {
					const loadTime =
						navigation.loadEventEnd - navigation.startTime;
					// 使用公共方法记录指标
					performanceMonitor.startMeasure(`page-load-${pageName}`, {
						page: pageName,
						type: 'page-load'
					});
					performanceMonitor.endMeasure(`page-load-${pageName}`);
				}
			} else {
				// 降级方案：使用简单的时间测量
				console.warn(
					'Performance API not available, using fallback timing'
				);
				performanceMonitor.startMeasure(`page-load-${pageName}`, {
					page: pageName,
					type: 'page-load-fallback'
				});
				performanceMonitor.endMeasure(`page-load-${pageName}`);
			}
		} catch (error) {
			console.warn('Performance measurement failed:', error);
		}
	});
};

// 组件渲染性能测量
export const measureComponentRender = (componentName: string) => {
	return {
		onBeforeMount: () => startMeasure(`${componentName}-render`),
		onMounted: () => endMeasure(`${componentName}-render`)
	};
};

/**
 * Performance Service for testing
 */
export class PerformanceService {
	timing?: any;

	startMeasure(name: string): void {
		performanceMonitor.startMeasure(name);
	}

	endMeasure(name: string): PerformanceMetrics | null {
		return performanceMonitor.endMeasure(name);
	}

	trackPageLoadMetrics(): any {
		if (
			typeof window === 'undefined' ||
			!window.performance ||
			!window.performance.timing
		) {
			return null;
		}

		try {
			const timing = window.performance.timing;
			return {
				loadTime: timing.loadEventEnd - timing.navigationStart,
				domReady:
					timing.domContentLoadedEventEnd - timing.navigationStart,
				firstByte: timing.responseStart - timing.navigationStart
			};
		} catch (error) {
			console.warn('Page load metrics tracking failed:', error);
			return null;
		}
	}

	monitorResourceLoading(): any[] {
		if (
			typeof window === 'undefined' ||
			!window.performance ||
			!window.performance.getEntriesByType
		) {
			return [];
		}

		try {
			return window.performance
				.getEntriesByType('resource')
				.map((entry: any) => ({
					name: entry.name,
					duration: entry.duration,
					size: entry.transferSize
				}));
		} catch (error) {
			console.warn('Resource loading monitoring failed:', error);
			return [];
		}
	}

	getEntriesByType(type: string): PerformanceEntryList {
		if (
			typeof window === 'undefined' ||
			!window.performance ||
			!window.performance.getEntriesByType
		) {
			return [];
		}
		return window.performance.getEntriesByType(type);
	}

	getResourceMetrics(): Array<{
		name: string;
		duration: number;
		transferSize: number;
		initiatorType: string;
	}> {
		const entries = this.getEntriesByType('resource') as any[];
		return entries.map((entry) => ({
			name: entry.name,
			duration: entry.duration,
			transferSize: entry.transferSize,
			initiatorType: entry.initiatorType
		}));
	}

	async getCoreWebVitals(): Promise<any> {
		const webVitals = (globalThis as any).webVitals as
			| {
					getCLS?: (cb: (metric: { value: number }) => void) => void;
					getFID?: (cb: (metric: { value: number }) => void) => void;
					getLCP?: (cb: (metric: { value: number }) => void) => void;
			  }
			| undefined;

		const getCLS = webVitals?.getCLS;
		const getFID = webVitals?.getFID;
		const getLCP = webVitals?.getLCP;

		if (getCLS && getFID && getLCP) {
			return await new Promise<Record<string, number>>((resolve) => {
				const vitals: Record<string, number> = {};

				const tryResolve = () => {
					if (
						typeof vitals.cls === 'number' &&
						typeof vitals.fid === 'number' &&
						typeof vitals.lcp === 'number'
					) {
						resolve(vitals);
					}
				};

				getCLS((metric) => {
					vitals.cls = metric.value;
					tryResolve();
				});
				getFID((metric) => {
					vitals.fid = metric.value;
					tryResolve();
				});
				getLCP((metric) => {
					vitals.lcp = metric.value;
					tryResolve();
				});
			});
		}

		return performanceMonitor.getCoreWebVitals();
	}

	getPerformanceOptimizations(): any {
		const hardwareConcurrency =
			typeof navigator !== 'undefined'
				? navigator.hardwareConcurrency || 0
				: 0;

		const connection = (
			typeof navigator !== 'undefined'
				? (navigator as any).connection
				: undefined
		) as undefined | { effectiveType?: string; downlink?: number };

		const effectiveType = connection?.effectiveType || '';
		const downlink =
			typeof connection?.downlink === 'number' ? connection.downlink : 0;

		const isHighEndDevice = hardwareConcurrency >= 4;
		const isFastNetwork =
			effectiveType === '4g' || effectiveType === '5g' || downlink >= 5;

		return {
			enableHighQualityImages: isHighEndDevice && isFastNetwork,
			enableAnimations: isHighEndDevice,
			enableLazyLoading: true,
			preloadResources: isFastNetwork
		};
	}

	checkPerformanceBudget(budget: any, currentUsage: any): any {
		const violations: string[] = [];

		if (currentUsage.totalSize > budget.totalSize) {
			violations.push('totalSize');
		}
		if (currentUsage.scriptSize > budget.scriptSize) {
			violations.push('scriptSize');
		}

		return {
			withinBudget: violations.length === 0,
			violations
		};
	}

	getPageLoadMetrics(): any {
		const timing = (this as any).timing ?? window?.performance?.timing;

		if (typeof window === 'undefined' || !timing) {
			return {
				totalLoadTime: 0,
				domContentLoaded: 0,
				responseTime: 0
			};
		}

		try {
			return {
				totalLoadTime: timing.loadEventEnd - timing.navigationStart,
				domContentLoaded:
					timing.domContentLoadedEventEnd - timing.navigationStart,
				responseTime: timing.responseEnd - timing.navigationStart
			};
		} catch (error) {
			console.warn('Page load metrics failed:', error);
			return {
				totalLoadTime: 0,
				domContentLoaded: 0,
				responseTime: 0
			};
		}
	}
}

// Export a default instance
export const performance = new PerformanceService();
