'use client';


import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Play, ArrowRight, Mail, User, Building, Phone } from 'lucide-react';

// Extend Window interface for MailChimp validation
declare global {
  interface Window {
    jQuery?: unknown;
    fnames?: string[];
    ftypes?: string[];
  }
}

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'demo' | 'get-started';
  title?: string;
  description?: string;
}

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  description
}) => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    organization: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const defaultContent = {
    demo: {
      title: 'Schedule a Demo',
      description: 'See R.E.I.G.N in action with a personalized demo tailored to your infrastructure needs.',
      buttonText: 'Schedule Demo',
      icon: Play
    },
    'get-started': {
      title: 'Get Started Free',
      description: 'Start your free trial today and experience the power of AI-driven observability.',
      buttonText: 'Start Free Trial',
      icon: ArrowRight
    }
  };

  const content = {
    title: title || defaultContent[type].title,
    description: description || defaultContent[type].description,
    buttonText: defaultContent[type].buttonText,
    icon: defaultContent[type].icon
  };

  // Load MailChimp validation script
  useEffect(() => {
    if (isOpen) {
      const script = document.createElement('script');
      script.src = '//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (typeof window !== 'undefined' && window.jQuery) {
          window.fnames = [];
          window.ftypes = [];
          window.fnames[0] = 'EMAIL';
          window.ftypes[0] = 'email';
          window.fnames[1] = 'FNAME';
          window.ftypes[1] = 'text';
          window.fnames[2] = 'LNAME';
          window.ftypes[2] = 'text';
          window.fnames[4] = 'PHONE';
          window.ftypes[4] = 'phone';
        }
      };

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors([]);
    setSubmitStatus('idle');

    // Basic validation
    const errors: string[] = [];
    if (!formData.email) errors.push('Email is required');
    if (!formData.fullName) errors.push('Full name is required');
    if (!formData.organization) errors.push('Organization name is required');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Submit directly to MailChimp endpoint
      const submitFormData = new FormData();
      submitFormData.append('EMAIL', formData.email);
      submitFormData.append('FNAME', formData.fullName);
      submitFormData.append('LNAME', formData.organization);
      submitFormData.append('PHONE', formData.phone);
      submitFormData.append('tags', '3146512'); // Hidden tag from form
      submitFormData.append('b_51c8d9860074f1c7205c2f452_3e97664d88', ''); // Honeypot

      await fetch(
        'https://mindfulmeasuresinc.us21.list-manage.com/subscribe/post?u=51c8d9860074f1c7205c2f452&id=3e97664d88&f_id=00ec42e6f0',
        {
          method: 'POST',
          body: submitFormData,
          mode: 'no-cors'
        }
      );

      setSubmitStatus('success');
      setSubmitMessage(
        type === 'demo' 
          ? 'Demo request submitted! Our team will contact you within 24 hours.'
          : 'Welcome aboard! Check your email for next steps to get started.'
      );
      
      // Reset form
      setFormData({
        email: '',
        fullName: '',
        organization: '',
        phone: ''
      });

    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
      console.error('Form submission error:', error);
    }

    setIsSubmitting(false);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors.length > 0) {
      setFormErrors([]);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset form state when closing
      setTimeout(() => {
        setFormData({
          email: '',
          fullName: '',
          organization: '',
          phone: ''
        });
        setSubmitStatus('idle');
        setSubmitMessage('');
        setFormErrors([]);
      }, 300);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              {React.createElement(content.icon, { className: "w-5 h-5 text-white" })}
            </div>
            <h2 className="text-xl font-bold text-white">{content.title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 mb-6">{content.description}</p>

          {/* Form Status Messages */}
          {formErrors.length > 0 && (
            <div className="mb-6 bg-red-500/10 border border-red-400/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-200 font-medium mb-1">Please fix the following errors:</p>
                  <ul className="text-red-300 text-sm space-y-1">
                    {formErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {submitStatus === 'success' && (
            <div className="mb-6 bg-green-500/10 border border-green-400/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-200">{submitMessage}</p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 bg-red-500/10 border border-red-400/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-200">{submitMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => updateFormData('fullName', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Building className="w-4 h-4 inline mr-2" />
                Organization Name *
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => updateFormData('organization', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Company"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 (555) 123-4567"
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
                  <span>Submitting...</span>
                </>
              ) : submitStatus === 'success' ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Submitted!</span>
                </>
              ) : (
                <>
                  {React.createElement(content.icon, { className: "w-4 h-4" })}
                  <span>{content.buttonText}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadCaptureModal;
