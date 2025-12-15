import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		{
			name: 'docs-redirect',
			configureServer(server) {
				server.middlewares.use((req, res, next) => {
					if (req.url && /^\/(fe|pm|blog)(\/|$)/.test(req.url)) {
						console.log(
							`[Docs Redirect] Redirecting ${req.url} to docs server...`
						);
						res.writeHead(302, {
							Location: `http://localhost:5174${req.url}`,
							'Cache-Control':
								'no-store, no-cache, must-revalidate, proxy-revalidate',
							Pragma: 'no-cache',
							Expires: '0'
						});
						res.end();
						return;
					}
					next();
				});
			}
		}
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src') // 将 @ 指向 src 目录
		}
	},
	build: {
		// 代码分割配置
		rollupOptions: {
			output: {
				// 手动分块配置
				manualChunks: {
					// 第三方库分块
					vendor: ['vue', 'vue-router', 'pinia'],
					ui: ['vue-i18n'],
					// 组件分块
					'brand-components': [
						'./src/components/brand/BrandHero.vue',
						'./src/components/brand/BrandStory.vue',
						'./src/components/brand/BrandLogo.vue',
						'./src/components/brand/CertificationDisplay.vue'
					],
					'skill-components': [
						'./src/components/skills/SkillShowcase.vue',
						'./src/components/skills/SkillRadar.vue',
						'./src/components/skills/ExperienceTimeline.vue',
						'./src/components/skills/SkillsDemo.vue'
					],
					'portfolio-components': [
						'./src/components/portfolio/PortfolioGrid.vue',
						'./src/components/portfolio/ProjectCard.vue'
					],
					'career-components': [
						'./src/components/career/SWOTAnalysis.vue',
						'./src/components/career/CareerRoadmap.vue',
						'./src/components/career/LearningPath.vue'
					],
					'ui-components': [
						'./src/components/ui/Button.vue',
						'./src/components/ui/Card.vue',
						'./src/components/ui/Modal.vue',
						'./src/components/ui/ResponsiveCard.vue',
						'./src/components/ui/TouchButton.vue'
					]
				},
				// 文件命名配置
				chunkFileNames: (chunkInfo) => {
					const facadeModuleId = chunkInfo.facadeModuleId
						? chunkInfo.facadeModuleId
								.split('/')
								.pop()
								?.replace('.vue', '')
						: 'chunk';
					return `js/[name]-[hash].js`;
				},
				entryFileNames: 'js/[name]-[hash].js',
				assetFileNames: (assetInfo) => {
					const info = assetInfo.name?.split('.') || [];
					const ext = info[info.length - 1];
					if (
						/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(
							assetInfo.name || ''
						)
					) {
						return 'images/[name]-[hash].[ext]';
					}
					if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
						return 'fonts/[name]-[hash].[ext]';
					}
					if (/\.css$/i.test(assetInfo.name || '')) {
						return 'css/[name]-[hash].[ext]';
					}
					return 'assets/[name]-[hash].[ext]';
				}
			}
		},
		// 构建优化
		chunkSizeWarningLimit: 1000,
		// 压缩配置
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true
			}
		},
		// 源码映射
		sourcemap: false,
		// 资源内联阈值
		assetsInlineLimit: 4096
	},
	// 依赖预构建优化
	optimizeDeps: {
		include: ['vue', 'vue-router', 'pinia', 'vue-i18n'],
		exclude: []
	},
	// 服务器配置
	server: {
		// 预热常用文件
		warmup: {
			clientFiles: [
				'./src/main.ts',
				'./src/App.vue',
				'./src/views/Home.vue',
				'./src/components/brand/BrandHero.vue'
			]
		}
	}
});
