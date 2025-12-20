import createVueTypeScriptConfig from '@vue/eslint-config-typescript';

export default [
	{
		ignores: [
			'dist/**',
			'docs/**',
			'node_modules/**',
			'src/**/__tests__/**',
			'src/**/*.{test,spec}.*'
		]
	},
	...createVueTypeScriptConfig(),
	{
		files: ['**/*.{js,jsx,ts,tsx,mjs,cjs,vue}'],
		languageOptions: {
			globals: {
				window: 'readonly',
				document: 'readonly',
				navigator: 'readonly',
				location: 'readonly',
				history: 'readonly',
				localStorage: 'readonly',
				sessionStorage: 'readonly',
				fetch: 'readonly',
				Request: 'readonly',
				Response: 'readonly',
				Headers: 'readonly',
				AbortController: 'readonly',
				Notification: 'readonly',
				performance: 'readonly',
				URL: 'readonly',
				URLSearchParams: 'readonly',
				setTimeout: 'readonly',
				clearTimeout: 'readonly',
				setInterval: 'readonly',
				clearInterval: 'readonly',
				requestAnimationFrame: 'readonly',
				cancelAnimationFrame: 'readonly',
				console: 'readonly',
				process: 'readonly'
			}
		},
		rules: {
			'no-undef': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': 'off'
		}
	}
];
