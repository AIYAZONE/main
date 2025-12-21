/**
 * 网络错误处理工具
 */

import { errorHandler } from '../services/errorHandlingService';

export interface NetworkErrorOptions {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  enableFallback?: boolean;
  fallbackData?: any;
}

export interface RequestConfig extends RequestInit {
  url: string;
  timeout?: number;
  retries?: number;
}

/**
 * 增强的fetch函数，包含错误处理和重试机制
 */
export async function enhancedFetch<T = any>(
  config: RequestConfig,
  options: NetworkErrorOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    timeout = 10000,
    enableFallback = false,
    fallbackData = null
  } = options;

  const { url, ...fetchOptions } = config;

  // 创建带超时的fetch
  const fetchWithTimeout = async (): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  // 重试逻辑
  const executeWithRetry = async (): Promise<T> => {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetchWithTimeout();

        // 检查HTTP状态
        if (!response.ok) {
          const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
          (error as any).status = response.status;
          (error as any).statusText = response.statusText;
          throw error;
        }

        // 解析响应
        const contentType = response.headers.get('content-type');
        let data: T;

        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text() as T;
        }

        return data;
      } catch (error) {
        lastError = error as Error;

        // 记录网络错误
        errorHandler.network({
          url,
          method: fetchOptions.method || 'GET',
          status: (error as any).status,
          statusText: (error as any).statusText,
          message: lastError.message
        });

        // 如果是最后一次尝试，抛出错误或返回降级数据
        if (attempt === maxRetries) {
          if (enableFallback && fallbackData !== null) {
            console.warn(`Network request failed, using fallback data for ${url}`);
            return fallbackData;
          }
          throw lastError;
        }

        // 等待后重试
        const waitTime = retryDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    throw lastError!;
  };

  return executeWithRetry();
}

/**
 * API请求包装器
 */
export class ApiClient {
  private baseURL: string;
  private defaultOptions: NetworkErrorOptions;

  constructor(baseURL: string = '', defaultOptions: NetworkErrorOptions = {}) {
    this.baseURL = baseURL;
    this.defaultOptions = {
      maxRetries: 3,
      retryDelay: 1000,
      timeout: 10000,
      enableFallback: false,
      ...defaultOptions
    };
  }

