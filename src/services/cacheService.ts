/**
 * 缓存服务 - 提供多层缓存策略
 */

interface CacheItem<T> {
	data: T;
	timestamp: number;
	ttl: number;
	key: string;
}

interface CacheOptions {
	ttl?: number; // 生存时间（毫秒）
	maxSize?: number; // 最大缓存项数
	storage?: 'memory' | 'localStorage' | 'sessionStorage';
}

class CacheService {
	private memoryCache = new Map<string, CacheItem<any>>();
	private defaultTTL = 5 * 60 * 1000; // 5分钟
	private maxSize = 100;

	constructor() {
		if (typeof window !== 'undefined') {
			setInterval(() => {
				this.cleanup();
			}, 60 * 1000);
		}
	}

	/**
	 * 设置缓存
	 */
	set<T>(
		key: string,
		data: T,
		optionsOrTtl: CacheOptions | number = {}
	): void {
		// Handle both old signature (key, data, ttl) and new signature (key, data, options)
		const options: CacheOptions =
			typeof optionsOrTtl === 'number'
				? { ttl: optionsOrTtl }
				: optionsOrTtl;
		const { ttl = this.defaultTTL, storage = 'memory' } = options;

		const cacheItem: CacheItem<T> = {
			data,
			timestamp: Date.now(),
			ttl,
			key
		};

		switch (storage) {
			case 'memory':
				this.setMemoryCache(key, cacheItem);
				break;
			case 'localStorage':
				this.setStorageCache(key, cacheItem, localStorage);
				break;
			case 'sessionStorage':
				this.setStorageCache(key, cacheItem, sessionStorage);
				break;
		}
	}

	/**
	 * 获取缓存
	 */
	get<T>(
		key: string,
		storage: 'memory' | 'localStorage' | 'sessionStorage' = 'memory'
	): T | null {
		switch (storage) {
			case 'memory':
				return this.getMemoryCache<T>(key);
			case 'localStorage':
				return this.getStorageCache<T>(key, localStorage);
			case 'sessionStorage':
				return this.getStorageCache<T>(key, sessionStorage);
			default:
				return null;
		}
	}

	/**
	 * 删除缓存
	 */
	remove(
		key: string,
		storage: 'memory' | 'localStorage' | 'sessionStorage' = 'memory'
	): void {
		switch (storage) {
			case 'memory':
				this.memoryCache.delete(key);
				break;
			case 'localStorage':
				if (typeof window !== 'undefined') {
					localStorage.removeItem(this.getStorageKey(key));
				}
				break;
			case 'sessionStorage':
				if (typeof window !== 'undefined') {
					sessionStorage.removeItem(this.getStorageKey(key));
				}
				break;
		}
	}

	/**
	 * 清空所有缓存
	 */
	clear(storage?: 'memory' | 'localStorage' | 'sessionStorage'): void {
		if (!storage || storage === 'memory') {
			this.memoryCache.clear();
		}

		if (typeof window !== 'undefined') {
			if (!storage || storage === 'localStorage') {
				this.clearStorageCache(localStorage);
			}
			if (!storage || storage === 'sessionStorage') {
				this.clearStorageCache(sessionStorage);
			}
		}
	}

	/**
	 * 检查缓存是否存在且有效
	 */
	has(
		key: string,
		storage: 'memory' | 'localStorage' | 'sessionStorage' = 'memory'
	): boolean {
		return this.get(key, storage) !== null;
	}

	/**
	 * 获取或设置缓存（如果不存在则执行获取函数）
	 */
	async getOrSet<T>(
		key: string,
		fetcher: () => Promise<T>,
		options: CacheOptions = {}
	): Promise<T> {
		const cached = this.get<T>(key, options.storage);
		if (cached !== null) {
			return cached;
		}

		const data = await fetcher();
		this.set(key, data, options);
		return data;
	}

	/**
	 * 内存缓存操作
	 */
	private setMemoryCache<T>(key: string, item: CacheItem<T>): void {
		// 检查缓存大小限制
		if (this.memoryCache.size >= this.maxSize) {
			// 删除最旧的缓存项
			const oldestKey = this.memoryCache.keys().next().value;
			if (oldestKey) {
				this.memoryCache.delete(oldestKey);
			}
		}

		this.memoryCache.set(key, item);
	}

	private getMemoryCache<T>(key: string): T | null {
		const item = this.memoryCache.get(key);
		if (!item) {
			return null;
		}

		// 检查是否过期
		if (Date.now() - item.timestamp > item.ttl) {
			this.memoryCache.delete(key);
			return null;
		}

		return item.data;
	}

	/**
	 * 存储缓存操作
	 */
	private setStorageCache<T>(
		key: string,
		item: CacheItem<T>,
		storage: Storage
	): void {
		if (typeof window === 'undefined') return;

		try {
			const storageKey = this.getStorageKey(key);
			storage.setItem(storageKey, JSON.stringify(item));
		} catch (error) {
			console.warn('Failed to set storage cache:', error);
		}
	}

