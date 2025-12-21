import { defineAsyncComponent, AsyncComponentLoader, Component } from 'vue';

/**
 * 创建懒加载组件的工厂函数
 * @param loader 组件加载器函数
 * @param options 懒加载选项
 */
export function createLazyComponent(
  loader: AsyncComponentLoader,
  options?: {
    loadingComponent?: Component;
    errorComponent?: Component;
    delay?: number;
    timeout?: number;
    suspensible?: boolean;
  }
) {
  return defineAsyncComponent({
    loader,
    loadingComponent: options?.loadingComponent,
    errorComponent: options?.errorComponent,
    delay: options?.delay ?? 200,
    timeout: options?.timeout ?? 3000,
    suspensible: options?.suspensible ?? false
  });
}

/**
 * 预加载组件
 * @param loader 组件加载器函数
 */
export function preloadComponent(loader: AsyncComponentLoader): Promise<Component> {
  return loader();
}

/**
 * 批量预加载组件
 * @param loaders 组件加载器函数数组
 */
export async function preloadComponents(loaders: AsyncComponentLoader[]): Promise<Component[]> {
  return Promise.all(loaders.map(loader => loader()));
}

/**
 * 基于路由的组件预加载
 * @param routeName 路由名称
 */
export function preloadRouteComponents(routeName: string): void {
  const componentMap: Record<string, AsyncComponentLoader[]> = {
    'Home': [
      () => import('../components/brand/BrandHero.vue'),
      () => import('../components/portfolio/PortfolioGrid.vue')
    ],
    'About': [
      () => import('../components/brand/BrandStory.vue'),
      () => import('../components/skills/SkillShowcase.vue'),
      () => import('../components/brand/CertificationDisplay.vue')
    ],
    'Portfolio': [
      () => import('../components/portfolio/PortfolioGrid.vue'),
      () => import('../components/portfolio/ProjectCard.vue')
    ],
    'Career': [
      () => import('../components/career/CareerRoadmap.vue'),
      () => import('../components/career/SWOTAnalysis.vue'),
      () => import('../components/career/LearningPath.vue')
    ],
    'Contact': [
      () => import('../components/contact/ContactForm.vue'),
      () => import('../components/social/SocialIntegration.vue')
    ]
  };

  const loaders = componentMap[routeName];
  if (loaders) {
    // 使用 requestIdleCallback 在浏览器空闲时预加载
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        preloadComponents(loaders);
      });
    } else {
      // 降级到 setTimeout
      setTimeout(() => {
        preloadComponents(loaders);
      }, 100);
    }
  }
}

/**
 * 图片懒加载指令
 */
export const lazyImageDirective = {
  mounted(el: HTMLImageElement, binding: { value: string }) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = binding.value;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    el.classList.add('lazy');
    imageObserver.observe(el);
  }
};

/**
 * 内容懒加载指令
 */
export const lazyContentDirective = {
  mounted(el: HTMLElement, binding: { value: () => void }) {
    const contentObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          binding.value();
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px'
    });

    contentObserver.observe(el);
  }
};

/**
 * 图片懒加载工具类
 */
export class LazyLoadingService {
  private observer: IntersectionObserver | null = null;

  constructor() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          if (element.tagName === 'IMG') {
            this.loadImage(element as HTMLImageElement);
          } else {
            this.loadBackgroundImage(element);
          }
          this.observer?.unobserve(element);
        }
      });
    });
  }

  observeElements(elements: Element[]) {
    elements.forEach(element => {
      this.observer?.observe(element);
    });
  }

  loadImage(img: HTMLImageElement) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;
    
    if (src) {
      img.src = src;
    }
    if (srcset) {
      img.srcset = srcset;
    }
    
    img.classList.add('loaded');
  }

  loadBackgroundImage(element: HTMLElement) {
    const bgSrc = element.dataset.bgSrc;
    if (bgSrc) {
      element.style.backgroundImage = `url(${bgSrc})`;
      element.classList.add('bg-loaded');
    }
  }

  preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  handleImageError(img: HTMLImageElement, fallbackSrc: string) {
    img.src = fallbackSrc;
    img.classList.add('error');
  }

}

// Export a default instance
export const lazyLoading = new LazyLoadingService();
