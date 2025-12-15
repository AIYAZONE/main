import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import * as fc from 'fast-check';
import ContactForm from '../ContactForm.vue';

describe('Form Validation Consistency', () => {
  describe('Property-Based Tests', () => {
    /**
     * **Feature: personal-brand-showcase, Property 10: Form validation consistency**
     * **Validates: Requirements 5.3**
     * 
     * For any contact form submission, required field validation should work correctly 
     * and appropriate feedback should be provided
     */
    it('should consistently validate required fields and provide appropriate feedback', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate focused test cases for validation consistency
          fc.record({
            fieldName: fc.constantFrom('name', 'email', 'subject', 'message', 'agreeToPrivacy'),
            useValidValue: fc.boolean()
          }),
          async ({ fieldName, useValidValue }) => {
            const wrapper = mount(ContactForm);
            await wrapper.vm.$nextTick();

            const formData = wrapper.vm.formData;
            const errors = wrapper.vm.errors;

            // Define valid and invalid values for each field
            const validValues = {
              name: 'John Doe',
              email: 'test@example.com',
              subject: 'Valid Subject',
              message: 'This is a valid message with enough content to pass validation.',
              agreeToPrivacy: true
            };

            const invalidValues = {
              name: '', // Empty
              email: 'invalid-email', // Invalid format
              subject: 'Hi', // Too short
              message: 'Short', // Too short
              agreeToPrivacy: false // Not agreed
            };

            // Set all fields to valid values first
            formData.name = validValues.name;
            formData.email = validValues.email;
            formData.subject = validValues.subject;
            formData.message = validValues.message;
            formData.agreeToPrivacy = validValues.agreeToPrivacy;

            // Then set the test field to valid or invalid value
            if (useValidValue) {
              formData[fieldName] = validValues[fieldName];
            } else {
              formData[fieldName] = invalidValues[fieldName];
            }

            await wrapper.vm.$nextTick();

            // Test individual field validation
            wrapper.vm.validateField(fieldName);
            await wrapper.vm.$nextTick();

            // Check validation consistency for the specific field
            if (useValidValue) {
              // Valid values should not produce errors
              expect(errors[fieldName]).toBeUndefined();
            } else {
              // Invalid values should produce appropriate errors
              expect(errors[fieldName]).toBeDefined();
              expect(typeof errors[fieldName]).toBe('string');
              expect(errors[fieldName].length).toBeGreaterThan(0);
            }

            // Test error clearing consistency
            if (errors[fieldName]) {
              wrapper.vm.clearFieldError(fieldName);
              await wrapper.vm.$nextTick();
              expect(errors[fieldName]).toBeUndefined();
            }

            wrapper.unmount();
          }
        ),
        { numRuns: 20 }
      );
    });

    /**
     * Property test for form field error state consistency
     */
    it('should consistently apply error states and styling to form fields', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            fieldName: fc.constantFrom('name', 'email', 'subject', 'message'),
            hasError: fc.boolean()
          }),
          async ({ fieldName, hasError }) => {
            const wrapper = mount(ContactForm);
            await wrapper.vm.$nextTick();

            const errors = wrapper.vm.errors;

            // Set error state if needed
            if (hasError) {
              errors[fieldName] = 'Test error message';
            } else {
              delete errors[fieldName];
            }

            await wrapper.vm.$nextTick();

            // Find the form field element
            const fieldElement = wrapper.find(`#${fieldName}`);
            const errorElement = wrapper.find(`#${fieldName}-error`);

            // Test error state consistency
            if (hasError) {
              // Field should have error class
              if (fieldName === 'message') {
                expect(fieldElement.classes()).toContain('form-textarea--error');
              } else {
                expect(fieldElement.classes()).toContain('form-input--error');
              }

              // Error message should be displayed
              expect(errorElement.exists()).toBe(true);
              expect(errorElement.text()).toBe('Test error message');
              expect(errorElement.attributes('role')).toBe('alert');

              // Field should have proper aria attributes
              expect(fieldElement.attributes('aria-invalid')).toBe('true');
              expect(fieldElement.attributes('aria-describedby')).toContain(`${fieldName}-error`);
            } else {
              // Field should not have error class
              if (fieldName === 'message') {
                expect(fieldElement.classes()).not.toContain('form-textarea--error');
              } else {
                expect(fieldElement.classes()).not.toContain('form-input--error');
              }

              // Error message should not be displayed
              expect(errorElement.exists()).toBe(false);

              // Field should have proper aria attributes
              expect(fieldElement.attributes('aria-invalid')).toBe('false');
            }

            // Test field structure consistency
            expect(fieldElement.exists()).toBe(true);
            
            // All form fields should have proper labels
            const labelElement = wrapper.find(`label[for="${fieldName}"]`);
            expect(labelElement.exists()).toBe(true);

            wrapper.unmount();
          }
        ),
        { numRuns: 20 }
      );
    });

    /**
     * Property test for form submission state consistency
     */
    it('should consistently handle form submission states and provide appropriate feedback', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            isSubmitting: fc.boolean(),
            submitStatusType: fc.oneof(
              fc.constant(null),
              fc.constantFrom('success', 'error', 'info')
            )
          }),
          async ({ isSubmitting, submitStatusType }) => {
            const wrapper = mount(ContactForm);
            await wrapper.vm.$nextTick();

            // Set form submission state
            wrapper.vm.isSubmitting = isSubmitting;
            
            if (submitStatusType) {
              wrapper.vm.submitStatus = {
                type: submitStatusType,
                title: 'Test Title',
                message: 'Test Message'
              };
            } else {
              wrapper.vm.submitStatus = null;
            }

            await wrapper.vm.$nextTick();

            // Test submit button state consistency
            const submitButton = wrapper.find('.submit-button');
            expect(submitButton.exists()).toBe(true);

            // Button should show loading state when submitting
            if (isSubmitting) {
              expect(submitButton.text()).toContain('Sending...');
            } else {
              expect(submitButton.text()).toContain('Send Message');
            }

            // Test reset button state consistency
            const resetButton = wrapper.find('.reset-button');
            expect(resetButton.exists()).toBe(true);
            if (isSubmitting) {
              expect(resetButton.attributes('disabled')).toBeDefined();
            } else {
              expect(resetButton.attributes('disabled')).toBeUndefined();
            }

            // Test status message consistency
            if (submitStatusType) {
              const statusElement = wrapper.find('.form-status');
              expect(statusElement.exists()).toBe(true);
              expect(statusElement.classes()).toContain(`form-status--${submitStatusType}`);
              expect(statusElement.attributes('role')).toBe('alert');

              const statusTitleElement = wrapper.find('.status-title');
              expect(statusTitleElement.exists()).toBe(true);
              expect(statusTitleElement.text()).toBe('Test Title');

              const statusMessageElement = wrapper.find('.status-message');
              expect(statusMessageElement.exists()).toBe(true);
              expect(statusMessageElement.text()).toBe('Test Message');

              // Status icon should match type
              const statusIcon = wrapper.find('.status-icon');
              expect(statusIcon.exists()).toBe(true);
              
              switch (submitStatusType) {
                case 'success':
                  expect(statusIcon.text()).toContain('✅');
                  break;
                case 'error':
                  expect(statusIcon.text()).toContain('❌');
                  break;
                case 'info':
                  expect(statusIcon.text()).toContain('ℹ️');
                  break;
              }
            } else {
              const statusElement = wrapper.find('.form-status');
              expect(statusElement.exists()).toBe(false);
            }

            wrapper.unmount();
          }
        ),
        { numRuns: 20 }
      );
    });
  });

  describe('Unit Tests', () => {
    it('should validate required name field correctly', async () => {
      const wrapper = mount(ContactForm);
      await wrapper.vm.$nextTick();

      // Test empty name
      wrapper.vm.formData.name = '';
      wrapper.vm.validateField('name');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.errors.name).toBe('This field is required');

      // Test name too short
      wrapper.vm.formData.name = 'A';
      wrapper.vm.validateField('name');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.errors.name).toBe('Minimum length is 2 characters');

      // Test valid name
      wrapper.vm.formData.name = 'John Doe';
      wrapper.vm.validateField('name');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.errors.name).toBeUndefined();
    });

    it('should validate email field correctly', async () => {
      const wrapper = mount(ContactForm);
      await wrapper.vm.$nextTick();

      // Test empty email
      wrapper.vm.formData.email = '';
      wrapper.vm.validateField('email');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.errors.email).toBe('This field is required');

      // Test invalid email
      wrapper.vm.formData.email = 'invalid-email';
      wrapper.vm.validateField('email');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.errors.email).toBe('Please enter a valid email address');

      // Test valid email
      wrapper.vm.formData.email = 'test@example.com';
      wrapper.vm.validateField('email');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.errors.email).toBeUndefined();
    });

    it('should validate subject field correctly', async () => {
      const wrapper = mount(ContactForm);
      await wrapper.vm.$nextTick();

      // Test empty subject
      wrapper.vm.formData.subject = '';
      wrapper.vm.validateField('subject');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.errors.subject).toBe('This field is required');

      // Test subject too short
      wrapper.vm.formData.subject = 'Hi';
      wrapper.vm.validateField('subject');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.errors.subject).toBe('Minimum length is 5 characters');

      // Test valid subject
      wrapper.vm.formData.subject = 'Hello World';
      wrapper.vm.validateField('subject');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.errors.subject).toBeUndefined();
    });

    it('should validate message field correctly', async () => {
      const wrapper = mount(ContactForm);
      await wrapper.vm.$nextTick();

      // Test empty message
      wrapper.vm.formData.message = '';
      wrapper.vm.validateField('message');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.errors.message).toBe('This field is required');

      // Test message too short
      wrapper.vm.formData.message = 'Short';
      wrapper.vm.validateField('message');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.errors.message).toBe('Minimum length is 10 characters');

      // Test message too long
      wrapper.vm.formData.message = 'a'.repeat(2001);
      wrapper.vm.validateField('message');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.errors.message).toBe('Maximum length is 2000 characters');

      // Test valid message
      wrapper.vm.formData.message = 'This is a valid message with enough content.';
      wrapper.vm.validateField('message');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.errors.message).toBeUndefined();
    });

    it('should validate privacy agreement correctly', async () => {
      const wrapper = mount(ContactForm);
      await wrapper.vm.$nextTick();

      // Test unchecked privacy
      wrapper.vm.formData.agreeToPrivacy = false;
      wrapper.vm.validateField('agreeToPrivacy');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.errors.agreeToPrivacy).toBe('Please agree to the privacy policy');

      // Test checked privacy
      wrapper.vm.formData.agreeToPrivacy = true;
      wrapper.vm.validateField('agreeToPrivacy');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.errors.agreeToPrivacy).toBeUndefined();
    });

    it('should clear field errors correctly', async () => {
      const wrapper = mount(ContactForm);
      await wrapper.vm.$nextTick();

      // Set an error
      wrapper.vm.errors.name = 'Test error';
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.errors.name).toBe('Test error');

      // Clear the error
      wrapper.vm.clearFieldError('name');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.errors.name).toBeUndefined();
    });

    it('should validate complete form correctly', async () => {
      const wrapper = mount(ContactForm);
      await wrapper.vm.$nextTick();

      // Test invalid form
      wrapper.vm.formData.name = '';
      wrapper.vm.formData.email = 'invalid';
      wrapper.vm.formData.subject = '';
      wrapper.vm.formData.message = '';
      wrapper.vm.formData.agreeToPrivacy = false;

      const isValid = wrapper.vm.validateForm();
      expect(isValid).toBe(false);
      expect(Object.keys(wrapper.vm.errors).length).toBeGreaterThan(0);

      // Test valid form
      wrapper.vm.formData.name = 'John Doe';
      wrapper.vm.formData.email = 'john@example.com';
      wrapper.vm.formData.subject = 'Test Subject';
      wrapper.vm.formData.message = 'This is a valid test message with enough content.';
      wrapper.vm.formData.agreeToPrivacy = true;

      // Clear errors first
      Object.keys(wrapper.vm.errors).forEach(key => {
        delete wrapper.vm.errors[key];
      });

      const isValidNow = wrapper.vm.validateForm();
      expect(isValidNow).toBe(true);
      expect(Object.keys(wrapper.vm.errors).length).toBe(0);
    });

    it('should have consistent form structure and accessibility', async () => {
      const wrapper = mount(ContactForm);
      await wrapper.vm.$nextTick();

      // Check form structure
      const form = wrapper.find('form');
      expect(form.exists()).toBe(true);
      expect(form.attributes('novalidate')).toBe('');

      // Check required fields have proper labels and attributes
      const requiredFields = ['name', 'email', 'subject', 'message'];
      
      requiredFields.forEach(fieldName => {
        const field = wrapper.find(`#${fieldName}`);
        const label = wrapper.find(`label[for="${fieldName}"]`);
        
        expect(field.exists()).toBe(true);
        expect(label.exists()).toBe(true);
        expect(field.attributes('required')).toBe('');
        expect(field.attributes('aria-invalid')).toBe('false');
      });

      // Check privacy checkbox
      const privacyCheckbox = wrapper.find('input[type="checkbox"]');
      expect(privacyCheckbox.exists()).toBe(true);
      expect(privacyCheckbox.attributes('required')).toBe('');

      // Check submit button
      const submitButton = wrapper.find('.submit-button');
      expect(submitButton.exists()).toBe(true);
      expect(submitButton.attributes('type')).toBe('submit');

      // Check reset button
      const resetButton = wrapper.find('.reset-button');
      expect(resetButton.exists()).toBe(true);
      expect(resetButton.attributes('type')).toBe('button');
    });
  });
});