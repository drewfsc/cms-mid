// Unified Email Marketing Service
// Supports both Mailchimp and Constant Contact integrations

import { MailChimpManager, MailChimpContact, MailChimpResponse } from './mailchimp';
import { ConstantContactManager, ConstantContactContact, ConstantContactResponse } from './constant-contact';

export type EmailProvider = 'mailchimp' | 'constant-contact' | 'both';

export interface UnifiedContact {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  message?: string;
  source?: string;
  tags?: string[];
  customFields?: Record<string, string>;
}

export interface UnifiedResponse {
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
  provider?: string;
}

export interface EmailMarketingConfig {
  primaryProvider: EmailProvider;
  mailchimpEnabled: boolean;
  constantContactEnabled: boolean;
  fallbackEnabled: boolean; // Use secondary provider if primary fails
}

export class UnifiedEmailMarketingService {
  private config: EmailMarketingConfig;

  constructor(config: EmailMarketingConfig) {
    this.config = config;
  }

  // Convert unified contact to provider-specific format
  private convertToMailChimp(contact: UnifiedContact): MailChimpContact {
    return {
      email: contact.email,
      firstName: contact.firstName,
      lastName: contact.lastName,
      company: contact.company,
      phone: contact.phone,
      message: contact.message,
      source: contact.source,
      tags: contact.tags
    };
  }

  private convertToConstantContact(contact: UnifiedContact): ConstantContactContact {
    return {
      email: contact.email,
      firstName: contact.firstName,
      lastName: contact.lastName,
      company: contact.company,
      phone: contact.phone,
      message: contact.message,
      source: contact.source,
      tags: contact.tags,
      customFields: contact.customFields
    };
  }

  // Add contact to both providers
  private async addToBothProviders(
    contact: UnifiedContact,
    listId: string,
    options: any = {}
  ): Promise<UnifiedResponse> {
    const results: UnifiedResponse[] = [];
    let successCount = 0;

    // Add to Mailchimp
    if (this.config.mailchimpEnabled) {
      try {
        const mailchimpResult = await MailChimpManager.addContact(
          listId,
          this.convertToMailChimp(contact),
          options
        );
        results.push({
          ...mailchimpResult,
          provider: 'mailchimp'
        });
        if (mailchimpResult.success) successCount++;
      } catch (error) {
        results.push({
          success: false,
          message: 'Mailchimp error',
          error: 'mailchimp_error',
          provider: 'mailchimp'
        });
      }
    }

    // Add to Constant Contact
    if (this.config.constantContactEnabled) {
      try {
        const ccResult = await ConstantContactManager.addContact(
          listId,
          this.convertToConstantContact(contact),
          options
        );
        results.push({
          ...ccResult,
          provider: 'constant-contact'
        });
        if (ccResult.success) successCount++;
      } catch (error) {
        results.push({
          success: false,
          message: 'Constant Contact error',
          error: 'constant_contact_error',
          provider: 'constant-contact'
        });
      }
    }

    return {
      success: successCount > 0,
      message: successCount > 0 
        ? `Successfully added to ${successCount} provider(s)` 
        : 'Failed to add to any provider',
      data: results,
      error: successCount === 0 ? 'all_providers_failed' : undefined
    };
  }

  // Add contact using primary provider with fallback
  private async addWithFallback(
    contact: UnifiedContact,
    listId: string,
    options: any = {}
  ): Promise<UnifiedResponse> {
    const primaryProvider = this.config.primaryProvider;
    
    // Try primary provider first
    let result: UnifiedResponse;
    
    if (primaryProvider === 'mailchimp' && this.config.mailchimpEnabled) {
      result = await MailChimpManager.addContact(
        listId,
        this.convertToMailChimp(contact),
        options
      );
      result.provider = 'mailchimp';
    } else if (primaryProvider === 'constant-contact' && this.config.constantContactEnabled) {
      result = await ConstantContactManager.addContact(
        listId,
        this.convertToConstantContact(contact),
        options
      );
      result.provider = 'constant-contact';
    } else {
      return {
        success: false,
        message: 'Primary provider not available',
        error: 'provider_unavailable'
      };
    }

    // If primary failed and fallback is enabled, try secondary provider
    if (!result.success && this.config.fallbackEnabled) {
      const fallbackProvider = primaryProvider === 'mailchimp' ? 'constant-contact' : 'mailchimp';
      
      if (fallbackProvider === 'mailchimp' && this.config.mailchimpEnabled) {
        const fallbackResult = await MailChimpManager.addContact(
          listId,
          this.convertToMailChimp(contact),
          options
        );
        if (fallbackResult.success) {
          return {
            ...fallbackResult,
            provider: 'mailchimp',
            message: `Added via fallback provider (${fallbackProvider})`
          };
        }
      } else if (fallbackProvider === 'constant-contact' && this.config.constantContactEnabled) {
        const fallbackResult = await ConstantContactManager.addContact(
          listId,
          this.convertToConstantContact(contact),
          options
        );
        if (fallbackResult.success) {
          return {
            ...fallbackResult,
            provider: 'constant-contact',
            message: `Added via fallback provider (${fallbackProvider})`
          };
        }
      }
    }

    return result;
  }

