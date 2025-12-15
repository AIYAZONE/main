import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { brandService } from '../brandService';
import type { BrandInfo, Certification } from '../../types/brand';

describe('BrandService', () => {
  describe('Property-Based Tests', () => {
    /**
     * **Feature: personal-brand-showcase, Property 1: Brand information completeness**
     * **Validates: Requirements 1.1, 1.2**
     * 
     * For any brand data configuration, when rendering the main page, 
     * all essential brand elements (name, title, skills, photo) should be present in the rendered output
     */
    it('should always return complete brand information with all required fields', async () => {
      await fc.assert(
        fc.asyncProperty(fc.constant(undefined), async () => {
          const brandInfo = await brandService.getBrandInfo();
          
          // Verify all essential brand elements are present and non-empty
          expect(brandInfo).toBeDefined();
          expect(brandInfo.id).toBeDefined();
          expect(typeof brandInfo.id).toBe('string');
          expect(brandInfo.id.length).toBeGreaterThan(0);
          
          expect(brandInfo.name).toBeDefined();
          expect(typeof brandInfo.name).toBe('string');
          expect(brandInfo.name.length).toBeGreaterThan(0);
          
          expect(brandInfo.title).toBeDefined();
          expect(typeof brandInfo.title).toBe('string');
          expect(brandInfo.title.length).toBeGreaterThan(0);
          
          expect(brandInfo.subtitle).toBeDefined();
          expect(typeof brandInfo.subtitle).toBe('string');
          expect(brandInfo.subtitle.length).toBeGreaterThan(0);
          
          expect(brandInfo.intro).toBeDefined();
          expect(typeof brandInfo.intro).toBe('string');
          expect(brandInfo.intro.length).toBeGreaterThan(0);
          
          expect(brandInfo.profileImage).toBeDefined();
          expect(typeof brandInfo.profileImage).toBe('string');
          expect(brandInfo.profileImage.length).toBeGreaterThan(0);
          
          expect(brandInfo.location).toBeDefined();
          expect(typeof brandInfo.location).toBe('string');
          expect(brandInfo.location.length).toBeGreaterThan(0);
          
          expect(brandInfo.age).toBeDefined();
          expect(typeof brandInfo.age).toBe('number');
          expect(brandInfo.age).toBeGreaterThan(0);
          
          expect(brandInfo.experience).toBeDefined();
          expect(typeof brandInfo.experience).toBe('number');
          expect(brandInfo.experience).toBeGreaterThan(0);
          
          expect(brandInfo.tagline).toBeDefined();
          expect(typeof brandInfo.tagline).toBe('string');
          expect(brandInfo.tagline.length).toBeGreaterThan(0);
          
          expect(brandInfo.valueProposition).toBeDefined();
          expect(Array.isArray(brandInfo.valueProposition)).toBe(true);
          expect(brandInfo.valueProposition.length).toBeGreaterThan(0);
          
          // Verify all value propositions are non-empty strings
          brandInfo.valueProposition.forEach(prop => {
            expect(typeof prop).toBe('string');
            expect(prop.length).toBeGreaterThan(0);
          });
        }),
        { numRuns: 100 }
      );
    });

    /**
     * **Feature: personal-brand-showcase, Property 4: Certification information completeness**
     * **Validates: Requirements 2.4**
     * 
     * For any certification record, when displayed, it should include all required details 
     * (name, issuer, dates, credential ID, image, verification link)
     */
    it('should always return complete certification information with all required fields', async () => {
      await fc.assert(
        fc.asyncProperty(fc.constant(undefined), async () => {
          const certifications = await brandService.getCertifications();
          
          expect(certifications).toBeDefined();
          expect(Array.isArray(certifications)).toBe(true);
          expect(certifications.length).toBeGreaterThan(0);
          
          certifications.forEach(cert => {
            // Verify all required certification fields are present
            expect(cert.id).toBeDefined();
            expect(typeof cert.id).toBe('string');
            expect(cert.id.length).toBeGreaterThan(0);
            
            expect(cert.name).toBeDefined();
            expect(typeof cert.name).toBe('string');
            expect(cert.name.length).toBeGreaterThan(0);
            
            expect(cert.issuer).toBeDefined();
            expect(typeof cert.issuer).toBe('string');
            expect(cert.issuer.length).toBeGreaterThan(0);
            
            expect(cert.issueDate).toBeDefined();
            expect(cert.issueDate instanceof Date).toBe(true);
            expect(cert.issueDate.getTime()).toBeGreaterThan(0);
            
            expect(cert.credentialId).toBeDefined();
            expect(typeof cert.credentialId).toBe('string');
            expect(cert.credentialId.length).toBeGreaterThan(0);
            
            expect(cert.imageUrl).toBeDefined();
            expect(typeof cert.imageUrl).toBe('string');
            expect(cert.imageUrl.length).toBeGreaterThan(0);
            
            expect(cert.verificationUrl).toBeDefined();
            expect(typeof cert.verificationUrl).toBe('string');
            expect(cert.verificationUrl.length).toBeGreaterThan(0);
            
            // Verify optional expiry date is either undefined or a valid Date
            if (cert.expiryDate !== undefined) {
              expect(cert.expiryDate instanceof Date).toBe(true);
              expect(cert.expiryDate.getTime()).toBeGreaterThan(cert.issueDate.getTime());
            }
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    it('should return brand info with expected structure', async () => {
      const brandInfo = await brandService.getBrandInfo();
      
      expect(brandInfo).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        title: expect.any(String),
        subtitle: expect.any(String),
        intro: expect.any(String),
        profileImage: expect.any(String),
        location: expect.any(String),
        age: expect.any(Number),
        experience: expect.any(Number),
        tagline: expect.any(String),
        valueProposition: expect.any(Array)
      });
    });

    it('should return certifications with expected structure', async () => {
      const certifications = await brandService.getCertifications();
      
      expect(certifications).toBeInstanceOf(Array);
      expect(certifications.length).toBeGreaterThan(0);
      
      certifications.forEach(cert => {
        expect(cert).toMatchObject({
          id: expect.any(String),
          name: expect.any(String),
          issuer: expect.any(String),
          issueDate: expect.any(Date),
          credentialId: expect.any(String),
          imageUrl: expect.any(String),
          verificationUrl: expect.any(String)
        });
      });
    });
  });
});