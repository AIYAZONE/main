import { createRouter, createWebHistory } from 'vue-router';
import DemoView from '@/views/Demo.vue';
import HomeView from '@/views/Home.vue';
import BrandView from '@/views/Brand.vue';
import NoneView from '@/views/404.vue';
import HelloWorld from '@/components/HelloWorld.vue';

const routes = [
	{
		path: '/',
		name: 'Home',
		component: HomeView
	},
	{
		path: '/brand',
		name: 'Brand',
		component: BrandView
	},
	{
		path: '/:pathMatch(.*)*', // 捕获所有未匹配的路径
		name: '404',
		component: NoneView
	},
	{
		path: '/hello',
		name: 'Hello',
		component: HelloWorld,
		props: { msg: 'Hello, World!' } // 传递 props
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes
});

export default router;
