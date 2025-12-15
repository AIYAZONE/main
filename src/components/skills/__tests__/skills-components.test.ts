import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';
import SkillShowcase from '../SkillShowcase.vue';
import SkillRadar from '../SkillRadar.vue';
import ExperienceTimeline from '../ExperienceTimeline.vue';
import SkillsDemo from '../SkillsDemo.vue';
import type { SkillCategory, Skill, ExperienceItem } from '../../../types/skills';

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
      const vueSkill = skillItems.find(item => item.text().includes('Vue.js'));
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
      const frontendFilter = filterButtons.find(btn => btn.text().includes('Frontend'));
      if (frontendFilter) {
        await frontendFilter.trigger('click');
        
        // Should only show frontend skills
        const visibleSkills = wrapper.findAll('.skill-item:not(.hidden)');
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

      const skillBars = wrapper.findAll('.skill-level-bar');
      expect(skillBars.length).toBeGreaterThan(0);
      
      // Check that skill bars have correct width based on level
      const vueSkillBar = skillBars[0];
      const style = vueSkillBar.attributes('style');
      expect(style).toContain('90%'); // Level 9 = 90%
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
      expect(wrapper.find('.radar-chart').exists()).toBe(true);
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

      const radarSvg = wrapper.find('.radar-chart svg');
      expect(radarSvg.exists()).toBe(true);
      expect(radarSvg.attributes('width')).toBeDefined();
      expect(radarSvg.attributes('height')).toBeDefined();
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

      const radarAxes = wrapper.findAll('.radar-axis');
      expect(radarAxes.length).toBe(mockSkillCategories.length);
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

      const radarPoints = wrapper.findAll('.radar-point');
      expect(radarPoints.length).toBe(mockSkillCategories.length);
    });

    it('provides interactive hover functionality', async () => {
      const wrapper = mount(SkillRadar, {
        props: {
          categories: mockSkillCategories,
          maxLevel: 10
        },
        global: {
          plugins: [i18n, pinia]
        }
      });

      const radarPoint = wrapper.find('.radar-point');
      await radarPoint.trigger('mouseenter');
      
      expect(wrapper.find('.radar-tooltip').exists()).toBe(true);
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
      expect(wrapper.find('.timeline-title').exists()).toBe(true);
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

      const timelineItems = wrapper.findAll('.timeline-item');
      expect(timelineItems.length).toBe(mockExperienceItems.length);
      
      // Check that current position is marked
      const currentItem = timelineItems.find(item => 
        item.text().includes('Current Company')
      );
      expect(currentItem).toBeDefined();
      expect(currentItem?.classes()).toContain('timeline-item--current');
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

      const firstItem = wrapper.find('.timeline-item');
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

      const achievementsList = wrapper.findAll('.achievement-item');
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

      const durationElements = wrapper.findAll('.duration');
      expect(durationElements.length).toBeGreaterThan(0);
      
      // Check that duration is calculated for completed positions
      const completedItem = durationElements.find(el => 
        el.text().includes('years') || el.text().includes('months')
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

    it('provides interactive skill demonstrations', () => {
      const wrapper = mount(SkillsDemo, {
        global: {
          plugins: [i18n, pinia]
        }
      });

      const demoItems = wrapper.findAll('.demo-item');
      expect(demoItems.length).toBeGreaterThan(0);
    });

    it('shows code examples and live demos', () => {
      const wrapper = mount(SkillsDemo, {
        global: {
          plugins: [i18n, pinia]
        }
      });

      const codeBlocks = wrapper.findAll('.code-block');
      const liveDemos = wrapper.findAll('.live-demo');
      
      expect(codeBlocks.length).toBeGreaterThan(0);
      expect(liveDemos.length).toBeGreaterThan(0);
    });

    it('provides skill filtering and search', async () => {
      const wrapper = mount(SkillsDemo, {
        global: {
          plugins: [i18n, pinia]
        }
      });

      const searchInput = wrapper.find('.demo-search');
      if (searchInput.exists()) {
        await searchInput.setValue('Vue');
        
        const filteredDemos = wrapper.findAll('.demo-item:not(.hidden)');
        expect(filteredDemos.length).toBeGreaterThan(0);
      }
    });
  });
});