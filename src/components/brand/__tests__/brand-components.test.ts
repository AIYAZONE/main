import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';
import BrandHero from '../BrandHero.vue';
import BrandStory from '../BrandStory.vue';
import BrandLogo from '../BrandLogo.vue';
import CertificationDisplay from '../CertificationDisplay.vue';
import type { BrandInfo, Certification, StorySection, TimelineEvent } from '../../../types/brand';

describe('Brand Components', () => {
  let i18n: any;
  let pinia: any;
  let mockBrandInfo: BrandInfo;
  let mockCertifications: Certification[];
  let mockStoryData: { story: StorySection[]; timeline: TimelineEvent[]; philosophy: string[] };

  beforeEach(() => {
    i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: {
        en: {
          'brand.title': 'AIYAZONE',
          'brand.subtitle': 'Frontend Architect & Tech Lead',
          'brand.intro': 'Professional introduction',
          'brand.valueProposition': 'Value Proposition',
          'brand.story.title': 'Brand Story',
          'brand.certifications.title': 'Certifications',
          'brand.certifications.verify': 'Verify',
          'brand.timeline.title': 'Timeline',
          'brand.philosophy.title': 'Philosophy'
        }
      }
    });

    pinia = createPinia();

    mockBrandInfo = {
      id: '1',
      name: 'AIYAZONE',
      title: 'Frontend Architect',
      subtitle: 'Tech Lead & Project Manager',
      intro: 'Professional frontend developer with 10 years experience',
      profileImage: '/images/profile.jpg',
      location: 'Shenzhen',
      age: 34,
      experience: 10,
      tagline: 'Building the future of web',
      valueProposition: [
        'Frontend Architecture Design',
        'Performance Optimization',
        'Team Leadership'
      ]
    };

    mockCertifications = [
      {
        id: '1',
        name: 'PMP',
        issuer: 'PMI',
        issueDate: new Date('2023-01-01'),
        credentialId: 'PMP123456',
        imageUrl: '/images/pmp.jpg',
        verificationUrl: 'https://pmi.org/verify'
      },
      {
        id: '2',
        name: 'ACP',
        issuer: 'PMI',
        issueDate: new Date('2023-06-01'),
        credentialId: 'ACP123456',
        imageUrl: '/images/acp.jpg',
        verificationUrl: 'https://pmi.org/verify'
      }
    ];

    mockStoryData = {
      story: [
        {
          id: '1',
          title: 'Early Career',
          content: 'Started as a frontend developer',
          period: '2014-2018',
          highlights: ['First web project', 'Learned Vue.js']
        }
      ],
      timeline: [
        {
          id: '1',
          date: new Date('2014-01-01'),
          title: 'Started Frontend Development',
          description: 'Began career in web development',
          type: 'career',
          importance: 'high'
        }
      ],
      philosophy: [
        'Code quality is paramount',
        'User experience drives everything',
        'Continuous learning is essential'
      ]
    };
  });

  describe('BrandHero', () => {
    it('renders brand hero with provided data', () => {
      const wrapper = mount(BrandHero, {
        props: {
          title: mockBrandInfo.name,
          subtitle: mockBrandInfo.subtitle,
          intro: mockBrandInfo.intro,
          profileImage: mockBrandInfo.profileImage,
          certifications: mockCertifications
        },
        global: {
          plugins: [i18n, pinia]
        }
      });

      expect(wrapper.find('.brand-hero').exists()).toBe(true);
      expect(wrapper.find('.hero-title').text()).toContain(mockBrandInfo.name);
      expect(wrapper.find('.hero-subtitle').text()).toContain(mockBrandInfo.subtitle);
      expect(wrapper.find('.hero-intro').text()).toContain(mockBrandInfo.intro);
    });

    it('displays profile image correctly', () => {
      const wrapper = mount(BrandHero, {
        props: {
          title: mockBrandInfo.name,
          subtitle: mockBrandInfo.subtitle,
          intro: mockBrandInfo.intro,
          profileImage: mockBrandInfo.profileImage,
          certifications: mockCertifications
        },
        global: {
          plugins: [i18n, pinia]
        }
      });

      const profileImg = wrapper.find('.image-container img.hero-image');
      expect(profileImg.exists()).toBe(true);
      expect(profileImg.attributes('src')).toBe(mockBrandInfo.profileImage);
      expect(profileImg.attributes('alt')).toContain(mockBrandInfo.name);
    });

    it('shows certification badges when provided', () => {
      const wrapper = mount(BrandHero, {
        props: {
          title: mockBrandInfo.name,
          subtitle: mockBrandInfo.subtitle,
          intro: mockBrandInfo.intro,
          profileImage: mockBrandInfo.profileImage,
          certifications: mockCertifications
        },
        global: {
          plugins: [i18n, pinia]
        }
      });

      const certBadges = wrapper.findAll('.cert-badge');
      expect(certBadges.length).toBe(mockCertifications.length);
      expect(certBadges[0].text()).toContain('PMP');
      expect(certBadges[1].text()).toContain('ACP');
    });

    it('handles missing optional props gracefully', () => {
      const wrapper = mount(BrandHero, {
        props: {
          title: mockBrandInfo.name,
          subtitle: mockBrandInfo.subtitle,
          intro: mockBrandInfo.intro
        },
        global: {
          plugins: [i18n, pinia]
        }
      });

      expect(wrapper.find('.brand-hero').exists()).toBe(true);
      expect(wrapper.find('img.hero-image').exists()).toBe(false);
      expect(wrapper.findAll('.cert-badge').length).toBe(0);
    });
  });

  describe('BrandStory', () => {
    it('renders brand story with provided data', () => {
      const wrapper = mount(BrandStory, {
        props: mockStoryData,
        global: {
          plugins: [i18n, pinia]
        }
      });

      expect(wrapper.find('.brand-story').exists()).toBe(true);
      expect(wrapper.find('.story-title').exists()).toBe(true);
      expect(wrapper.find('.story-content').exists()).toBe(true);
    });

    it('displays story sections correctly', () => {
      const wrapper = mount(BrandStory, {
        props: mockStoryData,
        global: {
          plugins: [i18n, pinia]
        }
      });

      const storySections = wrapper.findAll('.story-section');
      expect(storySections.length).toBe(mockStoryData.story.length);
      expect(storySections[0].text()).toContain('Early Career');
      expect(storySections[0].text()).toContain('Started as a frontend developer');
    });

    it('displays timeline events correctly', () => {
      const wrapper = mount(BrandStory, {
        props: mockStoryData,
        global: {
          plugins: [i18n, pinia]
        }
      });

      const timelineEvents = wrapper.findAll('.timeline-event');
      expect(timelineEvents.length).toBe(mockStoryData.timeline.length);
      expect(timelineEvents[0].text()).toContain('Started Frontend Development');
    });

    it('displays philosophy statements', () => {
      const wrapper = mount(BrandStory, {
        props: mockStoryData,
        global: {
          plugins: [i18n, pinia]
        }
      });

      const philosophyItems = wrapper.findAll('.philosophy-item');
      expect(philosophyItems.length).toBe(mockStoryData.philosophy.length);
      expect(philosophyItems[0].text()).toContain('Code quality is paramount');
    });
  });

  describe('BrandLogo', () => {
    it('renders logo with default variant', () => {
      const wrapper = mount(BrandLogo, {
        global: {
          plugins: [i18n, pinia]
        }
      });

      expect(wrapper.find('.brand-logo').exists()).toBe(true);
      expect(wrapper.find('.logo-text').exists()).toBe(true);
    });

    it('renders different logo variants correctly', () => {
      const variants = ['icon', 'text', 'full'] as const;
      
      variants.forEach(variant => {
        const wrapper = mount(BrandLogo, {
          props: { variant },
          global: {
            plugins: [i18n, pinia]
          }
        });

        expect(wrapper.find('.brand-logo').exists()).toBe(true);
        expect(wrapper.classes()).toContain(`logo--${variant}`);
      });
    });

    it('renders different logo sizes correctly', () => {
      const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
      
      sizes.forEach(size => {
        const wrapper = mount(BrandLogo, {
          props: { size },
          global: {
            plugins: [i18n, pinia]
          }
        });

        expect(wrapper.find('.brand-logo').exists()).toBe(true);
        expect(wrapper.classes()).toContain(`logo--${size}`);
      });
    });

    it('handles click events when clickable', async () => {
      const wrapper = mount(BrandLogo, {
        props: { clickable: true },
        global: {
          plugins: [i18n, pinia]
        }
      });

      expect(wrapper.classes()).toContain('logo--clickable');
      
      await wrapper.trigger('click');
      expect(wrapper.emitted('click')).toBeTruthy();
    });
  });

  describe('CertificationDisplay', () => {
    it('renders certifications with provided data', () => {
      const wrapper = mount(CertificationDisplay, {
        props: {
          certifications: mockCertifications
        },
        global: {
          plugins: [i18n, pinia]
        }
      });

      expect(wrapper.find('.certification-display').exists()).toBe(true);
      expect(wrapper.find('.certifications-title').exists()).toBe(true);
    });

    it('displays certification cards correctly', () => {
      const wrapper = mount(CertificationDisplay, {
        props: {
          certifications: mockCertifications
        },
        global: {
          plugins: [i18n, pinia]
        }
      });

      const certCards = wrapper.findAll('.cert-card');
      expect(certCards.length).toBe(mockCertifications.length);
      
      // Check first certification
      expect(certCards[0].text()).toContain('PMP');
      expect(certCards[0].text()).toContain('PMI');
      expect(certCards[0].text()).toContain('PMP123456');
      
      // Check second certification
      expect(certCards[1].text()).toContain('ACP');
      expect(certCards[1].text()).toContain('PMI');
      expect(certCards[1].text()).toContain('ACP123456');
    });

    it('displays certification images correctly', () => {
      const wrapper = mount(CertificationDisplay, {
        props: {
          certifications: mockCertifications
        },
        global: {
          plugins: [i18n, pinia]
        }
      });

      const certImages = wrapper.findAll('.cert-image img');
      expect(certImages.length).toBe(mockCertifications.length);
      expect(certImages[0].attributes('src')).toBe('/images/pmp.jpg');
      expect(certImages[1].attributes('src')).toBe('/images/acp.jpg');
    });

    it('provides verification links', () => {
      const wrapper = mount(CertificationDisplay, {
        props: {
          certifications: mockCertifications
        },
        global: {
          plugins: [i18n, pinia]
        }
      });

      const verifyLinks = wrapper.findAll('.verify-link');
      expect(verifyLinks.length).toBe(mockCertifications.length);
      expect(verifyLinks[0].attributes('href')).toBe('https://pmi.org/verify');
      expect(verifyLinks[1].attributes('href')).toBe('https://pmi.org/verify');
    });

    it('handles empty certifications array', () => {
      const wrapper = mount(CertificationDisplay, {
        props: {
          certifications: []
        },
        global: {
          plugins: [i18n, pinia]
        }
      });

      expect(wrapper.find('.certification-display').exists()).toBe(true);
      expect(wrapper.findAll('.cert-card').length).toBe(0);
      expect(wrapper.find('.no-certifications').exists()).toBe(true);
    });

    it('displays issue and expiry dates correctly', () => {
      const certWithExpiry = {
        ...mockCertifications[0],
        expiryDate: new Date('2026-01-01')
      };

      const wrapper = mount(CertificationDisplay, {
        props: {
          certifications: [certWithExpiry]
        },
        global: {
          plugins: [i18n, pinia]
        }
      });

      const certCard = wrapper.find('.cert-card');
      expect(certCard.text()).toContain('2023'); // Issue year
      expect(certCard.text()).toContain('2026'); // Expiry year
    });
  });
});
