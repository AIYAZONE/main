import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';
import fc from 'fast-check';
import BrandHero from '../BrandHero.vue';
import type { BrandInfo, Certification } from '../../../types/brand';

/**
 * **Feature: personal-brand-showcase, Property 1: Brand information completeness**
 * 
 * Property: For any brand data configuration, when rendering the main page, 
 * all essential brand elements (name, title, skills, photo) should be present in the rendered output
 * 
 * **Validates: Requirements 1.1, 1.2**
 */

describe('Brand Information Completeness Property Tests', () => {
  const createTestWrapper = (brandInfo: BrandInfo, certifications: Certification[] = []) => {
    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: {
        en: {
          'brand.title': 'Brand Title',
          'brand.subtitle': 'Brand Subtitle',
          'brand.intro': 'Brand Introduction',
          'brand.certifications.title': 'Certifications'
        }
      }
    });

    const pinia = createPinia();

    return mount(BrandHero, {
      props: {
        title: brandInfo.name,
        subtitle: brandInfo.subtitle,
        intro: brandInfo.intro,
        profileImage: brandInfo.profileImage,
        certifications
      },
      global: {
        plugins: [i18n, pinia]
      }
    });
  };

  // Generator for valid brand information (avoiding HTML characters that could be interpreted)
  const brandInfoArbitrary = fc.record({
    id: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0 && !s.includes('<') && !s.includes('>')),
    name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0 && !s.includes('<') && !s.includes('>')),
    title: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0 && !s.includes('<') && !s.includes('>')),
    subtitle: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0 && !s.includes('<') && !s.includes('>')),
    intro: fc.string({ minLength: 10, maxLength: 500 }).filter(s => s.trim().length >= 10 && !s.includes('<') && !s.includes('>')),
    profileImage: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0).map(s => `/images/${s.replace(/\s+/g, '_').replace(/[<>]/g, '')}.jpg`),
    location: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0 && !s.includes('<') && !s.includes('>')),
    age: fc.integer({ min: 20, max: 70 }),
    experience: fc.integer({ min: 0, max: 50 }),
    tagline: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0 && !s.includes('<') && !s.includes('>')),
    valueProposition: fc.array(fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0 && !s.includes('<') && !s.includes('>')), { minLength: 1, maxLength: 10 })
  });

  // Generator for certifications
  const certificationArbitrary = fc.record({
    id: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0 && !s.includes('<') && !s.includes('>')),
    name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0 && !s.includes('<') && !s.includes('>')),
    issuer: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0 && !s.includes('<') && !s.includes('>')),
    issueDate: fc.date({ min: new Date('2000-01-01'), max: new Date() }),
    expiryDate: fc.option(fc.date({ min: new Date(), max: new Date('2030-12-31') })),
    credentialId: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0 && !s.includes('<') && !s.includes('>')),
    imageUrl: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0).map(s => `/images/${s.replace(/\s+/g, '_').replace(/[<>]/g, '')}.jpg`),
    verificationUrl: fc.webUrl()
  });

  it('should always display essential brand elements for any valid brand configuration', () => {
    fc.assert(
      fc.property(
        brandInfoArbitrary,
        fc.array(certificationArbitrary, { maxLength: 5 }),
        (brandInfo, certifications) => {
          const wrapper = createTestWrapper(brandInfo, certifications);
          
          // Essential brand elements should always be present
          const heroContainer = wrapper.find('.brand-hero');
          expect(heroContainer.exists()).toBe(true);
          
          // Name/title should be displayed
          const titleElement = wrapper.find('.hero-title');
          expect(titleElement.exists()).toBe(true);
          expect(titleElement.text().trim()).toBe(brandInfo.name.trim());
          
          // Subtitle should be displayed
          const subtitleElement = wrapper.find('.hero-subtitle');
          expect(subtitleElement.exists()).toBe(true);
          expect(subtitleElement.text().trim()).toBe(brandInfo.subtitle.trim());
          
          // Introduction should be displayed (accounting for HTML rendering and whitespace normalization)
          const introElement = wrapper.find('.hero-intro');
          expect(introElement.exists()).toBe(true);
          const displayedIntro = introElement.text().trim();
          const expectedIntro = brandInfo.intro.trim();
          // Allow for whitespace normalization by the browser
          expect(displayedIntro.replace(/\s+/g, ' ')).toBe(expectedIntro.replace(/\s+/g, ' '));
          
          // Profile image should be displayed when provided
          if (brandInfo.profileImage) {
            const profileImage = wrapper.find('.image-container img.hero-image');
            expect(profileImage.exists()).toBe(true);
            expect(profileImage.attributes('src')).toBe(brandInfo.profileImage);
            expect(profileImage.attributes('alt')).toContain(brandInfo.name);
          }
          
          // Certifications should be displayed when provided
          if (certifications.length > 0) {
            const certBadges = wrapper.findAll('.cert-badge');
            expect(certBadges.length).toBe(certifications.length);
            
            certifications.forEach((cert, index) => {
              const badgeText = certBadges[index].text().trim();
              // Badge shows abbreviation, not full name
              expect(badgeText.length).toBeGreaterThan(0);
            });
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle edge cases in brand information display', () => {
    fc.assert(
      fc.property(
        brandInfoArbitrary,
        (brandInfo) => {
          // Test with minimal brand info (no certifications, no profile image)
          const minimalBrandInfo = {
            ...brandInfo,
            profileImage: ''
          };
          
          const wrapper = createTestWrapper(minimalBrandInfo, []);
          
          // Essential elements should still be present
          expect(wrapper.find('.brand-hero').exists()).toBe(true);
          expect(wrapper.find('.hero-title').text().trim()).toBe(brandInfo.name.trim());
          expect(wrapper.find('.hero-subtitle').text().trim()).toBe(brandInfo.subtitle.trim());
          // Allow for whitespace normalization in intro
          const displayedIntro = wrapper.find('.hero-intro').text().trim();
          const expectedIntro = brandInfo.intro.trim();
          expect(displayedIntro.replace(/\s+/g, ' ')).toBe(expectedIntro.replace(/\s+/g, ' '));
          
          // Optional elements should not cause errors when missing
          expect(wrapper.find('img.hero-image').exists()).toBe(false);
          expect(wrapper.findAll('.cert-badge').length).toBe(0);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain content integrity across different brand configurations', () => {
    fc.assert(
      fc.property(
        brandInfoArbitrary,
        fc.array(certificationArbitrary, { minLength: 1, maxLength: 3 }),
        (brandInfo, certifications) => {
          const wrapper = createTestWrapper(brandInfo, certifications);
          
          // Verify that displayed content matches input data exactly
          const displayedTitle = wrapper.find('.hero-title').text();
          const displayedSubtitle = wrapper.find('.hero-subtitle').text();
          const displayedIntro = wrapper.find('.hero-intro').text();
          
          // Content should not be truncated or modified unexpectedly
          expect(displayedTitle.trim()).toBe(brandInfo.name.trim());
          expect(displayedSubtitle.trim()).toBe(brandInfo.subtitle.trim());
          // Allow for whitespace normalization in intro
          expect(displayedIntro.trim().replace(/\s+/g, ' ')).toBe(brandInfo.intro.trim().replace(/\s+/g, ' '));
          
          // Certification count should match input
          const certBadges = wrapper.findAll('.cert-badge');
          expect(certBadges.length).toBe(certifications.length);
          
          // Each certification should be represented
          certifications.forEach((cert, index) => {
            const badgeText = certBadges[index].text().trim();
            // Badge shows abbreviation, not full name
            expect(badgeText.length).toBeGreaterThan(0);
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle special characters in brand information', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0 && !s.includes('<') && !s.includes('>')),
          name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0 && !s.includes('<') && !s.includes('>')),
          title: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0 && !s.includes('<') && !s.includes('>')),
          subtitle: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0 && !s.includes('<') && !s.includes('>')),
          intro: fc.string({ minLength: 10, maxLength: 500 }).filter(s => s.trim().length >= 10 && !s.includes('<') && !s.includes('>')),
          profileImage: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0).map(s => `/images/${s.replace(/\s+/g, '_').replace(/[<>]/g, '')}.jpg`),
          location: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0 && !s.includes('<') && !s.includes('>')),
          age: fc.integer({ min: 20, max: 70 }),
          experience: fc.integer({ min: 0, max: 50 }),
          tagline: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0 && !s.includes('<') && !s.includes('>')),
          valueProposition: fc.array(fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0 && !s.includes('<') && !s.includes('>')), { minLength: 1, maxLength: 5 })
        }),
        (brandInfo) => {
          const wrapper = createTestWrapper(brandInfo);
          
          // Component should render without errors even with special characters
          expect(wrapper.find('.brand-hero').exists()).toBe(true);
          expect(wrapper.find('.hero-title').exists()).toBe(true);
          expect(wrapper.find('.hero-subtitle').exists()).toBe(true);
          expect(wrapper.find('.hero-intro').exists()).toBe(true);
          
          // Content should be properly escaped and displayed
          const titleText = wrapper.find('.hero-title').text().trim();
          const subtitleText = wrapper.find('.hero-subtitle').text().trim();
          const introText = wrapper.find('.hero-intro').text().trim();
          
          // Should contain the original content (properly rendered)
          expect(titleText).toBe(brandInfo.name.trim());
          expect(subtitleText).toBe(brandInfo.subtitle.trim());
          // Allow for whitespace normalization in intro
          expect(introText.replace(/\s+/g, ' ')).toBe(brandInfo.intro.trim().replace(/\s+/g, ' '));
          
          return true;
        }
      ),
      { numRuns: 50 } // Reduced runs for special character testing
    );
  });
});
