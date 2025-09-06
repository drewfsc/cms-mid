 

'use client';


import React, { useState } from 'react';
import { Plus, Trash2, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { DynamicSection } from '@/lib/dynamic-sections';
import { SectionStylingUtils, useParallaxScroll } from '@/lib/section-styling';

interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder: string;
}

interface DynamicFormSectionProps {
  section: DynamicSection;
  isEditMode?: boolean;
  onUpdate?: (fields: Record<string, unknown>) => void;
}

const DynamicFormSection: React.FC<DynamicFormSectionProps> = ({ section, isEditMode = false, onUpdate }) => {
  const { fields, styling } = section;
  const formFields = (fields.fields as FormField[]) || [];
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  
  // Provide fallback styling if not defined
  const fallbackStyling = {
    backgroundColor: 'white',
    textColor: 'auto' as const,
    padding: 'large' as const
  };
  
  const sectionStyling = styling || fallbackStyling;
  const scrollY = useParallaxScroll(sectionStyling.enableParallax || false);
  const { containerStyle, containerClass, backgroundImageStyle } = SectionStylingUtils.getSectionStyles(sectionStyling);

  const handleFieldChange = (fieldName: string, value: unknown) => {
    if (onUpdate) {
      onUpdate({ ...fields, [fieldName]: value });
    }
  };

  const handleFormFieldChange = (index: number, field: string, value: unknown) => {
    const newFields = [...formFields];
    newFields[index] = { ...newFields[index], [field]: value };
    handleFieldChange('fields', newFields);
  };

  const addFormField = () => {
    const newField: FormField = {
      name: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false,
      placeholder: 'Enter value'
    };
    handleFieldChange('fields', [...formFields, newField]);
  };

  const removeFormField = (index: number) => {
    const newFields = formFields.filter((_, i) => i !== index);
    handleFieldChange('fields', newFields);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    setSubmitStatus('idle');
    
    // Basic validation
    const requiredFields = formFields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.name]);
    
    if (missingFields.length > 0) {
      setSubmitStatus('error');
      setSubmitMessage(`Please fill in: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setSubmitStatus('success');
      setSubmitMessage(typeof fields.successMessage === 'string' ? fields.successMessage : 'Thank you! Your message has been sent.');
      setFormData({});
    }, 1000);
  };

  const renderFormField = (field: FormField, index: number) => {
    if (isEditMode) {
      return (
        <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Field {index + 1}</h4>
            <button
              onClick={() => removeFormField(index)}
              className="p-1 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={field.label}
              onChange={(e) => handleFormFieldChange(index, 'label', e.target.value)}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
              placeholder="Field label"
            />
            <select
              value={field.type}
              onChange={(e) => handleFormFieldChange(index, 'type', e.target.value)}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="tel">Phone</option>
              <option value="textarea">Textarea</option>
              <option value="select">Select</option>
            </select>
          </div>
          
          <input
            type="text"
            value={field.placeholder}
            onChange={(e) => handleFormFieldChange(index, 'placeholder', e.target.value)}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
            placeholder="Placeholder text"
          />
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => handleFormFieldChange(index, 'required', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Required field</span>
          </label>
        </div>
      );
    }

    // Render actual form field
    const commonProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        setFormData(prev => ({ ...prev, [field.name]: e.target.value })),
      className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white",
      placeholder: field.placeholder,
      required: field.required
    };

    return (
      <div key={index}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        {field.type === 'textarea' ? (
          <textarea {...commonProps} rows={4} />
        ) : (
          <input {...commonProps} type={field.type} />
        )}
      </div>
    );
  };

  return (
    <section 
      id={section.id}
      className={`relative ${containerClass}`}
      style={containerStyle}
    >
      {/* Background Image with Parallax */}
      {backgroundImageStyle && (
        <div
          className="absolute inset-0"
          style={{
            ...backgroundImageStyle,
            transform: sectionStyling.enableParallax 
              ? SectionStylingUtils.getParallaxTransform(scrollY, true)
              : undefined
          }}
        />
      )}
      
      {/* Content Container */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-neumorphic p-8">
          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {isEditMode ? (
                <input
                  type="text"
                  value={typeof fields.title === 'string' ? fields.title : ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-blue-400"
                  placeholder="Form title"
                />
              ) : (
                typeof fields.title === 'string' ? fields.title : 'Contact Form'
              )}
            </h2>

            {(fields.description || isEditMode) && (
              <p className="text-gray-600 dark:text-gray-400">
                {isEditMode ? (
                  <textarea
                    value={typeof fields.description === 'string' ? fields.description : ''}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-600 dark:text-gray-400 outline-none focus:border-blue-400"
                    placeholder="Form description"
                    rows={3}
                  />
                ) : (
                  typeof fields.description === 'string' ? fields.description : ''
                )}
              </p>
            )}
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-green-700 dark:text-green-300">{submitMessage}</p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-red-700 dark:text-red-300">{submitMessage}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {formFields.map((field, index) => renderFormField(field, index))}

            {/* Add Field Button - Edit Mode Only */}
            {isEditMode && (
              <button
                type="button"
                onClick={addFormField}
                className="w-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 shadow-neumorphic hover:shadow-neumorphic-hover rounded-lg p-4 flex items-center justify-center transition-all duration-300 border-0"
              >
                <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">Add Form Field</span>
              </button>
            )}

            {/* Submit Button */}
            {!isEditMode && formFields.length > 0 && (
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>{typeof fields.submitText === 'string' ? fields.submitText : 'Send Message'}</span>
              </button>
            )}

            {/* Edit Mode Submit Button Settings */}
            {isEditMode && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Submit Button Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={typeof fields.submitText === 'string' ? fields.submitText : ''}
                    onChange={(e) => handleFieldChange('submitText', e.target.value)}
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm"
                    placeholder="Submit button text"
                  />
                  <input
                    type="text"
                    value={typeof fields.successMessage === 'string' ? fields.successMessage : ''}
                    onChange={(e) => handleFieldChange('successMessage', e.target.value)}
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm"
                    placeholder="Success message"
                  />
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default DynamicFormSection;
