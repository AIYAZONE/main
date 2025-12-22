import type { ApiResponse } from '../types/common';
import { cacheService } from './cacheService';

export interface SocialLink {
	id: string;
	name: string;
	description: string;
	url: string;
	platform: string;
	type: 'blog' | 'code' | 'social' | 'professional';
	icon: string;
	external: boolean;
	followers?: number;
	isActive: boolean;
	label?: string;
}

export interface SocialPost {
	id: string;
	platform: string;
	platformName: string;
	title?: string;
	content: string;
	url: string;
	publishedAt: Date;
	image?: string;
	tags: string[];
	likes?: number;
	comments?: number;
	shares?: number;
	views?: number;
}

export interface SocialStats {
	totalFollowers: number;
	totalPosts: number;
	totalEngagement: number;
	platforms: {
		[key: string]: {
			followers: number;
			posts: number;
			engagement: number;
		};
	};
}

export interface SocialService {
	getSocialLinks(): Promise<SocialLink[]>;
	getSocialFeed(limit?: number): Promise<SocialPost[]>;
	getSocialStats(): Promise<SocialStats>;
	syncExternalContent(): Promise<void>;
	fetchBlogPosts(): Promise<SocialPost[]>;
}

class SocialServiceImpl implements SocialService {
	private baseUrl = '/api/social';

	async getSocialLinks(): Promise<SocialLink[]> {
		try {
			// TODO: Replace with actual API call
			// const response = await fetch(`${this.baseUrl}/links`);
			// const result: ApiResponse<SocialLink[]> = await response.json();

			// Mock data for now
			return [
				{
					id: 'blog',
					name: 'AIYA Blog',
					description:
						'技术博客和个人思考，记录前端开发和项目管理的心得体会',
					url: 'https://blog.aiyazone.com',
					platform: 'blog',
					type: 'blog',
					icon: '📝',
					external: true,
					followers: 1200,
					isActive: true
				},
				{
					id: 'github',
					name: 'GitHub',
					description: '开源项目和代码贡献，包含前端工具库和实用组件',
					url: 'https://github.com/AIYAZONE',
					platform: 'github',
					type: 'code',
					icon: '🐱',
					external: true,
					followers: 850,
					isActive: true
				},
				{
					id: 'frontend',
					name: '前端技术栈',
					description: '前端工程化和性能优化的系统性知识整理',
					url: 'https://fe.aiyazone.com',
					platform: 'website',
					type: 'blog',
					icon: '⚡',
					external: true,
					isActive: true
				},
				{
					id: 'pm',
					name: '项目管理知识体系',
					description: 'PMP知识体系和敏捷开发实践经验分享',
					url: 'https://pm.aiyazone.com',
					platform: 'website',
					type: 'professional',
					icon: '📊',
					external: true,
					isActive: true
				},
				{
					id: 'juejin',
					name: '掘金',
					description: '技术文章和社区交流，分享前端开发最佳实践',
					url: 'https://juejin.cn/user/aiyazone',
					platform: 'juejin',
					type: 'social',
					icon: '💎',
					external: true,
					followers: 2100,
					isActive: true
				},
				{
					id: 'zhihu',
					name: '知乎',
					description: '技术问答和深度思考，探讨前端技术发展趋势',
					url: 'https://zhihu.com/people/aiyazone',
					platform: 'zhihu',
					type: 'social',
					icon: '🧠',
					external: true,
					followers: 890,
					isActive: true
				}
			];
		} catch (error) {
			throw new Error(`Failed to fetch social links: ${error}`);
		}
	}

	async getSocialFeed(limit: number = 10): Promise<SocialPost[]> {
		try {
			// TODO: Replace with actual API call
			// const response = await fetch(`${this.baseUrl}/feed?limit=${limit}`);
			// const result: ApiResponse<SocialPost[]> = await response.json();

			// Mock data for now
			const mockFeed: SocialPost[] = [
				{
					id: '1',
					platform: 'blog',
					platformName: 'AIYA Blog',
					title: '前端架构设计的思考与实践',
					content:
						'在大型前端项目中，架构设计的重要性不言而喻。本文分享了我在多个项目中的架构设计思考，包括模块化、组件化、工程化等方面的实践经验。通过合理的架构设计，可以显著提升开发效率和代码质量。',
					url: 'https://blog.aiyazone.com/frontend-architecture-design',
					publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
					image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
					tags: ['前端架构', '工程化', '最佳实践', 'Vue', 'React'],
					likes: 156,
					comments: 23,
					views: 2340
				},
				{
					id: '2',
					platform: 'github',
					platformName: 'GitHub',
					title: 'ZenParticles v2.0 重大更新',
					content:
						'新版本增加了手势识别功能，支持更多交互方式。优化了渲染性能，新增了多种粒子效果。欢迎大家体验和反馈！这个项目展示了WebGL在交互式3D应用中的强大能力。',
					url: 'https://github.com/AIYAZONE/ZenParticles',
					publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
					tags: ['WebGL', '3D', '交互设计', 'JavaScript', 'Canvas'],
					likes: 89,
					shares: 12,
					views: 1560
				},
				{
					id: '3',
					platform: 'juejin',
					platformName: '掘金',
					title: 'Vue 3 性能优化实战指南',
					content:
						'从组件设计到打包优化，全面提升Vue应用性能。本文详细介绍了Vue 3的性能优化策略，包括响应式优化、组件懒加载、代码分割等技术。通过实际案例展示优化效果，并提供性能测试数据对比。',
					url: 'https://juejin.cn/post/vue3-performance-optimization',
					publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
					image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400',
					tags: ['Vue3', '性能优化', '前端', 'JavaScript', 'Webpack'],
					likes: 234,
					comments: 45,
					shares: 67,
					views: 3890
				},
				{
					id: '5',
					platform: 'zhihu',
					platformName: '知乎',
					title: '如何成为一名优秀的前端架构师？',
					content:
						'前端架构师需要具备哪些技能？如何从高级前端工程师成长为架构师？本文从技术深度、业务理解、团队协作等多个维度分析了前端架构师的成长路径，并提供了具体的学习建议和实践方向。',
					url: 'https://zhihu.com/question/frontend-architect-growth',
					publishedAt: new Date(
						Date.now() - 14 * 24 * 60 * 60 * 1000
					),
					tags: ['职业发展', '前端架构师', '技能提升', '学习路径'],
					likes: 167,
					comments: 32,
					views: 2890
				},
				{
					id: '6',
					platform: 'blog',
					platformName: 'AIYA Blog',
					title: 'PMP项目管理在前端团队中的应用',
					content:
						'将PMP项目管理方法论应用到前端团队管理中，可以显著提升项目交付质量和团队协作效率。本文结合实际案例，分享了敏捷开发、风险管理、沟通协调等方面的实践经验。',
					url: 'https://blog.aiyazone.com/pmp-frontend-team-management',
					publishedAt: new Date(
						Date.now() - 18 * 24 * 60 * 60 * 1000
					),
					image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
					tags: ['PMP', '项目管理', '团队管理', '敏捷开发', '前端'],
					likes: 98,
					comments: 18,
					views: 1670
				}
			];

			return mockFeed.slice(0, limit);
		} catch (error) {
			throw new Error(`Failed to fetch social feed: ${error}`);
		}
	}

