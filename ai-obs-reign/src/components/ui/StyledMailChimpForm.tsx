/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

interface StyledMailChimpFormProps {
  title?: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'inline';
}

const StyledMailChimpForm: React.FC<StyledMailChimpFormProps> = ({
  title = 'Subscribe',
  description = 'Stay updated with our latest news and insights',
  className = '',
  variant = 'default'
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Load MailChimp validation script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js';
    script.async = true;
    document.body.appendChild(script);

    // Initialize MailChimp validation
    script.onload = () => {
      if (typeof window !== 'undefined' && (window as unknown as { jQuery: unknown }).jQuery) {
        (window as unknown as { fnames: unknown[] }).fnames = [];
        (window as unknown as { ftypes: unknown[] }).ftypes = [];
        (window as unknown as { fnames: unknown[] }).fnames[0] = 'EMAIL';
        (window as unknown as { ftypes: unknown[] }).ftypes[0] = 'email';
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
      // Submit directly to MailChimp endpoint
      const formData = new FormData();
      formData.append('EMAIL', email);
      formData.append('b_51c8d9860074f1c7205c2f452_3e97664d88', ''); // Honeypot

      const response = await fetch(
        'https://mindfulmeasuresinc.us21.list-manage.com/subscribe/post?u=51c8d9860074f1c7205c2f452&id=3e97664d88&f_id=00ec42e6f0',
        {
          method: 'POST',
          body: formData,
          mode: 'no-cors' // Required for MailChimp
        }
      );

      // Since we're using no-cors, we can't read the response
      // Assume success and show confirmation
      setStatus('success');
      setMessage('Thank you for subscribing! Please check your email to confirm.');
      setEmail('');

    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      console.error('Subscription error:', error);
    }

    setIsSubmitting(false);

    // Clear status after 5 seconds
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 5000);
  };

  if (variant === 'compact') {
    return (
      <div className={`bg-gray-800 rounded-xl p-6 ${className}`}>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
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

        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="w-4 h-4" />
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
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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

      {/* Hidden MailChimp form for validation */}
      <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
        <input 
          type="text" 
          name="b_51c8d9860074f1c7205c2f452_3e97664d88" 
          tabIndex={-1} 
          value="" 
          readOnly 
        />
      </div>
    </div>
  );
};

export default StyledMailChimpForm;
