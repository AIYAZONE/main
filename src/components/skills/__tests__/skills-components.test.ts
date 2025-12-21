import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';
import SkillShowcase from '../SkillShowcase.vue';
import SkillRadar from '../SkillRadar.vue';
import ExperienceTimeline from '../ExperienceTimeline.vue';
import SkillsDemo from '../SkillsDemo.vue';
import type {
	SkillCategory,
	Skill,
	ExperienceItem
} from '../../../types/skills';

describe('Skills Components', () => {
	let i18n: any;
	let pinia: any;
	let mockSkillCategories: SkillCategory[];
	let mockExperienceItems: ExperienceItem[];

	beforeEach(() => {
		i18n = createI18n({
			legacy: false,
			locale: 'en',
			messages: {
				en: {
					'skills.title': 'Professional Skills',
					'skills.categories.frontend': 'Frontend Development',
					'skills.categories.management': 'Project Management',
					'skills.categories.leadership': 'Team Leadership',
					'skills.level': 'Level',
					'skills.experience': 'Experience',
					'skills.projects': 'Projects',
					'skills.yearsExp': 'years',
					'skills.radar.title': 'Skills Radar',
					'experience.title': 'Professional Experience',
					'experience.current': 'Current',
					'experience.achievements': 'Key Achievements',
					'experience.technologies': 'Technologies Used'
				}
			}
		});

		pinia = createPinia();

		mockSkillCategories = [
			{
				id: 'frontend',
				name: 'Frontend Development',
				type: 'frontend',
				skills: [
					{
						id: 'vue',
						name: 'Vue.js',
						level: 9,
						yearsOfExperience: 5,
						projects: ['Project A', 'Project B'],
						description: 'Advanced Vue.js development'
					},
					{
						id: 'typescript',
						name: 'TypeScript',
						level: 8,
						yearsOfExperience: 4,
						projects: ['Project C', 'Project D'],
						description: 'Strong TypeScript skills'
					}
				]
			},
			{
				id: 'management',
				name: 'Project Management',
				type: 'management',
				skills: [
					{
						id: 'pmp',
						name: 'PMP',
						level: 8,
						yearsOfExperience: 3,
						projects: ['Management Project A'],
						description: 'Project Management Professional'
					}
				]
			},
			{
				id: 'leadership',
				name: 'Team Leadership',
				type: 'leadership',
				skills: [
					{
						id: 'team-lead',
						name: 'Team Leadership',
						level: 7,
						yearsOfExperience: 3,
						projects: ['Team Project A'],
						description: 'Leading development teams'
					}
				]
			}
		];

		mockExperienceItems = [
			{
				id: '1',
				company: 'Tech Company A',
				position: 'Senior Frontend Developer',
				startDate: new Date('2020-01-01'),
				endDate: new Date('2023-12-31'),
				achievements: [
					'Led frontend architecture redesign',
					'Improved performance by 40%',
					'Mentored 5 junior developers'
				],
				technologies: ['Vue.js', 'TypeScript', 'Webpack']
			},
			{
				id: '2',
				company: 'Tech Company B',
				position: 'Frontend Developer',
				startDate: new Date('2018-01-01'),
				endDate: new Date('2019-12-31'),
				achievements: [
					'Built responsive web applications',
					'Implemented CI/CD pipeline'
				],
				technologies: ['React', 'JavaScript', 'Node.js']
			},
			{
				id: '3',
				company: 'Current Company',
				position: 'Frontend Architect',
				startDate: new Date('2024-01-01'),
				achievements: [
					'Designing scalable frontend architecture',
					'Leading technical decisions'
				],
				technologies: ['Vue 3', 'TypeScript', 'Vite']
			}
		];
	});

	describe('SkillShowcase', () => {
		it('renders skill showcase with provided data', () => {
			const wrapper = mount(SkillShowcase, {
				props: {
					skills: mockSkillCategories,
					certifications: [],
					experience: mockExperienceItems
				},
				global: {
					plugins: [i18n, pinia]
				}
			});

			expect(wrapper.find('.skill-showcase').exists()).toBe(true);
			expect(wrapper.find('.skills-title').exists()).toBe(true);
		});

		it('displays skill categories correctly', () => {
			const wrapper = mount(SkillShowcase, {
				props: {
					skills: mockSkillCategories,
					certifications: [],
					experience: mockExperienceItems
				},
				global: {
					plugins: [i18n, pinia]
				}
			});

			const skillCategories = wrapper.findAll('.skill-category');
			expect(skillCategories.length).toBe(mockSkillCategories.length);

			// Check category titles
			expect(skillCategories[0].text()).toContain('Frontend Development');
			expect(skillCategories[1].text()).toContain('Project Management');
			expect(skillCategories[2].text()).toContain('Team Leadership');
		});

		it('displays individual skills with correct information', () => {
			const wrapper = mount(SkillShowcase, {
				props: {
					skills: mockSkillCategories,
					certifications: [],
					experience: mockExperienceItems
				},
				global: {
					plugins: [i18n, pinia]
				}
			});

			const skillItems = wrapper.findAll('.skill-item');
			expect(skillItems.length).toBeGreaterThan(0);

			// Check first skill (Vue.js)
			const vueSkill = skillItems.find((item) =>
				item.text().includes('Vue.js')
			);
			expect(vueSkill).toBeDefined();
			expect(vueSkill?.text()).toContain('Level 9');
			expect(vueSkill?.text()).toContain('5 years');
		});

		it('provides skill filtering functionality', async () => {
			const wrapper = mount(SkillShowcase, {
				props: {
					skills: mockSkillCategories,
					certifications: [],
					experience: mockExperienceItems
				},
				global: {
					plugins: [i18n, pinia]
				}
			});

			const filterButtons = wrapper.findAll('.filter-btn');
			expect(filterButtons.length).toBeGreaterThan(0);

			// Click on frontend filter
			const frontendFilter = filterButtons.find((btn) =>
				btn.text().includes('Frontend')
			);
			if (frontendFilter) {
				await frontendFilter.trigger('click');

				// Should only show frontend skills
				const visibleSkills = wrapper.findAll(
					'.skill-item:not(.hidden)'
				);
				expect(visibleSkills.length).toBe(2); // Vue.js and TypeScript
			}
		});

		it('displays skill level visualization', () => {
			const wrapper = mount(SkillShowcase, {
				props: {
					skills: mockSkillCategories,
					certifications: [],
					experience: mockExperienceItems
				},
				global: {
					plugins: [i18n, pinia]
				}
			});

			const skillBarFills = wrapper.findAll('.skill-level-bar__fill');
			expect(skillBarFills.length).toBeGreaterThan(0);

			const style = skillBarFills[0].attributes('style');
			expect(style).toContain('90%');
		});
	});

	describe('SkillRadar', () => {
		it('renders skill radar with provided data', () => {
			const wrapper = mount(SkillRadar, {
				props: {
					categories: mockSkillCategories,
					maxLevel: 10
				},
				global: {
					plugins: [i18n, pinia]
				}
			});

			expect(wrapper.find('.skill-radar').exists()).toBe(true);
			expect(wrapper.find('.skill-radar__chart-container').exists()).toBe(
				true
			);
			expect(wrapper.find('.skill-radar__canvas').exists()).toBe(true);
		});

		it('creates radar chart with correct dimensions', () => {
			const wrapper = mount(SkillRadar, {
				props: {
					categories: mockSkillCategories,
					maxLevel: 10
				},
				global: {
					plugins: [i18n, pinia]
				}
			});

			const canvas = wrapper.find('.skill-radar__canvas');
			expect(canvas.exists()).toBe(true);
			expect(canvas.attributes('width')).toBe('400');
			expect(canvas.attributes('height')).toBe('400');
		});

		it('displays skill categories as radar axes', () => {
			const wrapper = mount(SkillRadar, {
				props: {
					categories: mockSkillCategories,
					maxLevel: 10
				},
				global: {
					plugins: [i18n, pinia]
				}
			});

			const legendItems = wrapper.findAll('.skill-radar__legend-item');
			expect(legendItems.length).toBe(mockSkillCategories.length);
		});

		it('shows skill values on radar chart', () => {
			const wrapper = mount(SkillRadar, {
				props: {
					categories: mockSkillCategories,
					maxLevel: 10
				},
				global: {
					plugins: [i18n, pinia]
				}
			});

			const legendValues = wrapper.findAll('.skill-radar__legend-value');
			expect(legendValues.length).toBe(mockSkillCategories.length);
			expect(legendValues[0].text()).toContain('/10');
		});

		it('switches between radar, bars and matrix views', async () => {
			const wrapper = mount(SkillRadar, {
				props: {
					categories: mockSkillCategories,
					maxLevel: 10
				},
				global: {
					plugins: [i18n, pinia]
				}
			});

			const viewButtons = wrapper.findAll('.skill-radar__view-btn');
			expect(viewButtons.length).toBeGreaterThanOrEqual(3);

			await viewButtons[1].trigger('click');
			expect(wrapper.find('.skill-bars').exists()).toBe(true);

			await viewButtons[2].trigger('click');
			expect(wrapper.find('.skill-matrix').exists()).toBe(true);
		});
	});

	describe('ExperienceTimeline', () => {
		it('renders experience timeline with provided data', () => {
			const wrapper = mount(ExperienceTimeline, {
				props: {
					experienceItems: mockExperienceItems
				},
				global: {
					plugins: [i18n, pinia]
				}
			});

			expect(wrapper.find('.experience-timeline').exists()).toBe(true);
			expect(wrapper.find('.experience-timeline__title').exists()).toBe(
				true
			);
		});

		it('displays experience items in chronological order', () => {
			const wrapper = mount(ExperienceTimeline, {
				props: {
					experienceItems: mockExperienceItems
				},
				global: {
					plugins: [i18n, pinia]
				}
			});

			const timelineItems = wrapper.findAll('.timeline__item');
			expect(timelineItems.length).toBe(mockExperienceItems.length);

			// Check that current position is marked
			const currentItem = timelineItems.find((item) =>
				item.text().includes('Current Company')
			);
			expect(currentItem).toBeDefined();
			expect(currentItem?.classes()).toContain('timeline__item--current');
		});

		it('displays company and position information', () => {
			const wrapper = mount(ExperienceTimeline, {
				props: {
					experienceItems: mockExperienceItems
				},
				global: {
					plugins: [i18n, pinia]
				}
			});

			const firstItem = wrapper.find('.timeline__item');
			expect(firstItem.text()).toContain('Current Company');
			expect(firstItem.text()).toContain('Frontend Architect');
		});

		it('shows achievements and technologies', () => {
			const wrapper = mount(ExperienceTimeline, {
				props: {
					experienceItems: mockExperienceItems
				},
				global: {
					plugins: [i18n, pinia]
				}
			});

			const achievementsList = wrapper.findAll('.achievement-list__item');
			expect(achievementsList.length).toBeGreaterThan(0);

			const techList = wrapper.findAll('.tech-tag');
			expect(techList.length).toBeGreaterThan(0);
			expect(techList[0].text()).toContain('Vue 3');
		});

		it('calculates and displays duration correctly', () => {
			const wrapper = mount(ExperienceTimeline, {
				props: {
					experienceItems: mockExperienceItems
				},
				global: {
					plugins: [i18n, pinia]
				}
			});

			const durationElements = wrapper.findAll(
				'.experience-card__period'
			);
			expect(durationElements.length).toBeGreaterThan(0);

			// Check that duration is calculated for completed positions
			const completedItem = durationElements.find(
				(el) => el.text().includes('年') || el.text().includes('个月')
			);
			expect(completedItem).toBeDefined();
		});
	});

	describe('SkillsDemo', () => {
		it('renders skills demo component', () => {
			const wrapper = mount(SkillsDemo, {
				global: {
					plugins: [i18n, pinia]
				}
			});

			expect(wrapper.find('.skills-demo').exists()).toBe(true);
		});

		it('renders the demo sections', () => {
			const wrapper = mount(SkillsDemo, {
				global: {
					plugins: [i18n, pinia]
				}
			});

			const demoSections = wrapper.findAll('.demo-section');
			expect(demoSections.length).toBe(3);
		});

		it('includes the showcase, radar, and timeline components', () => {
			const wrapper = mount(SkillsDemo, {
				global: {
					plugins: [i18n, pinia]
				}
			});

			expect(wrapper.findComponent(SkillShowcase).exists()).toBe(true);
			expect(wrapper.findComponent(SkillRadar).exists()).toBe(true);
			expect(wrapper.findComponent(ExperienceTimeline).exists()).toBe(
				true
			);
		});
	});
});
