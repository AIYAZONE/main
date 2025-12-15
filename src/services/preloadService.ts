/**
 * 资源预加载服务
 */

interface PreloadOptions {
  priority?: 'high' | 'low';
  crossOrigin?: 'anonymous' | 'use-credentials';
  as?: 'script' | 'style' | 'image' | 'font' | 'fetch';
}

interface PreloadResource {
  url: string;
  type: 'script' | 'style' | 'image' | 'font' | 'data';
  priority: 'high' | 'low';
  loaded: boolean;
  error?: Error;
}

class PreloadService {
  private preloadedResources = new Map<string, PreloadResource>();
  private preloadQueue: PreloadResource[] = [];
  private isProcessing = false;

  /**
   * 预加载脚本
   */
  preloadScript(url: string, options: PreloadOptions = {}): Promise<void> {
    return this.preloadResource(url, 'script', options);
  }

  /**
   * 预加载样式表
   */
  preloadStyle(url: string, options: PreloadOptions = {}): Promise<void> {
    return this.preloadResource(url, 'style', options);
  }

  /**
   * 预加载图片
   */
  preloadImage(url: string, options: PreloadOptions = {}): Promise<void> {
    return this.preloadResource(url, 'image', options);
  }

  /**
   * 预加载字体
   */
  preloadFont(url: string, options: PreloadOptions = {}): Promise<void> {
    return this.preloadResource(url, 'font', { ...options, crossOrigin: 'anonymous' });
  }

  /**
   * 预加载数据
   */
  preloadData(url: string, options: PreloadOptions = {}): Promise<void> {
    return this.preloadResource(url, 'data', options);
  }