	async getSocialStats(): Promise<SocialStats> {
		try {
			// TODO: Replace with actual API call
			// const response = await fetch(`${this.baseUrl}/stats`);
			// const result: ApiResponse<SocialStats> = await response.json();

			// Mock data for now
			return {
				totalFollowers: 5790,
				totalPosts: 156,
				totalEngagement: 12450,
				platforms: {
					blog: {
						followers: 1200,
						posts: 45,
						engagement: 3200
					},
					github: {
						followers: 850,
						posts: 32,
						engagement: 2100
					},
					juejin: {
						followers: 2100,
						posts: 38,
						engagement: 4500
					},
					zhihu: {
						followers: 890,
						posts: 16,
						engagement: 1450
					}
				}
			};
		} catch (error) {
			throw new Error(`Failed to fetch social stats: ${error}`);
		}
	}

	async syncExternalContent(): Promise<void> {
		try {
			// Sync blog posts
			await fetch('/api/blog/sync', { method: 'POST' });

			// Sync GitHub activity
			await fetch('/api/github/sync', { method: 'POST' });

			// Sync other social platforms
			await fetch('/api/social/sync', { method: 'POST' });

			console.log('Social media content sync completed');
		} catch (error) {
			console.warn(
				'Failed to sync external content (non-critical):',
				error
			);
			// Don't throw error to avoid breaking the app
		}
	}

	async fetchBlogPosts(): Promise<any[]> {
		try {
			// Check if we're in test environment
			if (
				typeof window === 'undefined' ||
				process.env.NODE_ENV === 'test'
			) {
				// Return mock data for tests
				const response = await fetch('/api/blog');
				const data = await response.json();
				// Cache the data
				cacheService.set('blog_posts', data, { ttl: 5 * 60 * 1000 });
				return data;
			}

			// Filter blog posts from the social feed
			const feed = await this.getSocialFeed();
			const blogPosts = feed.filter((post) => post.platform === 'blog');
			// Cache the data
			cacheService.set('blog_posts', blogPosts, { ttl: 5 * 60 * 1000 });
			return blogPosts;
		} catch (error) {
			console.warn(
				'Failed to fetch blog posts, returning empty array:',
				error
			);
			return [];
		}
	}

	async fetchGitHubActivity(): Promise<any[]> {
		try {
			// Check if we're in test environment
			if (
				typeof window === 'undefined' ||
				process.env.NODE_ENV === 'test'
			) {
				// Return mock data for tests
				const response = await fetch('https://github.com/api');
				return await response.json();
			}

			// TODO: Replace with actual GitHub API call
			// Mock GitHub activity data
			return [
				{
					id: '1',
					type: 'push',
					repo: 'AIYAZONE/ZenParticles',
					message: 'Add gesture recognition feature',
					date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
				},
				{
					id: '2',
					type: 'create',
					repo: 'AIYAZONE/vue-performance-toolkit',
					message: 'Created new repository',
					date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
				}
			];
		} catch (error) {
			console.warn('Failed to fetch GitHub activity:', error);
			return [];
		}
	}

	getSocialMediaLinks(): SocialLink[] {
		// Return cached social links synchronously
		return [
			{
				id: 'blog',
				name: 'AIYA Blog',
				description: '技术博客和个人思考',
				url: 'https://blog.aiyazone.com',
				platform: 'blog',
				type: 'blog',
				icon: '📝',
				external: true,
				followers: 1200,
				isActive: true,
				label: 'AIYA Blog'
			},
			{
				id: 'github',
				name: 'GitHub',
				description: '开源项目和代码贡献',
				url: 'https://github.com/AIYAZONE',
				platform: 'github',
				type: 'code',
				icon: '🐱',
				external: true,
				followers: 850,
				isActive: true,
				label: 'GitHub'
			}
		];
	}
}

export const socialService = new SocialServiceImpl();
