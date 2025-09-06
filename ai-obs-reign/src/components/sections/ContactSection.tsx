'use client';


import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Edit3 } from 'lucide-react';
import { CMSDataManager, ContactSectionData } from '@/lib/cms-data';
import { CMSAuthManager } from '@/lib/cms-auth';
import StyledMailChimpForm from '@/components/ui/StyledMailChimpForm';
import LeadCaptureModal from '@/components/ui/LeadCaptureModal';

// Icon mapping for dynamic rendering
const iconMap = {
  Mail,
  Phone,
  MapPin,
  MessageSquare
};

const ContactSection = () => {
  const [contactData, setContactData] = useState<ContactSectionData | null>(null);
  const [originalData, setOriginalData] = useState<ContactSectionData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  useEffect(() => {
    const data = CMSDataManager.getContactDataSync();
    setContactData(data);
    setOriginalData(data);
    setIsAuthenticated(CMSAuthManager.isLoggedIn());
  }, []);

  const handleSave = () => {
    if (contactData) {
      CMSDataManager.saveContactDataSync(contactData);
      setOriginalData(contactData);
      setIsEditMode(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setContactData(originalData);
      setIsEditMode(false);
    }
  };

  const updateContactData = (field: string, value: unknown) => {
    if (!contactData) return;
    
    const keys = field.split('.');
    const newData = { ...contactData };
    let current: Record<string, unknown> = newData as Record<string, unknown>;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] as Record<string, unknown>;
    }
    
    current[keys[keys.length - 1]] = value;
    setContactData(newData);
  };

  if (!contactData) {
    return <div className="py-20 bg-gray-900 text-white flex items-center justify-center">
      <div>Loading...</div>
    </div>;
  }

  return (
    <section id="contact" className="py-20 bg-gray-900 text-white relative">
      {/* Edit Mode Toggle - Only visible when authenticated */}
      {isAuthenticated && (
        <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isEditMode 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Edit3 className="w-4 h-4 inline mr-2" />
          {isEditMode ? 'Preview' : 'Edit'}
        </button>
        {isEditMode && (
          <>
            <button
              onClick={handleCancel}
              className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </>
        )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Contact Info */}
          <div>
            <div className="mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-blue-900 text-blue-200 rounded-full text-sm font-medium mb-4">
                {iconMap[contactData.badge.icon as keyof typeof iconMap] && 
                  React.createElement(iconMap[contactData.badge.icon as keyof typeof iconMap], { className: "w-4 h-4 mr-2" })
                }
                {isEditMode ? (
                  <input
                    type="text"
                    value={contactData.badge.text}
                    onChange={(e) => updateContactData('badge.text', e.target.value)}
                    className="bg-transparent border-b border-blue-400 text-blue-200 outline-none"
                  />
                ) : (
                  contactData.badge.text
                )}
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {isEditMode ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={contactData.title.main}
                      onChange={(e) => updateContactData('title.main', e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-blue-400"
                      placeholder="Main title"
                    />
                    <input
                      type="text"
                      value={contactData.title.highlight}
                      onChange={(e) => updateContactData('title.highlight', e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-blue-400 outline-none focus:border-blue-400"
                      placeholder="Highlighted title"
                    />
                  </div>
                ) : (
                  <>
                    {contactData.title.main}
                    <span className="text-blue-400 block">{contactData.title.highlight}</span>
                  </>
                )}
              </h2>
              
              <div className="text-xl text-gray-300 leading-relaxed">
                {isEditMode ? (
                  <textarea
                    value={contactData.description}
                    onChange={(e) => updateContactData('description', e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-gray-300 outline-none focus:border-blue-400 min-h-[120px]"
                    placeholder="Contact description"
                  />
                ) : (
                  contactData.description
                )}
              </div>
            </div>

            {/* Contact Methods */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactData.contactMethods.map((method, index) => {
                const Icon = iconMap[method.icon as keyof typeof iconMap];
                return (
                  <a
                    key={index}
                    href={method.href}
                    className="flex items-start space-x-4 p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors group"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                        {Icon && <Icon className="h-6 w-6 text-white" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={method.title}
                            onChange={(e) => {
                              const newMethods = [...contactData.contactMethods];
                              newMethods[index] = { ...newMethods[index], title: e.target.value };
                              updateContactData('contactMethods', newMethods);
                            }}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white outline-none focus:border-blue-400"
                            onClick={(e) => e.preventDefault()}
                          />
                        ) : (
                          method.title
                        )}
                      </h3>
                      <div className="text-gray-400 text-sm mb-2">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={method.description}
                            onChange={(e) => {
                              const newMethods = [...contactData.contactMethods];
                              newMethods[index] = { ...newMethods[index], description: e.target.value };
                              updateContactData('contactMethods', newMethods);
                            }}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-400 outline-none focus:border-blue-400 text-sm"
                            onClick={(e) => e.preventDefault()}
                          />
                        ) : (
                          method.description
                        )}
                      </div>
                      <div className="text-blue-400 font-medium">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={method.contact}
                            onChange={(e) => {
                              const newMethods = [...contactData.contactMethods];
                              newMethods[index] = { ...newMethods[index], contact: e.target.value };
                              updateContactData('contactMethods', newMethods);
                            }}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-blue-400 outline-none focus:border-blue-400"
                            onClick={(e) => e.preventDefault()}
                          />
                        ) : (
                          method.contact
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

                     {/* Right Column - MailChimp Form */}
           <div className="bg-gray-800 rounded-2xl p-8">
             <h3 className="text-2xl font-bold text-white mb-6">
               {isEditMode ? (
                 <input
                   type="text"
                   value={contactData.form.title}
                   onChange={(e) => updateContactData('form.title', e.target.value)}
                   className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-blue-400"
                 />
               ) : (
                 contactData.form.title
               )}
             </h3>
                         
            <StyledMailChimpForm />
          </div>
        </div>
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        type="demo"
      />
    </section>
  );
};

export default ContactSection;