  /**
   * 批量预加载资源
   */
  async preloadResources(resources: Array<{
    url?: string;
    href?: string; // For backward compatibility with tests
    type?: 'script' | 'style' | 'image' | 'font' | 'data';
    as?: 'script' | 'style' | 'image' | 'font' | 'fetch'; // For backward compatibility with tests
    options?: PreloadOptions;
  }>): Promise<void> {
    // Handle both new and old format
    resources.forEach(resource => {
      const url = resource.url || resource.href;
      const type = resource.type || resource.as;
      
      if (url && type) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = type === 'fetch' ? 'script' : type;
        document.head.appendChild(link);
      }
    });
  }

  /**
   * 预加载关键资源
   */
  async preloadCriticalResources(): Promise<void> {
    const criticalResources = [
      // 关键CSS
      { url: '/css/critical.css', type: 'style' as const, options: { priority: 'high' as const } },
      
      // 关键字体
      { url: '/fonts/primary-font.woff2', type: 'font' as const, options: { priority: 'high' as const } },
      
      // 首屏图片
      { url: '/images/hero-image.webp', type: 'image' as const, options: { priority: 'high' as const } }
      
      // 注意：暂时移除API调用，因为后端API尚未实现
      // { url: '/api/brand/info', type: 'data' as const, options: { priority: 'high' as const } }
    ];

    await this.preloadResources(criticalResources);
  }

  /**
   * 预加载路由相关资源
   */
  async preloadRouteResources(routeName: string): Promise<void> {
    const routeResourceMap: Record<string, Array<{
      url: string;
      type: 'script' | 'style' | 'image' | 'font' | 'data';
      options?: PreloadOptions;
    }>> = {
      'Home': [
        // 暂时移除API调用，使用静态资源
        { url: '/images/portfolio-preview.webp', type: 'image' }
      ],
      'About': [
        // 暂时移除API调用，使用静态资源
        { url: '/images/certifications.webp', type: 'image' }
      ],
      'Portfolio': [
        // 暂时移除API调用，使用静态资源
        { url: '/images/portfolio-grid.webp', type: 'image' }
      ],
      'Career': [
        // 暂时移除API调用，使用静态资源
        { url: '/images/career-roadmap.webp', type: 'image' }
      ],
      'Contact': [
        // 暂时移除API调用，使用静态资源
        { url: '/images/contact-form.webp', type: 'image' }
      ]
    };

    const resources = routeResourceMap[routeName];
    if (resources) {
      await this.preloadResources(resources);
    }
  }

  /**
   * 智能预加载 - 基于用户行为预测
   */
  smartPreload(currentRoute: string, userBehavior?: {
    timeOnPage: number;
    scrollDepth: number;
    interactions: string[];
  }): void {
    // 基于当前路由预测下一个可能访问的路由
    const routePredictions: Record<string, string[]> = {
      'Home': ['About', 'Portfolio'],
      'About': ['Portfolio', 'Career'],
      'Portfolio': ['Contact', 'Career'],
      'Career': ['Contact', 'About'],
      'Contact': ['Portfolio', 'About']
    };

    const predictedRoutes = routePredictions[currentRoute] || [];
    
    // 使用 requestIdleCallback 在浏览器空闲时预加载
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        predictedRoutes.forEach(route => {
          this.preloadRouteResources(route);
        });
      });
    } else {
      // 降级到 setTimeout
      setTimeout(() => {
        predictedRoutes.forEach(route => {
          this.preloadRouteResources(route);
        });
      }, 1000);
    }
  }

  /**
   * 预加载资源的核心方法
   */
  private async preloadResource(
    url: string, 
    type: 'script' | 'style' | 'image' | 'font' | 'data',
    options: PreloadOptions = {}
  ): Promise<void> {
    // 检查是否已经预加载
    const existing = this.preloadedResources.get(url);
    if (existing) {
      if (existing.loaded) {
        return Promise.resolve();
      }
      if (existing.error) {
        return Promise.reject(existing.error);
      }
    }

    const resource: PreloadResource = {
      url,
      type,
      priority: options.priority || 'low',
      loaded: false
    };

    this.preloadedResources.set(url, resource);

    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        resolve();
        return;
      }

      try {
        switch (type) {
          case 'script':
            this.preloadScriptResource(url, options, resource, resolve, reject);
            break;
          case 'style':
            this.preloadStyleResource(url, options, resource, resolve, reject);
            break;
          case 'image':
            this.preloadImageResource(url, options, resource, resolve, reject);
            break;
          case 'font':
            this.preloadFontResource(url, options, resource, resolve, reject);
            break;
          case 'data':
            this.preloadDataResource(url, options, resource, resolve, reject);
            break;
          default:
            reject(new Error(`Unsupported resource type: ${type}`));
        }
      } catch (error) {
        resource.error = error as Error;
        reject(error);
      }
    });
  }

  private preloadScriptResource(
    url: string,
    options: PreloadOptions,
    resource: PreloadResource,
    resolve: () => void,
    reject: (error: Error) => void
  ): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = url;
    
    if (options.crossOrigin) {
      link.crossOrigin = options.crossOrigin;
    }

    link.onload = () => {
      resource.loaded = true;
      resolve();
    };

    link.onerror = () => {
      const error = new Error(`Failed to preload script: ${url}`);
      resource.error = error;
      reject(error);
    };

    document.head.appendChild(link);
  }

  private preloadStyleResource(
    url: string,
    options: PreloadOptions,
    resource: PreloadResource,
    resolve: () => void,
    reject: (error: Error) => void
  ): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = url;

    link.onload = () => {
      resource.loaded = true;
      resolve();
    };

    link.onerror = () => {
      const error = new Error(`Failed to preload style: ${url}`);
      resource.error = error;
      reject(error);
    };

    document.head.appendChild(link);
  }

  private preloadImageResource(
    url: string,
    options: PreloadOptions,
    resource: PreloadResource,
    resolve: () => void,
    reject: (error: Error) => void
  ): void {
    const img = new Image();
    
    img.onload = () => {
      resource.loaded = true;
      resolve();
    };

    img.onerror = () => {
      const error = new Error(`Failed to preload image: ${url}`);
      resource.error = error;
      reject(error);
    };

    img.src = url;
  }

  private preloadFontResource(
    url: string,
    options: PreloadOptions,
    resource: PreloadResource,
    resolve: () => void,
    reject: (error: Error) => void
  ): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = url;
    link.crossOrigin = 'anonymous';

    link.onload = () => {
      resource.loaded = true;
      resolve();
    };

    link.onerror = () => {
      const error = new Error(`Failed to preload font: ${url}`);
      resource.error = error;
      reject(error);
    };

    document.head.appendChild(link);
  }

  private async preloadDataResource(
    url: string,
    options: PreloadOptions,
    resource: PreloadResource,
    resolve: () => void,
    reject: (error: Error) => void
  ): Promise<void> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // 预加载数据但不解析，只是确保在缓存中
      await response.text();
      
      resource.loaded = true;
      resolve();
    } catch (error) {
      const err = new Error(`Failed to preload data: ${url} - ${error}`);
      resource.error = err;
      console.warn('Preload data failed (non-critical):', err.message);
      // 对于数据预加载失败，我们不应该阻塞应用，所以resolve而不是reject
      resolve();
    }
  }

  /**
   * 获取预加载统计信息
   */
  getPreloadStats(): {
    total: number;
    loaded: number;
    failed: number;
    pending: number;
  } {
    const resources = Array.from(this.preloadedResources.values());
    
    return {
      total: resources.length,
      loaded: resources.filter(r => r.loaded).length,
      failed: resources.filter(r => r.error).length,
      pending: resources.filter(r => !r.loaded && !r.error).length
    };
  }

  /**
   * 清理预加载缓存
   */
  clearPreloadCache(): void {
    this.preloadedResources.clear();
    this.preloadQueue = [];
  }

  /**
   * 检查资源是否已预加载
   */
  isPreloaded(url: string): boolean {
    const resource = this.preloadedResources.get(url);
    return resource ? resource.loaded : false;
  }

  /**
   * 预加载路由组件
   */
  preloadRouteComponents(routes: string[]): Promise<void>[] {
    return routes.map(route => this.preloadRouteResources(route));
  }

  /**
   * 预加载关键数据
   */
  async preloadCriticalData(endpoints: string[]): Promise<void> {
    const promises = endpoints.map(endpoint => 
      this.preloadData(endpoint, { priority: 'high' })
    );
    await Promise.allSettled(promises);
  }

  /**
   * 按优先级预加载资源
   */
  preloadWithPriority(
    highPriorityResources: string[], 
    lowPriorityResources: string[]
  ): void {
    // 先预加载高优先级资源
    highPriorityResources.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = 'fetch';
      document.head.appendChild(link);
    });

    // 延迟预加载低优先级资源
    setTimeout(() => {
      lowPriorityResources.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = 'fetch';
        document.head.appendChild(link);
      });
    }, 100);
  }
}

// 创建全局预加载服务实例
export const preloadService = new PreloadService();

// 便捷函数
export const preload = {
  script: (url: string, options?: PreloadOptions) => 
    preloadService.preloadScript(url, options),
  
  style: (url: string, options?: PreloadOptions) => 
    preloadService.preloadStyle(url, options),
  
  image: (url: string, options?: PreloadOptions) => 
    preloadService.preloadImage(url, options),
  
  font: (url: string, options?: PreloadOptions) => 
    preloadService.preloadFont(url, options),
  
  data: (url: string, options?: PreloadOptions) => 
    preloadService.preloadData(url, options),
  
  critical: () => 
    preloadService.preloadCriticalResources(),
  
  route: (routeName: string) => 
    preloadService.preloadRouteResources(routeName),
  
  smart: (currentRoute: string, userBehavior?: any) => 
    preloadService.smartPreload(currentRoute, userBehavior)
};