  private getFullUrl(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    return `${this.baseURL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  }

  async get<T = any>(
    endpoint: string,
    options: NetworkErrorOptions & { params?: Record<string, string> } = {}
  ): Promise<T> {
    const { params, ...networkOptions } = options;
    let url = this.getFullUrl(endpoint);

    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    return enhancedFetch<T>(
      { url, method: 'GET' },
      { ...this.defaultOptions, ...networkOptions }
    );
  }

  async post<T = any>(
    endpoint: string,
    data?: any,
    options: NetworkErrorOptions & { headers?: HeadersInit } = {}
  ): Promise<T> {
    const { headers, ...networkOptions } = options;
    return enhancedFetch<T>(
      {
        url: this.getFullUrl(endpoint),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: data ? JSON.stringify(data) : undefined
      },
      { ...this.defaultOptions, ...networkOptions }
    );
  }

  async put<T = any>(
    endpoint: string,
    data?: any,
    options: NetworkErrorOptions & { headers?: HeadersInit } = {}
  ): Promise<T> {
    const { headers, ...networkOptions } = options;
    return enhancedFetch<T>(
      {
        url: this.getFullUrl(endpoint),
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: data ? JSON.stringify(data) : undefined
      },
      { ...this.defaultOptions, ...networkOptions }
    );
  }

  async delete<T = any>(
    endpoint: string,
    options: NetworkErrorOptions = {}
  ): Promise<T> {
    return enhancedFetch<T>(
      {
        url: this.getFullUrl(endpoint),
        method: 'DELETE'
      },
      { ...this.defaultOptions, ...options }
    );
  }

  /**
   * 批量请求
   */
  async batch<T = any>(
    requests: Array<{
      endpoint: string;
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      data?: any;
      options?: NetworkErrorOptions;
    }>
  ): Promise<T[]> {
    const promises = requests.map(request => {
      const { endpoint, method = 'GET', data, options = {} } = request;

      switch (method) {
        case 'GET':
          return this.get<T>(endpoint, options);
        case 'POST':
          return this.post<T>(endpoint, data, options);
        case 'PUT':
          return this.put<T>(endpoint, data, options);
        case 'DELETE':
          return this.delete<T>(endpoint, options);
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    });

    return Promise.all(promises);
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health', {
        timeout: 5000,
        maxRetries: 1,
        enableFallback: false
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

/**
 * 网络状态监控
 */
export class NetworkMonitor {
  private listeners: Array<(online: boolean) => void> = [];
  private isOnline = navigator.onLine;

  constructor() {
    this.initializeListeners();
  }

  private initializeListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners(true);
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners(false);
    });
  }

  private notifyListeners(online: boolean): void {
    this.listeners.forEach(listener => {
      try {
        listener(online);
      } catch (error) {
        console.error('Network listener error:', error);
      }
    });
  }

  onStatusChange(callback: (online: boolean) => void): () => void {
    this.listeners.push(callback);
    
    // 返回取消监听的函数
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  getStatus(): boolean {
    return this.isOnline;
  }

  async checkConnectivity(): Promise<boolean> {
    try {
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache'
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// 创建全局实例
export const apiClient = new ApiClient('/api');
export const networkMonitor = new NetworkMonitor();

/**
 * Network Error Handler Service
 */
export class NetworkErrorHandler {
  private requestQueue: Array<{ url: string; options: RequestInit }> = [];
  private offlineCache = new Map<string, any>();

  isOnline(): boolean {
    return navigator.onLine;
  }

  async handleFetchError(
    url: string
  ): Promise<{ success: boolean; error?: Error; retry?: () => Promise<Response> }> {
    const retry = () => fetch(url);
    try {
      const response = await retry();
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return { success: true, retry };
    } catch (error) {
      const normalizedError =
        error instanceof Error ? error : new Error('Network error');
      return { 
        success: false, 
        error: normalizedError,
        retry
      };
    }
  }

  async retryRequest(
    url: string,
    options: { maxRetries?: number } = {}
  ): Promise<Response> {
    const { maxRetries = 3 } = options;
    let lastError: Error | undefined;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          return response;
        }
        throw new Error(`HTTP ${response.status}`);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Network error');
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }

    throw lastError ?? new Error('Network error');
  }

  async handleTimeout(
    url: string,
    timeout: number
  ): Promise<{ success: boolean; error?: Error }> {
    const controller = new AbortController();
    const abortTimeoutId = setTimeout(() => controller.abort(), timeout);
    let raceTimeoutId: ReturnType<typeof setTimeout> | undefined;

    try {
      const response = await Promise.race([
        fetch(url, { signal: controller.signal }),
        new Promise<never>((_, reject) => {
          raceTimeoutId = setTimeout(() => reject(new Error('Request timeout')), timeout);
        })
      ]);
      clearTimeout(abortTimeoutId);
      if (raceTimeoutId) clearTimeout(raceTimeoutId);
      if (!(response instanceof Response)) {
        throw new Error('Invalid response');
      }
      return { success: response.ok };
    } catch (error) {
      clearTimeout(abortTimeoutId);
      if (raceTimeoutId) clearTimeout(raceTimeoutId);
      const normalizedError =
        error instanceof Error ? error : new Error('Timeout error');
      return { 
        success: false, 
        error: normalizedError
      };
    }
  }

  getOfflineFallback(key: string, fallbackData: any): any {
    if (!this.isOnline()) {
      return this.offlineCache.get(key) || fallbackData;
    }
    return fallbackData;
  }

  queueRequest(url: string, options: RequestInit): void {
    this.requestQueue.push({ url, options });
  }

  getRequestQueue(): Array<{ url: string; options: RequestInit }> {
    return [...this.requestQueue];
  }

  async processQueuedRequests(): Promise<void> {
    if (!this.isOnline()) return;

    const queue = [...this.requestQueue];
    this.requestQueue = [];

    for (const request of queue) {
      try {
        await fetch(request.url, request.options);
      } catch (error) {
        console.error('Failed to process queued request:', error);
      }
    }
  }
}

// Export a default instance
export const networkErrorHandler = new NetworkErrorHandler();

// 便捷函数
export const networkUtils = {
  fetch: enhancedFetch,
  isOnline: () => networkMonitor.getStatus(),
  onStatusChange: (callback: (online: boolean) => void) => 
    networkMonitor.onStatusChange(callback),
  checkConnectivity: () => networkMonitor.checkConnectivity()
};
