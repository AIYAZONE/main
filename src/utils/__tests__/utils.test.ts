import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LazyLoadingService } from '../lazyLoading';
import { networkErrorHandler } from '../networkErrorHandler';
import { performance } from '../performance';

describe('Utils', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('LazyLoading', () => {
		const OriginalIntersectionObserver = globalThis.IntersectionObserver;

		afterEach(() => {
			globalThis.IntersectionObserver = OriginalIntersectionObserver;
		});

		beforeEach(() => {
			globalThis.IntersectionObserver =
				globalThis.IntersectionObserver ??
				(class {
					constructor(_callback: any) {}
					observe() {}
					unobserve() {}
					disconnect() {}
				} as any);
		});

		it('creates intersection observer for lazy loading', () => {
			const mockObserver = {
				observe: vi.fn(),
				unobserve: vi.fn(),
				disconnect: vi.fn()
			};

			const mockIntersectionObserver = vi
				.fn()
				.mockImplementation(function () {
					return mockObserver as any;
				});
			global.IntersectionObserver = mockIntersectionObserver;

			const elements = [document.createElement('img')];

			const service = new LazyLoadingService();
			service.observeElements(elements);

			expect(mockIntersectionObserver).toHaveBeenCalled();
			expect(mockObserver.observe).toHaveBeenCalledWith(elements[0]);
		});

		it('loads images when they enter viewport', () => {
			const service = new LazyLoadingService();
			const img = document.createElement('img');
			img.dataset.src = '/images/test.jpg';
			img.dataset.srcset =
				'/images/test-480w.jpg 480w, /images/test-768w.jpg 768w';

			service.loadImage(img);

			expect(img.src).toContain('/images/test.jpg');
			expect(img.srcset).toBe(
				'/images/test-480w.jpg 480w, /images/test-768w.jpg 768w'
			);
			expect(img.classList.contains('loaded')).toBe(true);
		});

		it('loads background images correctly', () => {
			const service = new LazyLoadingService();
			const div = document.createElement('div');
			div.dataset.bgSrc = '/images/background.jpg';

			service.loadBackgroundImage(div);

			expect(div.style.backgroundImage).toContain(
				'/images/background.jpg'
			);
			expect(div.classList.contains('bg-loaded')).toBe(true);
		});

		it('preloads images correctly', async () => {
			const service = new LazyLoadingService();
			const imageSrc = '/images/test.jpg';
			const OriginalImage = (globalThis as any).Image;

			(globalThis as any).Image = class {
				onload: null | (() => void) = null;
				onerror: null | (() => void) = null;
				set src(_value: string) {
					setTimeout(() => this.onload?.(), 0);
				}
			};

			const loadPromise = service.preloadImage(imageSrc);
			await expect(loadPromise).resolves.toBeUndefined();
			(globalThis as any).Image = OriginalImage;
		});

		it('handles image load errors gracefully', async () => {
			const service = new LazyLoadingService();
			const imageSrc = '/images/nonexistent.jpg';
			const OriginalImage = (globalThis as any).Image;

			(globalThis as any).Image = class {
				onload: null | (() => void) = null;
				onerror: null | (() => void) = null;
				set src(_value: string) {
					setTimeout(
						() => this.onerror?.(new Event('error') as any),
						0
					);
				}
			};

			const loadPromise = service.preloadImage(imageSrc);
			await expect(loadPromise).rejects.toThrow();
			(globalThis as any).Image = OriginalImage;
		});

		it('provides fallback for images that fail to load', () => {
			const service = new LazyLoadingService();
			const img = document.createElement('img');
			img.src = '/images/nonexistent.jpg';

			service.handleImageError(img, '/images/fallback.jpg');

			expect(img.src).toContain('/images/fallback.jpg');
			expect(img.classList.contains('error')).toBe(true);
		});
	});

	describe('NetworkErrorHandler', () => {
		beforeEach(() => {
			Object.defineProperty(navigator, 'onLine', {
				writable: true,
				value: true
			});
			(networkErrorHandler as any).requestQueue = [];
		});

		it('detects network connectivity correctly', () => {
			// Mock navigator.onLine
			Object.defineProperty(navigator, 'onLine', {
				writable: true,
				value: true
			});

			expect(networkErrorHandler.isOnline()).toBe(true);

			Object.defineProperty(navigator, 'onLine', {
				writable: true,
				value: false
			});

			expect(networkErrorHandler.isOnline()).toBe(false);
		});

		it('handles fetch errors correctly', async () => {
			const fetchSpy = vi
				.spyOn(global, 'fetch')
				.mockRejectedValue(new Error('Network error'));

			const result = await networkErrorHandler.handleFetchError(
				'/api/test'
			);

			expect(result.success).toBe(false);
			expect(result.error).toBeDefined();
			expect(result.retry).toBeDefined();

			fetchSpy.mockRestore();
		});

		it('implements retry logic correctly', async () => {
			let callCount = 0;
			const fetchSpy = vi
				.spyOn(global, 'fetch')
				.mockImplementation(() => {
					callCount++;
					if (callCount < 3) {
						return Promise.reject(new Error('Network error'));
					}
					return Promise.resolve(new Response('{}', { status: 200 }));
				});

			const result = await networkErrorHandler.retryRequest('/api/test', {
				maxRetries: 3
			});

			expect(callCount).toBe(3);
			expect(result.ok).toBe(true);

			fetchSpy.mockRestore();
		});

		it('handles timeout errors correctly', async () => {
			const fetchSpy = vi
				.spyOn(global, 'fetch')
				.mockImplementation(
					() => new Promise((resolve) => setTimeout(resolve, 2000))
				);

			const result = await networkErrorHandler.handleTimeout(
				'/api/test',
				100
			);

			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('timeout');

			fetchSpy.mockRestore();
		});

		it('provides offline fallback correctly', () => {
			const fallbackData = { message: 'Offline mode' };

			const result = networkErrorHandler.getOfflineFallback(
				'test-key',
				fallbackData
			);

			expect(result).toEqual(fallbackData);
		});

		it('queues requests when offline', () => {
			Object.defineProperty(navigator, 'onLine', {
				writable: true,
				value: false
			});

			networkErrorHandler.queueRequest('/api/test', { method: 'POST' });

			const queue = networkErrorHandler.getRequestQueue();
			expect(queue.length).toBe(1);
			expect(queue[0].url).toBe('/api/test');
		});

		it('processes queued requests when back online', async () => {
			const fetchSpy = vi
				.spyOn(global, 'fetch')
				.mockResolvedValue(new Response('{}', { status: 200 }));

			// Queue some requests
			networkErrorHandler.queueRequest('/api/test1', { method: 'GET' });
			networkErrorHandler.queueRequest('/api/test2', { method: 'POST' });

			await networkErrorHandler.processQueuedRequests();

			expect(fetchSpy).toHaveBeenCalledTimes(2);

			fetchSpy.mockRestore();
		});
	});

	describe('Performance', () => {
		const originalPerformance = globalThis.performance;

		afterEach(() => {
			Object.defineProperty(globalThis, 'performance', {
				writable: true,
				value: originalPerformance
			});
		});

		it('measures performance correctly', () => {
			const mockPerformance = {
				now: vi.fn().mockReturnValueOnce(100).mockReturnValueOnce(200),
				mark: vi.fn(),
				measure: vi.fn()
			};

			global.performance = mockPerformance as any;

			performance.startMeasure('test-operation');
			performance.endMeasure('test-operation');

			expect(mockPerformance.mark).toHaveBeenCalledWith(
				'test-operation-start'
			);
			expect(mockPerformance.mark).toHaveBeenCalledWith(
				'test-operation-end'
			);
			expect(mockPerformance.measure).toHaveBeenCalledWith(
				'test-operation',
				'test-operation-start',
				'test-operation-end'
			);
		});

		it('tracks page load metrics correctly', () => {
			const mockNavigationTiming = {
				loadEventEnd: 2000,
				navigationStart: 1000,
				domContentLoadedEventEnd: 1500,
				responseEnd: 1200
			};

			Object.defineProperty(performance, 'timing', {
				value: mockNavigationTiming
			});

			const metrics = performance.getPageLoadMetrics();

			expect(metrics.totalLoadTime).toBe(1000); // 2000 - 1000
			expect(metrics.domContentLoaded).toBe(500); // 1500 - 1000
			expect(metrics.responseTime).toBe(200); // 1200 - 1000
		});

		it('monitors resource loading correctly', () => {
			const mockResourceEntries = [
				{
					name: '/styles/main.css',
					duration: 100,
					transferSize: 5000,
					initiatorType: 'link'
				},
				{
					name: '/scripts/main.js',
					duration: 200,
					transferSize: 10000,
					initiatorType: 'script'
				}
			];

			const getEntriesSpy = vi
				.spyOn(performance, 'getEntriesByType')
				.mockReturnValue(mockResourceEntries as any);

			const resources = performance.getResourceMetrics();

			expect(resources.length).toBe(2);
			expect(resources[0].name).toBe('/styles/main.css');
			expect(resources[1].name).toBe('/scripts/main.js');

			getEntriesSpy.mockRestore();
		});

		it('calculates Core Web Vitals correctly', async () => {
			// Mock Web Vitals API
			const mockWebVitals = {
				getCLS: vi.fn((callback) => callback({ value: 0.1 })),
				getFID: vi.fn((callback) => callback({ value: 50 })),
				getLCP: vi.fn((callback) => callback({ value: 1500 }))
			};

			global.webVitals = mockWebVitals;

			const vitals = await performance.getCoreWebVitals();

			expect(vitals.cls).toBe(0.1);
			expect(vitals.fid).toBe(50);
			expect(vitals.lcp).toBe(1500);
		});

		it('optimizes performance based on device capabilities', () => {
			// Mock device capabilities
			Object.defineProperty(navigator, 'hardwareConcurrency', {
				value: 4
			});

			Object.defineProperty(navigator, 'connection', {
				value: {
					effectiveType: '4g',
					downlink: 10
				}
			});

			const optimizations = performance.getPerformanceOptimizations();

			expect(optimizations.enableHighQualityImages).toBe(true);
			expect(optimizations.enableAnimations).toBe(true);
			expect(optimizations.preloadResources).toBe(true);
		});

		it('provides performance budget monitoring', () => {
			const budget = {
				totalSize: 1000000, // 1MB
				imageSize: 500000, // 500KB
				scriptSize: 300000, // 300KB
				styleSize: 200000 // 200KB
			};

			const currentUsage = {
				totalSize: 1200000, // 1.2MB - over budget
				imageSize: 400000, // 400KB - under budget
				scriptSize: 350000, // 350KB - over budget
				styleSize: 150000 // 150KB - under budget
			};

			const budgetStatus = performance.checkPerformanceBudget(
				budget,
				currentUsage
			);

			expect(budgetStatus.withinBudget).toBe(false);
			expect(budgetStatus.violations.length).toBe(2); // total and script
			expect(budgetStatus.violations).toContain('totalSize');
			expect(budgetStatus.violations).toContain('scriptSize');
		});
	});
});
