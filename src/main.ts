import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'; // 引入 Element Plus CSS
import i18n from './i18n'; // 引入国际化配置
import { lazyImageDirective, lazyContentDirective } from './utils/lazyLoading';
import { performanceMonitor, measurePageLoad } from './utils/performance';
import { preload } from './services/preloadService';
import './style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(ElementPlus); // 使用 Element Plus
app.use(i18n); // 使用国际化

// 注册懒加载指令
app.directive('lazy-img', lazyImageDirective);
app.directive('lazy-content', lazyContentDirective);

// 初始化性能监控
measurePageLoad('main');

// 预加载关键资源
if (typeof window !== 'undefined') {
  // 在页面加载完成后预加载关键资源
  window.addEventListener('load', () => {
    preload.critical().catch(error => {
      console.warn('Failed to preload critical resources:', error);
    });
  });
}

app.mount('#app');
