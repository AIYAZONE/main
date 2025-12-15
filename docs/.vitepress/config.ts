import { defineConfig } from 'vitepress';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Helper to scan directories
function getSidebar(dirName, title) {
	const dirPath = path.resolve(__dirname, '../', dirName);
	if (!fs.existsSync(dirPath)) return [];

	const items = fs
		.readdirSync(dirPath)
		.map((file) => {
			if (
				file.startsWith('.') ||
				file === 'public' ||
				file === 'index.md' ||
				file === 'README.md'
			)
				return null;

			const absolutePath = path.join(dirPath, file);
			const stat = fs.statSync(absolutePath);

			if (stat.isDirectory()) {
				const children = fs
					.readdirSync(absolutePath)
					.filter((f) => f.endsWith('.md') && !f.startsWith('.'))
					.map((f) => {
						const name = f.replace('.md', '');
						const linkName = name === 'index' ? '' : name;
						const link = `/${dirName}/${file}/${linkName}`;
						return { text: name, link };
					})
					.sort((a, b) =>
						a.text.toLowerCase().localeCompare(b.text.toLowerCase())
					);

				if (children.length === 0) return null;

				return {
					text: file.charAt(0).toUpperCase() + file.slice(1),
					collapsed: true,
					items: children
				};
			} else if (file.endsWith('.md')) {
				return {
					text: file.replace('.md', ''),
					link: `/${dirName}/${file.replace('.md', '')}`
				};
			}
			return null;
		})
		.filter(Boolean);

	return [
		{
			text: title,
			items: items
		}
	];
}

export default defineConfig({
	title: 'AIYA Personal Brand',
	description: 'Personal Brand, Blog, and Documentation',
	ignoreDeadLinks: true,
	vite: {
		define: {
			__VUE_PROD_DEVTOOLS__: false,
			__VUE_I18N_FULL_INSTALL__: true,
			__VUE_I18N_LEGACY_API__: false,
			__INTLIFY_PROD_DEVTOOLS__: false
		},
		ssr: {
			noExternal: ['gsap', 'element-plus', 'vue-i18n']
		}
	},
	themeConfig: {
		logo: '/logo.jpg', // From merged public
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Blog', link: '/blog/' },
			{ text: 'PM', link: '/pm/' },
			{ text: 'Frontend', link: '/fe/' }
		],

		sidebar: {
			'/fe/': getSidebar('fe', 'Frontend Engineering'),
			'/pm/': getSidebar('pm', 'Product Management'),
			'/blog/': getSidebar('blog', 'Blog')
		},

		socialLinks: [{ icon: 'github', link: 'https://github.com/AIYAZONE' }]
	}
});
