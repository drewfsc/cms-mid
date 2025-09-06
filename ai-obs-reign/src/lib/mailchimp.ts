/* eslint-disable @typescript-eslint/no-unused-vars */
// MailChimp Integration for R.E.I.G.N
// Handles newsletter signups, contact forms, and lead capture

const MAILCHIMP_API_KEY = '714f75f85955fbbfcaed5db8c79d6907-us21';
const MAILCHIMP_SERVER = 'us21'; // Extracted from API key
const MAILCHIMP_BASE_URL = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0`;

// MailChimp List IDs (you'll need to create these in your MailChimp account)
export const MAILCHIMP_LISTS = {
  NEWSLETTER: 'newsletter_list_id', // Replace with actual list ID
  CONTACT_LEADS: 'contact_leads_list_id', // Replace with actual list ID
  DEMO_REQUESTS: 'demo_requests_list_id', // Replace with actual list ID
  GENERAL_INQUIRIES: 'general_inquiries_list_id' // Replace with actual list ID
};

export interface MailChimpContact {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  message?: string;
  source?: string; // Where the lead came from
  tags?: string[]; // MailChimp tags for segmentation
}

export interface MailChimpResponse {
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
}

export class MailChimpManager {
  // Add contact to MailChimp list
  static async addContact(
    listId: string, 
    contact: MailChimpContact,
    options: {
      doubleOptin?: boolean;
      updateExisting?: boolean;
      sendWelcome?: boolean;
    } = {}
  ): Promise<MailChimpResponse> {
    try {
      const { doubleOptin = false, updateExisting = true, sendWelcome = true } = options;
      
      const memberData = {
        email_address: contact.email,
        status: doubleOptin ? 'pending' : 'subscribed',
        merge_fields: {
          FNAME: contact.firstName || '',
          LNAME: contact.lastName || '',
          COMPANY: contact.company || '',
          PHONE: contact.phone || '',
          MESSAGE: contact.message || '',
          SOURCE: contact.source || 'website'
        },
        tags: contact.tags || []
      };

      const response = await fetch(`${MAILCHIMP_BASE_URL}/lists/${listId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MAILCHIMP_API_KEY}`
        },
        body: JSON.stringify(memberData)
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: 'Successfully added to mailing list',
          data
        };
      } else if (response.status === 400 && data.title === 'Member Exists') {
        // Handle existing member
        if (updateExisting) {
          return await this.updateContact(listId, contact);
        } else {
          return {
            success: false,
            message: 'Email already exists in our system',
            error: 'duplicate_email'
          };
        }
      } else {
        return {
          success: false,
          message: data.detail || 'Failed to add contact',
          error: data.title || 'unknown_error'
        };
      }
    } catch (error) {
      console.error('MailChimp API Error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
        error: 'network_error'
      };
    }
  }

  // Update existing contact
  static async updateContact(listId: string, contact: MailChimpContact): Promise<MailChimpResponse> {
    try {
      const emailHash = await this.getEmailHash(contact.email);
      
      const memberData = {
        merge_fields: {
          FNAME: contact.firstName || '',
          LNAME: contact.lastName || '',
          COMPANY: contact.company || '',
          PHONE: contact.phone || '',
          MESSAGE: contact.message || '',
          SOURCE: contact.source || 'website'
        }
      };

      const response = await fetch(`${MAILCHIMP_BASE_URL}/lists/${listId}/members/${emailHash}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MAILCHIMP_API_KEY}`
        },
        body: JSON.stringify(memberData)
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: 'Contact information updated',
          data
        };
      } else {
        return {
          success: false,
          message: data.detail || 'Failed to update contact',
          error: data.title || 'update_error'
        };
      }
    } catch (error) {
      console.error('MailChimp Update Error:', error);
      return {
        success: false,
        message: 'Failed to update contact',
        error: 'network_error'
      };
    }
  }

  // Newsletter signup (simple email only)
  static async subscribeNewsletter(email: string, source: string = 'website'): Promise<MailChimpResponse> {
    return await this.addContact(MAILCHIMP_LISTS.NEWSLETTER, {
      email,
      source,
      tags: ['newsletter', 'website-signup']
    }, {
      doubleOptin: true, // Newsletter should use double opt-in
      sendWelcome: true
    });
  }

  // Contact form submission
  static async submitContactForm(contact: MailChimpContact): Promise<MailChimpResponse> {
    return await this.addContact(MAILCHIMP_LISTS.CONTACT_LEADS, {
      ...contact,
      source: 'contact-form',
      tags: ['contact-lead', 'website-contact']
    }, {
      doubleOptin: false, // Contact forms shouldn't require double opt-in
      sendWelcome: false
    });
  }

  // Demo request submission
  static async submitDemoRequest(contact: MailChimpContact): Promise<MailChimpResponse> {
    return await this.addContact(MAILCHIMP_LISTS.DEMO_REQUESTS, {
      ...contact,
      source: 'demo-request',
      tags: ['demo-request', 'high-intent-lead']
    }, {
      doubleOptin: false,
      sendWelcome: false
    });
  }

  // Get started form submission
  static async submitGetStarted(contact: MailChimpContact): Promise<MailChimpResponse> {
    return await this.addContact(MAILCHIMP_LISTS.GENERAL_INQUIRIES, {
      ...contact,
      source: 'get-started',
      tags: ['get-started', 'trial-interest']
    }, {
      doubleOptin: false,
      sendWelcome: true
    });
  }

  // Utility function to generate email hash for MailChimp
  private static async getEmailHash(email: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(email.toLowerCase());
    const hashBuffer = await crypto.subtle.digest('MD5', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Test MailChimp connection
  static async testConnection(): Promise<MailChimpResponse> {
    try {
      const response = await fetch(`${MAILCHIMP_BASE_URL}/ping`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MAILCHIMP_API_KEY}`
        }
      });

      if (response.ok) {
        return {
          success: true,
          message: 'MailChimp connection successful'
        };
      } else {
        return {
          success: false,
          message: 'MailChimp connection failed',
          error: 'connection_failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error connecting to MailChimp',
        error: 'network_error'
      };
    }
  }

  // Get list information
  static async getListInfo(listId: string): Promise<MailChimpResponse> {
    try {
      const response = await fetch(`${MAILCHIMP_BASE_URL}/lists/${listId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MAILCHIMP_API_KEY}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: 'List information retrieved',
          data
        };
      } else {
        return {
          success: false,
          message: 'Failed to get list information',
          error: data.title || 'list_error'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve list information',
        error: 'network_error'
      };
    }
  }
}

// Form validation utilities
export class FormValidator {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateRequired(value: string): boolean {
    return value.trim().length > 0;
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  static validateContactForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
    message: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.validateRequired(data.firstName)) {
      errors.push('First name is required');
    }

    if (!this.validateRequired(data.lastName)) {
      errors.push('Last name is required');
    }

    if (!this.validateRequired(data.email)) {
      errors.push('Email is required');
    } else if (!this.validateEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!this.validateRequired(data.message)) {
      errors.push('Message is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
