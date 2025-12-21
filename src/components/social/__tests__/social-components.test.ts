import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';
import SocialIntegration from '../SocialIntegration.vue';

describe('Social Components', () => {
	let i18n: any;
	let pinia: any;

	beforeEach(() => {
		i18n = createI18n({
			legacy: false,
			locale: 'en',
			messages: {
				en: {
					'social.title': 'Social Media',
					'social.github': 'GitHub',
					'social.blog': 'Blog',
					'social.linkedin': 'LinkedIn',
					'social.twitter': 'Twitter',
					'social.follow': 'Follow me on',
					'social.latest': 'Latest Updates',
					'social.viewAll': 'View All'
				}
			}
		});

		pinia = createPinia();
	});

	describe('SocialIntegration', () => {
		it('renders social integration component', () => {
			const wrapper = mount(SocialIntegration, {
				global: {
					plugins: [i18n, pinia]
				}
			});

			expect(wrapper.find('.social-integration').exists()).toBe(true);
		});

		it('displays social media links', () => {
			const wrapper = mount(SocialIntegration, {
				global: {
					plugins: [i18n, pinia]
				}
			});

			const socialLinks = wrapper.findAll('.social-link');
			expect(socialLinks.length).toBeGreaterThan(0);
		});

		it('shows latest blog posts when available', () => {
			const wrapper = mount(SocialIntegration, {
				global: {
					plugins: [i18n, pinia]
				}
			});

			const blogSection = wrapper.find('.blog-posts');
			expect(blogSection.exists()).toBe(true);
		});

		it('displays GitHub activity when available', async () => {
			vi.useFakeTimers();

			try {
				const wrapper = mount(SocialIntegration, {
					global: {
						plugins: [i18n, pinia]
					}
				});

				await vi.advanceTimersByTimeAsync(1600);
				await wrapper.vm.$nextTick();
				await wrapper.vm.$nextTick();

				const githubSection = wrapper.find('.github-activity');
				expect(githubSection.exists()).toBe(true);
			} finally {
				vi.useRealTimers();
			}
		});

		it('handles external link clicks correctly', async () => {
			const wrapper = mount(SocialIntegration, {
				global: {
					plugins: [i18n, pinia]
				}
			});

			const externalLinks = wrapper.findAll('a[target="_blank"]');
			expect(externalLinks.length).toBeGreaterThan(0);

			// Check that external links have proper security attributes
			externalLinks.forEach((link) => {
				expect(link.attributes('rel')).toContain('noopener');
				expect(link.attributes('rel')).toContain('noreferrer');
			});
		});
	});
});
