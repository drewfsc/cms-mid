'use client';


import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { 
  Brain, 
  Shield, 
  Zap, 
  BarChart3, 
  AlertTriangle, 
  Play,
  ArrowRight,
  Clock, 
  Network, 
  Cpu,
  Database,
  Edit3
} from 'lucide-react';
import { CMSDataManager, FeaturesSectionData } from '@/lib/cms-data';
import { CMSAuthManager } from '@/lib/cms-auth';

// Icon mapping for dynamic rendering
const iconMap = {
  Brain,
  Shield,
  Zap,
  BarChart3,
  AlertTriangle,
  Clock,
  Network,
  Cpu,
  Database
};

const FeaturesSection = () => {
  const [featuresData, setFeaturesData] = useState<FeaturesSectionData | null>(null);
  const [originalData, setOriginalData] = useState<FeaturesSectionData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const data = CMSDataManager.getFeaturesDataSync();
    setFeaturesData(data);
    setOriginalData(data);
    setIsAuthenticated(CMSAuthManager.isLoggedIn());
  }, []);

  const handleSave = () => {
    if (featuresData) {
      CMSDataManager.saveFeaturesDataSync(featuresData);
      setOriginalData(featuresData);
      setIsEditMode(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setFeaturesData(originalData);
      setIsEditMode(false);
    }
  };

  const updateFeaturesData = (field: string, value: unknown) => {
    if (!featuresData) return;
    
    const keys = field.split('.');
    const newData = { ...featuresData };
    let current: Record<string, unknown> = newData as Record<string, unknown>;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] as Record<string, unknown>;
    }
    
    current[keys[keys.length - 1]] = value;
    setFeaturesData(newData);
  };

  if (!featuresData) {
    return <div className="py-20 bg-black-900/90 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <section id="features" className="py-20 bg-black-900/90 relative">
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
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 text-blue-300 rounded-full text-lg font-extralight mb-4">
            {iconMap[featuresData.badge.icon as keyof typeof iconMap] && 
              React.createElement(iconMap[featuresData.badge.icon as keyof typeof iconMap], { className: "w-4 h-4 mr-2 bg-purple-800/20 border-purple-500" })
            }
            {isEditMode ? (
              <input
                type="text"
                value={featuresData.badge.text}
                onChange={(e) => updateFeaturesData('badge.text', e.target.value)}
                className="bg-transparent border-b border-blue-400 text-blue-300 outline-none"
              />
            ) : (
              featuresData.badge.text
            )}
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {isEditMode ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={featuresData.title.main}
                  onChange={(e) => updateFeaturesData('title.main', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-blue-400"
                  placeholder="Main title"
                />
                <input
                  type="text"
                  value={featuresData.title.highlight}
                  onChange={(e) => updateFeaturesData('title.highlight', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-blue-400 outline-none focus:border-blue-400"
                  placeholder="Highlighted title"
                />
              </div>
            ) : (
              <>
                {featuresData.title.main}
                <span className="text-blue-400 block">{featuresData.title.highlight}</span>
              </>
            )}
          </h2>
          
          <div className="text-xl text-gray-200 max-w-3xl mx-auto">
            {isEditMode ? (
              <textarea
                value={featuresData.description}
                onChange={(e) => updateFeaturesData('description', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-gray-200 outline-none focus:border-blue-400 min-h-[120px]"
                placeholder="Features description"
              />
            ) : (
              featuresData.description
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.features.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <div
                key={index}
                className={`group relative ${feature.bg} backdrop-blur-xs border border-purple-300/10 rounded-xl p-8 hover:shadow-lg hover:bg-white/20 transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors`}>
                    {Icon && <Icon className={`h-6 w-6 ${feature.color}`} />}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => {
                        const newFeatures = [...featuresData.features];
                        newFeatures[index] = { ...newFeatures[index], title: e.target.value };
                        updateFeaturesData('features', newFeatures);
                      }}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded px-2 py-1 text-white outline-none focus:border-blue-400"
                    />
                  ) : (
                    feature.title
                  )}
                </h3>
                
                <div className="text-gray-200 leading-relaxed">
                  {isEditMode ? (
                    <textarea
                      value={feature.description}
                      onChange={(e) => {
                        const newFeatures = [...featuresData.features];
                        newFeatures[index] = { ...newFeatures[index], description: e.target.value };
                        updateFeaturesData('features', newFeatures);
                      }}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded px-2 py-1 text-gray-200 outline-none focus:border-blue-400 min-h-[100px] resize-none"
                    />
                  ) : (
                    feature.description
                  )}
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-400 transition-colors pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="text-gray-200 mb-6 text-2xl">
            {isEditMode ? (
              <input
                type="text"
                value={featuresData.bottomCta.text}
                onChange={(e) => updateFeaturesData('bottomCta.text', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-gray-200 outline-none focus:border-blue-400"
              />
            ) : (
              featuresData.bottomCta.text
            )}
          </div>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={featuresData.bottomCta.secondary.href}
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-800 to-green-600 hover:bg-gray-50 text-gray-900 font-medium rounded-lg border border-gray-300 transition-colors"
            >
              <Play className="mr-2 h-4 w-4" />
              {isEditMode ? (
                <input
                  type="text"
                  value={featuresData.bottomCta.secondary.text}
                  onChange={(e) => updateFeaturesData('bottomCta.secondary.text', e.target.value)}
                  className="bg-transparent outline-none"
                  onClick={(e) => e.preventDefault()}
                />
              ) : (
                featuresData.bottomCta.secondary.text
              )}
            </Link>
            <Link
              href={featuresData.bottomCta.primary.href}
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors group"
            >
              {isEditMode ? (
                <input
                  type="text"
                  value={featuresData.bottomCta.primary.text}
                  onChange={(e) => updateFeaturesData('bottomCta.primary.text', e.target.value)}
                  className="bg-transparent outline-none"
                  onClick={(e) => e.preventDefault()}
                />
              ) : (
                featuresData.bottomCta.primary.text
              )}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Gradient transition to white background */}
      <div className="h-2"></div>
    </section>
  );
};

export default FeaturesSection;