	private getStorageCache<T>(key: string, storage: Storage): T | null {
		if (typeof window === 'undefined') return null;

		try {
			const storageKey = this.getStorageKey(key);
			const itemStr = storage.getItem(storageKey);
			if (!itemStr) {
				return null;
			}

			const item: CacheItem<T> = JSON.parse(itemStr);

			// 检查是否过期
			if (Date.now() - item.timestamp > item.ttl) {
				storage.removeItem(storageKey);
				return null;
			}

			return item.data;
		} catch (error) {
			console.warn('Failed to get storage cache:', error);
			return null;
		}
	}

	private clearStorageCache(storage: Storage): void {
		if (typeof window === 'undefined') return;

		try {
			const keysToRemove: string[] = [];
			for (let i = 0; i < storage.length; i++) {
				const key = storage.key(i);
				if (key && key.startsWith('aiyazone_cache_')) {
					keysToRemove.push(key);
				}
			}
			keysToRemove.forEach((key) => storage.removeItem(key));
		} catch (error) {
			console.warn('Failed to clear storage cache:', error);
		}
	}

	private getStorageKey(key: string): string {
		return `aiyazone_cache_${key}`;
	}

	/**
	 * 清理过期缓存
	 */
	private cleanup(): void {
		const now = Date.now();

		// 清理内存缓存
		for (const [key, item] of this.memoryCache.entries()) {
			if (now - item.timestamp > item.ttl) {
				this.memoryCache.delete(key);
			}
		}

		// 清理存储缓存
		if (typeof window !== 'undefined') {
			this.cleanupStorageCache(localStorage);
			this.cleanupStorageCache(sessionStorage);
		}
	}

	private cleanupStorageCache(storage: Storage): void {
		try {
			const keysToRemove: string[] = [];
			for (let i = 0; i < storage.length; i++) {
				const key = storage.key(i);
				if (key && key.startsWith('aiyazone_cache_')) {
					const itemStr = storage.getItem(key);
					if (itemStr) {
						try {
							const item = JSON.parse(itemStr);
							if (Date.now() - item.timestamp > item.ttl) {
								keysToRemove.push(key);
							}
						} catch {
							// 无效的缓存项，删除
							keysToRemove.push(key);
						}
					}
				}
			}
			keysToRemove.forEach((key) => storage.removeItem(key));
		} catch (error) {
			console.warn('Failed to cleanup storage cache:', error);
		}
	}

	/**
	 * 获取缓存统计信息
	 */
	getStats(): {
		memorySize: number;
		localStorageSize: number;
		sessionStorageSize: number;
	} {
		let localStorageSize = 0;
		let sessionStorageSize = 0;

		if (typeof window !== 'undefined') {
			// 计算 localStorage 缓存大小
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key && key.startsWith('aiyazone_cache_')) {
					localStorageSize++;
				}
			}

			// 计算 sessionStorage 缓存大小
			for (let i = 0; i < sessionStorage.length; i++) {
				const key = sessionStorage.key(i);
				if (key && key.startsWith('aiyazone_cache_')) {
					sessionStorageSize++;
				}
			}
		}

		return {
			memorySize: this.memoryCache.size,
			localStorageSize,
			sessionStorageSize
		};
	}
}

// 创建全局缓存服务实例
export const cacheService = new CacheService();

// 便捷函数
export const cache = {
	set: <T>(key: string, data: T, options?: CacheOptions) =>
		cacheService.set(key, data, options),

	get: <T>(
		key: string,
		storage?: 'memory' | 'localStorage' | 'sessionStorage'
	) => cacheService.get<T>(key, storage),

	delete: (
		key: string,
		storage?: 'memory' | 'localStorage' | 'sessionStorage'
	) => cacheService.remove(key, storage),

	clear: (storage?: 'memory' | 'localStorage' | 'sessionStorage') =>
		cacheService.clear(storage),

	has: (
		key: string,
		storage?: 'memory' | 'localStorage' | 'sessionStorage'
	) => cacheService.has(key, storage),

	getOrSet: <T>(
		key: string,
		fetcher: () => Promise<T>,
		options?: CacheOptions
	) => cacheService.getOrSet(key, fetcher, options)
};

// 预定义的缓存键
export const CACHE_KEYS = {
	BRAND_INFO: 'brand_info',
	SKILLS_DATA: 'skills_data',
	PORTFOLIO_DATA: 'portfolio_data',
	CAREER_DATA: 'career_data',
	SOCIAL_DATA: 'social_data',
	USER_PREFERENCES: 'user_preferences',
	LANGUAGE_PACK: 'language_pack'
} as const;

// 缓存配置预设
export const CACHE_CONFIGS = {
	SHORT: { ttl: 5 * 60 * 1000, storage: 'memory' as const }, // 5分钟，内存
	MEDIUM: { ttl: 30 * 60 * 1000, storage: 'sessionStorage' as const }, // 30分钟，会话
	LONG: { ttl: 24 * 60 * 60 * 1000, storage: 'localStorage' as const }, // 24小时，本地
	PERSISTENT: {
		ttl: 7 * 24 * 60 * 60 * 1000,
		storage: 'localStorage' as const
	} // 7天，本地
} as const;
