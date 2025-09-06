'use client';


import React, { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { MailChimpManager, FormValidator } from '@/lib/mailchimp';

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  className?: string;
  variant?: 'default' | 'minimal' | 'inline';
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  title = 'Stay Updated',
  description = 'Get the latest updates on AI-powered observability',
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  className = '',
  variant = 'default'
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Validate email
    if (!FormValidator.validateEmail(email)) {
      setSubmitStatus('error');
      setMessage('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await MailChimpManager.subscribeNewsletter(email, 'website-newsletter');

      if (result.success) {
        setSubmitStatus('success');
        setMessage('Thank you! Please check your email to confirm your subscription.');
        setEmail('');
      } else {
        setSubmitStatus('error');
        setMessage(result.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setMessage('Network error. Please try again.');
      console.error('Newsletter subscription error:', error);
    }

    setIsSubmitting(false);

    // Clear status after 5 seconds
    setTimeout(() => {
      setSubmitStatus('idle');
      setMessage('');
    }, 5000);
  };

  if (variant === 'minimal') {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
        
        {message && (
          <p className={`mt-2 text-sm ${
            submitStatus === 'success' ? 'text-green-400' : 'text-red-400'
          }`}>
            {message}
          </p>
        )}
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
            placeholder={placeholder}
            className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                <span>{buttonText}</span>
              </>
            )}
          </button>
        </form>
        
        {message && (
          <div className={`mt-3 p-3 rounded-lg ${
            submitStatus === 'success' 
              ? 'bg-green-500/10 border border-green-400/20' 
              : 'bg-red-500/10 border border-red-400/20'
          }`}>
            <div className="flex items-center space-x-2">
              {submitStatus === 'success' ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <p className={`text-sm ${
                submitStatus === 'success' ? 'text-green-200' : 'text-red-200'
              }`}>
                {message}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-gray-800 rounded-2xl p-8 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          submitStatus === 'success' 
            ? 'bg-green-500/10 border border-green-400/20' 
            : 'bg-red-500/10 border border-red-400/20'
        }`}>
          <div className="flex items-center space-x-3">
            {submitStatus === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <p className={`${
              submitStatus === 'success' ? 'text-green-200' : 'text-red-200'
            }`}>
              {message}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-6 py-3 font-medium rounded-lg transition-colors flex items-center justify-center space-x-2 ${
            isSubmitting
              ? 'bg-gray-600 cursor-not-allowed'
              : submitStatus === 'success'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Subscribing...</span>
            </>
          ) : submitStatus === 'success' ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Subscribed!</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{buttonText}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default NewsletterSignup;
