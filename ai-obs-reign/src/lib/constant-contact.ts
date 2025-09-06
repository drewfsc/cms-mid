// Constant Contact Integration for R.E.I.G.N
// Handles newsletter signups, contact forms, and lead capture

const CONSTANT_CONTACT_API_KEY = process.env.CONSTANT_CONTACT_API_KEY || '';
const CONSTANT_CONTACT_ACCESS_TOKEN = process.env.CONSTANT_CONTACT_ACCESS_TOKEN || '';
const CONSTANT_CONTACT_BASE_URL = 'https://api.cc.email/v3';

// Constant Contact List IDs (you'll need to create these in your Constant Contact account)
export const CONSTANT_CONTACT_LISTS = {
  NEWSLETTER: 'newsletter_list_id', // Replace with actual list ID
  CONTACT_LEADS: 'contact_leads_list_id', // Replace with actual list ID
  DEMO_REQUESTS: 'demo_requests_list_id', // Replace with actual list ID
  GENERAL_INQUIRIES: 'general_inquiries_list_id' // Replace with actual list ID
};

export interface ConstantContactContact {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  message?: string;
  source?: string; // Where the lead came from
  tags?: string[]; // Constant Contact tags for segmentation
  customFields?: Record<string, string>; // Custom fields
}

export interface ConstantContactResponse {
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
}

export class ConstantContactManager {
  // Add contact to Constant Contact list
  static async addContact(
    listId: string, 
    contact: ConstantContactContact,
    options: {
      doubleOptin?: boolean;
      updateExisting?: boolean;
      sendWelcome?: boolean;
    } = {}
  ): Promise<ConstantContactResponse> {
    try {
      const { doubleOptin = false, updateExisting = true, sendWelcome = true } = options;
      
      const contactData = {
        email_address: {
          address: contact.email,
          permission_to_send: 'implicit'
        },
        first_name: contact.firstName || '',
        last_name: contact.lastName || '',
        company_name: contact.company || '',
        phone_number: contact.phone || '',
        custom_fields: contact.customFields || [],
        list_memberships: [listId],
        create_source: contact.source || 'Contact_API',
        tags: contact.tags || []
      };

      const response = await fetch(`${CONSTANT_CONTACT_BASE_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONSTANT_CONTACT_ACCESS_TOKEN}`,
          'X-CC-Api-Key': CONSTANT_CONTACT_API_KEY
        },
        body: JSON.stringify(contactData)
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: 'Successfully added to mailing list',
          data
        };
      } else if (response.status === 409) {
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
      console.error('Constant Contact API Error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
        error: 'network_error'
      };
    }
  }

  // Update existing contact
  static async updateContact(listId: string, contact: ConstantContactContact): Promise<ConstantContactResponse> {
    try {
      // First, get the contact by email
      const searchResponse = await fetch(
        `${CONSTANT_CONTACT_BASE_URL}/contacts?email=${encodeURIComponent(contact.email)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${CONSTANT_CONTACT_ACCESS_TOKEN}`,
            'X-CC-Api-Key': CONSTANT_CONTACT_API_KEY
          }
        }
      );

      if (!searchResponse.ok) {
        return {
          success: false,
          message: 'Failed to find contact',
          error: 'contact_not_found'
        };
      }

      const searchData = await searchResponse.json();
      const contactId = searchData.contacts?.[0]?.contact_id;

      if (!contactId) {
        return {
          success: false,
          message: 'Contact not found',
          error: 'contact_not_found'
        };
      }

      const contactData = {
        first_name: contact.firstName || '',
        last_name: contact.lastName || '',
        company_name: contact.company || '',
        phone_number: contact.phone || '',
        custom_fields: contact.customFields || [],
        list_memberships: [listId],
        tags: contact.tags || []
      };

      const response = await fetch(`${CONSTANT_CONTACT_BASE_URL}/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONSTANT_CONTACT_ACCESS_TOKEN}`,
          'X-CC-Api-Key': CONSTANT_CONTACT_API_KEY
        },
        body: JSON.stringify(contactData)
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
      console.error('Constant Contact Update Error:', error);
      return {
        success: false,
        message: 'Failed to update contact',
        error: 'network_error'
      };
    }
  }

  // Newsletter signup (simple email only)
  static async subscribeNewsletter(email: string, source: string = 'website'): Promise<ConstantContactResponse> {
    return await this.addContact(CONSTANT_CONTACT_LISTS.NEWSLETTER, {
      email,
      source,
      tags: ['newsletter', 'website-signup']
    }, {
      doubleOptin: true, // Newsletter should use double opt-in
      sendWelcome: true
    });
  }

  // Contact form submission
  static async submitContactForm(contact: ConstantContactContact): Promise<ConstantContactResponse> {
    return await this.addContact(CONSTANT_CONTACT_LISTS.CONTACT_LEADS, {
      ...contact,
      source: 'contact-form',
      tags: ['contact-lead', 'website-contact']
    }, {
      doubleOptin: false, // Contact forms shouldn't require double opt-in
      sendWelcome: false
    });
  }

  // Demo request submission
  static async submitDemoRequest(contact: ConstantContactContact): Promise<ConstantContactResponse> {
    return await this.addContact(CONSTANT_CONTACT_LISTS.DEMO_REQUESTS, {
      ...contact,
      source: 'demo-request',
      tags: ['demo-request', 'high-intent-lead']
    }, {
      doubleOptin: false,
      sendWelcome: false
    });
  }

  // Get started form submission
  static async submitGetStarted(contact: ConstantContactContact): Promise<ConstantContactResponse> {
    return await this.addContact(CONSTANT_CONTACT_LISTS.GENERAL_INQUIRIES, {
      ...contact,
      source: 'get-started',
      tags: ['get-started', 'trial-interest']
    }, {
      doubleOptin: false,
      sendWelcome: true
    });
  }

  // Test Constant Contact connection
  static async testConnection(): Promise<ConstantContactResponse> {
    try {
      const response = await fetch(`${CONSTANT_CONTACT_BASE_URL}/account/info`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${CONSTANT_CONTACT_ACCESS_TOKEN}`,
          'X-CC-Api-Key': CONSTANT_CONTACT_API_KEY
        }
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Constant Contact connection successful'
        };
      } else {
        return {
          success: false,
          message: 'Constant Contact connection failed',
          error: 'connection_failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error connecting to Constant Contact',
        error: 'network_error'
      };
    }
  }

  // Get list information
  static async getListInfo(listId: string): Promise<ConstantContactResponse> {
    try {
      const response = await fetch(`${CONSTANT_CONTACT_BASE_URL}/contact_lists/${listId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${CONSTANT_CONTACT_ACCESS_TOKEN}`,
          'X-CC-Api-Key': CONSTANT_CONTACT_API_KEY
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

  // Get all lists
  static async getAllLists(): Promise<ConstantContactResponse> {
    try {
      const response = await fetch(`${CONSTANT_CONTACT_BASE_URL}/contact_lists`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${CONSTANT_CONTACT_ACCESS_TOKEN}`,
          'X-CC-Api-Key': CONSTANT_CONTACT_API_KEY
        }
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: 'Lists retrieved successfully',
          data
        };
      } else {
        return {
          success: false,
          message: 'Failed to get lists',
          error: data.title || 'list_error'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve lists',
        error: 'network_error'
      };
    }
  }
}

// Enhanced form validation utilities
export class EnhancedFormValidator {
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

  static validateNewsletterSignup(email: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.validateRequired(email)) {
      errors.push('Email is required');
    } else if (!this.validateEmail(email)) {
      errors.push('Please enter a valid email address');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
