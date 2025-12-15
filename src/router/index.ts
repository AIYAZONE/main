import { createRouter, createWebHistory } from 'vue-router';
import { preloadRouteComponents } from '../utils/lazyLoading';
import HomeView from '../views/Home.vue';
// 其他视图使用懒加载
const PortfolioView = () => import('../views/Portfolio.vue');
const NoneView = () => import('../views/404.vue');

const routes = [
	{
		path: '/',
		name: 'Home',
		component: HomeView,
		meta: {
			title: 'nav.home',
			icon: '🏠'
		}
	},
	{
		path: '/about',
		name: 'About',
		component: () => import('../views/About.vue'),
		meta: {
			title: 'nav.about',
			icon: '👤'
		}
	},

	{
		path: '/portfolio',
		name: 'Portfolio',
		component: PortfolioView,
		meta: {
			title: 'nav.portfolio',
			icon: '💼'
		}
	},
	{
		path: '/career',
		name: 'Career',
		component: () => import('../views/Career.vue'),
		meta: {
			title: 'nav.career',
			icon: '🚀'
		},
		children: [
			{
				path: '',
				name: 'CareerOverview',
				component: () => import('../components/career/CareerRoadmap.vue')
			},
			{
				path: 'swot',
				name: 'SWOT',
				component: () => import('../components/career/SWOTAnalysis.vue'),
				meta: {
					title: 'career.swot.title'
				}
			},
			{
				path: 'roadmap',
				name: 'Roadmap',
				component: () => import('../components/career/CareerRoadmap.vue'),
				meta: {
					title: 'career.roadmap.title'
				}
			},
			{
				path: 'learning',
				name: 'Learning',
				component: () => import('../components/career/LearningPath.vue'),
				meta: {
					title: 'career.learning.title'
				}
			}
		]
	},
	{
		path: '/contact',
		name: 'Contact',
		component: () => import('../views/Contact.vue'),
		meta: {
			title: 'nav.contact',
			icon: '📧'
		}
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'NotFound',
		component: NoneView,
		meta: {
			title: 'errors.notFound'
		}
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior(to, from, savedPosition) {
		// 如果有保存的位置（浏览器前进/后退），恢复到该位置
		if (savedPosition) {
			return savedPosition;
		}
		
		// 如果有锚点，滚动到锚点位置
		if (to.hash) {
			return {
				el: to.hash,
				behavior: 'smooth'
			};
		}
		
		// 默认滚动到顶部
		return { top: 0, behavior: 'smooth' };
	}
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
	// 设置页面标题
	if (to.meta?.title) {
		// 这里可以根据需要设置页面标题
		// document.title = `${to.meta.title} - AIYAZONE`;
	}
	
	// 添加页面加载状态
	if (typeof window !== 'undefined') {
		document.body.classList.add('page-loading');
	}
	
	// 预加载下一个可能访问的路由组件
	if (to.name && typeof to.name === 'string') {
		preloadRouteComponents(to.name);
	}
	
	next();
});

// 全局后置钩子
router.afterEach((to, from) => {
	// 移除页面加载状态
	if (typeof window !== 'undefined') {
		setTimeout(() => {
			document.body.classList.remove('page-loading');
		}, 100);
	}
});

export default router;
