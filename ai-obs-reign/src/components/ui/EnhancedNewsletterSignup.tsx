/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, Settings, RefreshCw } from 'lucide-react';
import { emailMarketingService, EmailProvider } from '@/lib/unified-email-marketing';

interface EnhancedNewsletterSignupProps {
  title?: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'inline' | 'minimal';
  provider?: EmailProvider;
  showProviderStatus?: boolean;
  customFields?: {
    firstName?: boolean;
    lastName?: boolean;
    company?: boolean;
  };
}

const EnhancedNewsletterSignup: React.FC<EnhancedNewsletterSignupProps> = ({
  title = 'Stay Updated',
  description = 'Get the latest insights and updates delivered to your inbox',
  className = '',
  variant = 'default',
  provider = 'mailchimp',
  showProviderStatus = false,
  customFields = {}
}) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [providerStatus, setProviderStatus] = useState<{
    mailchimp: boolean;
    constantContact: boolean;
    primaryProvider: EmailProvider;
    fallbackEnabled: boolean;
  } | null>(null);

  // Load provider status
  useEffect(() => {
    if (showProviderStatus) {
      const status = emailMarketingService.getProviderStatus();
      setProviderStatus(status);
    }
  }, [showProviderStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await emailMarketingService.subscribeNewsletter(email, 'website');
      
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        setEmail('');
        setFirstName('');
        setLastName('');
        setCompany('');
      } else {
        setStatus('error');
        setMessage(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
      console.error('Newsletter signup error:', error);
    }

    setIsSubmitting(false);

    // Clear status after 5 seconds
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 5000);
  };

  const getProviderIcon = (provider: EmailProvider) => {
    switch (provider) {
      case 'mailchimp':
        return '📧';
      case 'constant-contact':
        return '📬';
      case 'both':
        return '📮';
      default:
        return '📧';
    }
  };

  const getProviderName = (provider: EmailProvider) => {
    switch (provider) {
      case 'mailchimp':
        return 'Mailchimp';
      case 'constant-contact':
        return 'Constant Contact';
      case 'both':
        return 'Multiple Providers';
      default:
        return 'Email Service';
    }
  };

  if (variant === 'minimal') {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
        
        {message && (
          <p className={`mt-2 text-sm ${
            status === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>
            {message}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-gray-800 rounded-xl p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          {showProviderStatus && providerStatus && (
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <span>{getProviderIcon(providerStatus.primaryProvider)}</span>
              <span>{getProviderName(providerStatus.primaryProvider)}</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-300 text-sm mb-4">{description}</p>
        
        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            status === 'success' 
              ? 'bg-green-500/10 border border-green-400/20' 
              : 'bg-red-500/10 border border-red-400/20'
          }`}>
            <div className="flex items-center space-x-2">
              {status === 'success' ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <p className={`text-sm ${
                status === 'success' ? 'text-green-200' : 'text-red-200'
              }`}>
                {message}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
          {customFields.firstName && (
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name (optional)"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Subscribing...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Subscribe</span>
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Mail className="w-4 h-4" />
                <span>Subscribe</span>
              </>
            )}
          </button>
        </form>
        
        {message && (
          <p className={`mt-2 text-sm ${
            status === 'success' ? 'text-green-400' : 'text-red-400'
          }`}>
            {message}
          </p>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-gray-800 rounded-2xl p-8 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-300">{description}</p>
        
        {showProviderStatus && providerStatus && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-400">
            <Settings className="w-4 h-4" />
            <span>Powered by {getProviderName(providerStatus.primaryProvider)}</span>
            {providerStatus.fallbackEnabled && (
              <span className="text-xs">(with fallback)</span>
            )}
          </div>
        )}
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          status === 'success' 
            ? 'bg-green-500/10 border border-green-400/20' 
            : 'bg-red-500/10 border border-red-400/20'
        }`}>
          <div className="flex items-center space-x-3">
            {status === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <p className={`${
              status === 'success' ? 'text-green-200' : 'text-red-200'
            }`}>
              {message}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {customFields.firstName && (
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name (optional)"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          )}
        </div>
        
        {(customFields.lastName || customFields.company) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customFields.lastName && (
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name (optional)"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
            
            {customFields.company && (
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company (optional)"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-6 py-3 font-medium rounded-lg transition-colors flex items-center justify-center space-x-2 ${
            isSubmitting
              ? 'bg-gray-600 cursor-not-allowed'
              : status === 'success'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Subscribing...</span>
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Subscribed!</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Subscribe</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EnhancedNewsletterSignup;
