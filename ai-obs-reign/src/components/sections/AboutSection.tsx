/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import React, { useState, useEffect } from 'react';
import { Users, Target, Zap, Award, Edit3 } from 'lucide-react';
import { CMSDataManager, AboutSectionData } from '@/lib/cms-data';
import { CMSAuthManager } from '@/lib/cms-auth';

// Icon mapping for dynamic rendering
const iconMap = {
  Users,
  Target,
  Zap,
  Award
};

const AboutSection = () => {
  const [aboutData, setAboutData] = useState<AboutSectionData | null>(null);
  const [originalData, setOriginalData] = useState<AboutSectionData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const data = CMSDataManager.getAboutDataSync();
    setAboutData(data);
    setOriginalData(data);
    setIsAuthenticated(CMSAuthManager.isLoggedIn());
  }, []);

  const handleSave = () => {
    if (aboutData) {
      CMSDataManager.saveAboutDataSync(aboutData);
      setOriginalData(aboutData);
      setIsEditMode(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setAboutData(originalData);
      setIsEditMode(false);
    }
  };

  const updateAboutData = (field: string, value: unknown) => {
    if (!aboutData) return;
    
    const keys = field.split('.');
    const newData = { ...aboutData };
    let current: Record<string, unknown> = newData as Record<string, unknown>;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] as Record<string, unknown>;
    }
    
    current[keys[keys.length - 1]] = value;
    setAboutData(newData);
  };

  if (!aboutData) {
    return <div className="py-20 bg-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <section id="about" className="py-20 bg-black relative">
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
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
            {iconMap[aboutData.badge.icon as keyof typeof iconMap] && 
              React.createElement(iconMap[aboutData.badge.icon as keyof typeof iconMap], { className: "w-4 h-4 mr-2" })
            }
            {isEditMode ? (
              <input
                type="text"
                value={aboutData.badge.text}
                onChange={(e) => updateAboutData('badge.text', e.target.value)}
                className="bg-transparent border-b border-purple-400 text-purple-800 outline-none"
              />
            ) : (
              aboutData.badge.text
            )}
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {isEditMode ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={aboutData.title.main}
                  onChange={(e) => updateAboutData('title.main', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-blue-400"
                  placeholder="Main title"
                />
                <input
                  type="text"
                  value={aboutData.title.highlight}
                  onChange={(e) => updateAboutData('title.highlight', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-blue-400 outline-none focus:border-blue-400"
                  placeholder="Highlighted title"
                />
              </div>
            ) : (
              <>
                {aboutData.title.main}
                <span className="text-blue-600 block">{aboutData.title.highlight}</span>
              </>
            )}
          </h2>
          
          <div className="text-xl text-gray-600 max-w-3xl mx-auto">
            {isEditMode ? (
              <textarea
                value={aboutData.description}
                onChange={(e) => updateAboutData('description', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-gray-200 outline-none focus:border-blue-400 min-h-[120px]"
                placeholder="About description"
              />
            ) : (
              aboutData.description
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {aboutData.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {isEditMode ? (
                  <input
                    type="text"
                    value={stat.number}
                    onChange={(e) => {
                      const newStats = [...aboutData.stats];
                      newStats[index] = { ...newStats[index], number: e.target.value };
                      updateAboutData('stats', newStats);
                    }}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded px-2 py-1 text-blue-400 outline-none focus:border-blue-400 text-center"
                  />
                ) : (
                  stat.number
                )}
              </div>
              <div className="text-gray-600 font-medium">
                {isEditMode ? (
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...aboutData.stats];
                      newStats[index] = { ...newStats[index], label: e.target.value };
                      updateAboutData('stats', newStats);
                    }}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded px-2 py-1 text-gray-200 outline-none focus:border-blue-400 text-center text-sm"
                  />
                ) : (
                  stat.label
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {aboutData.values.map((value, index) => {
            const Icon = iconMap[value.icon as keyof typeof iconMap];
            return (
              <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    {Icon && <Icon className="h-6 w-6 text-blue-600" />}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={value.title}
                        onChange={(e) => {
                          const newValues = [...aboutData.values];
                          newValues[index] = { ...newValues[index], title: e.target.value };
                          updateAboutData('values', newValues);
                        }}
                        className="w-full bg-gray-100 border border-gray-300 rounded px-2 py-1 text-gray-900 outline-none focus:border-blue-400"
                      />
                    ) : (
                      value.title
                    )}
                  </h3>
                  <div className="text-gray-600">
                    {isEditMode ? (
                      <textarea
                        value={value.description}
                        onChange={(e) => {
                          const newValues = [...aboutData.values];
                          newValues[index] = { ...newValues[index], description: e.target.value };
                          updateAboutData('values', newValues);
                        }}
                        className="w-full bg-gray-100 border border-gray-300 rounded px-2 py-1 text-gray-600 outline-none focus:border-blue-400 min-h-[80px] resize-none"
                      />
                    ) : (
                      value.description
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Team Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {isEditMode ? (
              <input
                type="text"
                value={aboutData.team.title}
                onChange={(e) => updateAboutData('team.title', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-blue-400"
              />
            ) : (
              aboutData.team.title
            )}
          </h3>
          <div className="text-gray-600 max-w-2xl mx-auto mb-8">
            {isEditMode ? (
              <textarea
                value={aboutData.team.description}
                onChange={(e) => updateAboutData('team.description', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-gray-200 outline-none focus:border-blue-400 min-h-[100px]"
              />
            ) : (
              aboutData.team.description
            )}
          </div>
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            {isEditMode ? (
              <input
                type="text"
                value={aboutData.team.ctaText}
                onChange={(e) => updateAboutData('team.ctaText', e.target.value)}
                className="bg-transparent outline-none"
                onClick={(e) => e.preventDefault()}
              />
            ) : (
              aboutData.team.ctaText
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