  // Public methods
  async addContact(
    listId: string,
    contact: UnifiedContact,
    options: {
      doubleOptin?: boolean;
      updateExisting?: boolean;
      sendWelcome?: boolean;
    } = {}
  ): Promise<UnifiedResponse> {
    if (this.config.primaryProvider === 'both') {
      return this.addToBothProviders(contact, listId, options);
    } else {
      return this.addWithFallback(contact, listId, options);
    }
  }

  async subscribeNewsletter(email: string, source: string = 'website'): Promise<UnifiedResponse> {
    const contact: UnifiedContact = {
      email,
      source,
      tags: ['newsletter', 'website-signup']
    };

    return this.addContact('newsletter', contact, {
      doubleOptin: true,
      sendWelcome: true
    });
  }

  async submitContactForm(contact: UnifiedContact): Promise<UnifiedResponse> {
    const contactWithTags = {
      ...contact,
      source: 'contact-form',
      tags: [...(contact.tags || []), 'contact-lead', 'website-contact']
    };

    return this.addContact('contact_leads', contactWithTags, {
      doubleOptin: false,
      sendWelcome: false
    });
  }

  async submitDemoRequest(contact: UnifiedContact): Promise<UnifiedResponse> {
    const contactWithTags = {
      ...contact,
      source: 'demo-request',
      tags: [...(contact.tags || []), 'demo-request', 'high-intent-lead']
    };

    return this.addContact('demo_requests', contactWithTags, {
      doubleOptin: false,
      sendWelcome: false
    });
  }

  async submitGetStarted(contact: UnifiedContact): Promise<UnifiedResponse> {
    const contactWithTags = {
      ...contact,
      source: 'get-started',
      tags: [...(contact.tags || []), 'get-started', 'trial-interest']
    };

    return this.addContact('general_inquiries', contactWithTags, {
      doubleOptin: false,
      sendWelcome: true
    });
  }

  // Test connections
  async testConnections(): Promise<{
    mailchimp: UnifiedResponse;
    constantContact: UnifiedResponse;
  }> {
    const results = {
      mailchimp: { success: false, message: 'Not tested' } as UnifiedResponse,
      constantContact: { success: false, message: 'Not tested' } as UnifiedResponse
    };

    if (this.config.mailchimpEnabled) {
      results.mailchimp = await MailChimpManager.testConnection();
    }

    if (this.config.constantContactEnabled) {
      results.constantContact = await ConstantContactManager.testConnection();
    }

    return results;
  }

  // Get provider status
  getProviderStatus(): {
    mailchimp: boolean;
    constantContact: boolean;
    primaryProvider: EmailProvider;
    fallbackEnabled: boolean;
  } {
    return {
      mailchimp: this.config.mailchimpEnabled,
      constantContact: this.config.constantContactEnabled,
      primaryProvider: this.config.primaryProvider,
      fallbackEnabled: this.config.fallbackEnabled
    };
  }
}

// Default configuration
export const defaultEmailConfig: EmailMarketingConfig = {
  primaryProvider: 'mailchimp',
  mailchimpEnabled: true,
  constantContactEnabled: false,
  fallbackEnabled: true
};

// Create default instance
export const emailMarketingService = new UnifiedEmailMarketingService(defaultEmailConfig);
