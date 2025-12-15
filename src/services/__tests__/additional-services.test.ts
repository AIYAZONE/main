import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cacheService } from '../cacheService';
import { errorHandlingService } from '../errorHandlingService';
import { imageOptimizationService } from '../imageOptimizationService';
import { preloadService } from '../preloadService';
import { socialService } from '../socialService';

describe('Additional Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CacheService', () => {
    it('stores and retrieves cached data correctly', () => {
      const testData = { id: 1, name: 'Test' };
      const key = 'test-key';
      
      cacheService.set(key, testData);
      const retrieved = cacheService.get(key);
      
      expect(retrieved).toEqual(testData);
    });

    it('returns null for non-existent keys', () => {
      const result = cacheService.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('respects TTL and expires old data', async () => {
      const testData = { id: 1, name: 'Test' };
      const key = 'test-key-ttl';
      
      // Set data with very short TTL
      cacheService.set(key, testData, 1); // 1ms TTL
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const result = cacheService.get(key);
      expect(result).toBeNull();
    });

    it('clears cache correctly', () => {
      cacheService.set('key1', 'value1');
      cacheService.set('key2', 'value2');
      
      expect(cacheService.get('key1')).toBe('value1');
      expect(cacheService.get('key2')).toBe('value2');
      
      cacheService.clear();
      
      expect(cacheService.get('key1')).toBeNull();
      expect(cacheService.get('key2')).toBeNull();
    });

    it('removes specific keys correctly', () => {
      cacheService.set('key1', 'value1');
      cacheService.set('key2', 'value2');
      
      cacheService.remove('key1');
      
      expect(cacheService.get('key1')).toBeNull();
      expect(cacheService.get('key2')).toBe('value2');
    });

    it('checks if key exists correctly', () => {
      cacheService.set('existing-key', 'value');
      
      expect(cacheService.has('existing-key')).toBe(true);
      expect(cacheService.has('non-existing-key')).toBe(false);
    });
  });

  describe('ErrorHandlingService', () => {
    it('handles network errors correctly', () => {
      const networkError = new Error('Network error');
      networkError.name = 'NetworkError';
      
      const result = errorHandlingService.handleError(networkError);
      
      expect(result.type).toBe('network');
      expect(result.message).toContain('Network error');
      expect(result.userMessage).toBeDefined();
    });

    it('handles validation errors correctly', () => {
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      
      const result = errorHandlingService.handleError(validationError);
      
      expect(result.type).toBe('validation');
      expect(result.message).toContain('Validation failed');
    });

    it('handles generic errors correctly', () => {
      const genericError = new Error('Something went wrong');
      
      const result = errorHandlingService.handleError(genericError);
      
      expect(result.type).toBe('generic');
      expect(result.message).toBe('Something went wrong');
      expect(result.userMessage).toBeDefined();
    });

    it('logs errors when logging is enabled', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Test error');
      
      errorHandlingService.handleError(error, { log: true });
      
      expect(consoleSpy).toHaveBeenCalledWith('Error handled:', error);
      
      consoleSpy.mockRestore();
    });

    it('reports errors when reporting is enabled', () => {
      const reportSpy = vi.spyOn(errorHandlingService, 'reportError').mockImplementation(() => {});
      const error = new Error('Test error');
      
      errorHandlingService.handleError(error, { report: true });
      
      expect(reportSpy).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Test error',
        category: 'runtime',
        severity: 'medium'
      }));
      
      reportSpy.mockRestore();
    });

    it('creates user-friendly error messages', () => {
      const error = new Error('Internal server error');
      
      const userMessage = errorHandlingService.createUserFriendlyMessage(error);
      
      expect(userMessage).toBeDefined();
      expect(typeof userMessage).toBe('string');
      expect(userMessage.length).toBeGreaterThan(0);
    });
  });

  describe('ImageOptimizationService', () => {
    it('generates responsive image srcset correctly', () => {
      const baseSrc = '/images/test.jpg';
      const sizes = [480, 768, 1024, 1200];
      
      const srcset = imageOptimizationService.generateSrcSet(baseSrc, sizes);
      
      expect(srcset).toContain('/images/test-480w.jpg 480w');
      expect(srcset).toContain('/images/test-768w.jpg 768w');
      expect(srcset).toContain('/images/test-1024w.jpg 1024w');
      expect(srcset).toContain('/images/test-1200w.jpg 1200w');
    });

    it('optimizes image loading with lazy loading', () => {
      const imageElement = document.createElement('img');
      imageElement.src = '/images/test.jpg';
      
      imageOptimizationService.optimizeImageLoading(imageElement);
      
      expect(imageElement.loading).toBe('lazy');
      expect(imageElement.decoding).toBe('async');
    });

    it('creates placeholder for images', () => {
      const width = 400;
      const height = 300;
      
      const placeholder = imageOptimizationService.createPlaceholder(width, height);
      
      expect(placeholder).toContain('data:image/svg+xml');
      // Decode base64 to check SVG content
      const base64Content = placeholder.split(',')[1];
      const decodedSvg = atob(base64Content);
      expect(decodedSvg).toContain(`width="${width}"`);
      expect(decodedSvg).toContain(`height="${height}"`);
    });

    it('preloads critical images correctly', () => {
      const images = ['/images/hero.jpg', '/images/logo.png'];
      
      const preloadSpy = vi.spyOn(document.head, 'appendChild').mockImplementation(() => {});
      
      imageOptimizationService.preloadCriticalImages(images);
      
      expect(preloadSpy).toHaveBeenCalledTimes(images.length);
      
      preloadSpy.mockRestore();
    });

    it('compresses image quality correctly', () => {
      const originalSrc = '/images/test.jpg';
      const quality = 80;
      
      const compressedSrc = imageOptimizationService.compressImage(originalSrc, quality);
      
      expect(compressedSrc).toContain('quality=80');
    });
  });

  describe('PreloadService', () => {
    it('preloads resources correctly', () => {
      const resources = [
        { href: '/styles/main.css', as: 'style' },
        { href: '/scripts/main.js', as: 'script' },
        { href: '/images/hero.jpg', as: 'image' }
      ];
      
      const appendSpy = vi.spyOn(document.head, 'appendChild').mockImplementation(() => {});
      
      preloadService.preloadResources(resources);
      
      expect(appendSpy).toHaveBeenCalledTimes(resources.length);
      
      appendSpy.mockRestore();
    });

    it('preloads route components correctly', async () => {
      const routes = ['/about', '/portfolio', '/career'];
      
      const preloadPromises = preloadService.preloadRouteComponents(routes);
      
      expect(preloadPromises).toBeInstanceOf(Array);
      expect(preloadPromises.length).toBe(routes.length);
    });

    it('preloads critical data correctly', async () => {
      const dataEndpoints = [
        '/api/brand-info',
        '/api/projects',
        '/api/skills'
      ];
      
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response('{}', { status: 200 })
      );
      
      await preloadService.preloadCriticalData(dataEndpoints);
      
      expect(fetchSpy).toHaveBeenCalledTimes(dataEndpoints.length);
      
      fetchSpy.mockRestore();
    });

    it('manages preload priority correctly', () => {
      const highPriorityResources = [
        { href: '/styles/critical.css', as: 'style', priority: 'high' }
      ];
      const lowPriorityResources = [
        { href: '/styles/non-critical.css', as: 'style', priority: 'low' }
      ];
      
      const appendSpy = vi.spyOn(document.head, 'appendChild').mockImplementation(() => {});
      
      preloadService.preloadWithPriority(highPriorityResources, lowPriorityResources);
      
      // High priority resources should be preloaded first
      expect(appendSpy).toHaveBeenCalled();
      
      appendSpy.mockRestore();
    });
  });

  describe('SocialService', () => {
    it('fetches blog posts correctly', async () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Test Post',
          excerpt: 'Test excerpt',
          url: 'https://blog.example.com/test-post',
          publishedAt: new Date().toISOString(),
          tags: ['vue', 'typescript']
        }
      ];
      
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(mockPosts), { status: 200 })
      );
      
      const posts = await socialService.fetchBlogPosts();
      
      expect(posts).toEqual(mockPosts);
      expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('/api/blog'));
      
      fetchSpy.mockRestore();
    });

    it('fetches GitHub activity correctly', async () => {
      const mockActivity = [
        {
          id: '1',
          type: 'push',
          repo: 'user/repo',
          message: 'Updated README',
          timestamp: new Date().toISOString(),
          url: 'https://github.com/user/repo'
        }
      ];
      
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(mockActivity), { status: 200 })
      );
      
      const activity = await socialService.fetchGitHubActivity();
      
      expect(activity).toEqual(mockActivity);
      expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('github.com/api'));
      
      fetchSpy.mockRestore();
    });

    it('gets social media links correctly', () => {
      const links = socialService.getSocialMediaLinks();
      
      expect(links).toBeInstanceOf(Array);
      expect(links.length).toBeGreaterThan(0);
      
      links.forEach(link => {
        expect(link).toHaveProperty('platform');
        expect(link).toHaveProperty('url');
        expect(link).toHaveProperty('icon');
        expect(link).toHaveProperty('label');
      });
    });

    it('syncs external content correctly', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response('{}', { status: 200 })
      );
      
      await socialService.syncExternalContent();
      
      expect(fetchSpy).toHaveBeenCalled();
      
      fetchSpy.mockRestore();
    });

    it('handles API errors gracefully', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockRejectedValue(
        new Error('Network error')
      );
      
      const posts = await socialService.fetchBlogPosts();
      
      expect(posts).toEqual([]);
      
      fetchSpy.mockRestore();
    });

    it('caches social data correctly', async () => {
      const cacheSpy = vi.spyOn(cacheService, 'set');
      
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response('[]', { status: 200 })
      );
      
      await socialService.fetchBlogPosts();
      
      expect(cacheSpy).toHaveBeenCalled();
      
      fetchSpy.mockRestore();
      cacheSpy.mockRestore();
    });
  });
});