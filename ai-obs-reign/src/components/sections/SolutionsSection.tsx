/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Container, 
  Server, 
  Smartphone, 
  Globe, 
  Database,
  ArrowRight,
  CheckCircle,
  Edit3,
  Plus,
  Trash2
} from 'lucide-react';
import { CMSDataManager, SolutionsSectionData } from '@/lib/cms-data';
import { CMSAuthManager } from '@/lib/cms-auth';

// Icon mapping for dynamic rendering
const iconMap = {
  Cloud,
  Container,
  Server,
  Smartphone,
  Globe,
  Database
};

const SolutionsSection = () => {
  const [solutionsData, setSolutionsData] = useState<SolutionsSectionData | null>(null);
  const [originalData, setOriginalData] = useState<SolutionsSectionData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const data = CMSDataManager.getSolutionsDataSync();
    setSolutionsData(data);
    setOriginalData(data);
    setIsAuthenticated(CMSAuthManager.isLoggedIn());
  }, []);

  const handleSave = () => {
    if (solutionsData) {
      CMSDataManager.saveSolutionsDataSync(solutionsData);
      setOriginalData(solutionsData);
      setIsEditMode(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setSolutionsData(originalData);
      setIsEditMode(false);
    }
  };

  const updateSolutionsData = (field: string, value: unknown) => {
    if (!solutionsData) return;
    
    const keys = field.split('.');
    const newData = { ...solutionsData };
    let current: Record<string, unknown> = newData as Record<string, unknown>;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] as Record<string, unknown>;
    }
    
    current[keys[keys.length - 1]] = value;
    setSolutionsData(newData);
  };

  const addFeatureToSolution = (solutionIndex: number) => {
    if (!solutionsData) return;
    
    const newSolutions = [...solutionsData.solutions];
    newSolutions[solutionIndex] = {
      ...newSolutions[solutionIndex],
      features: [...newSolutions[solutionIndex].features, 'New feature']
    };
    updateSolutionsData('solutions', newSolutions);
  };

  const removeFeatureFromSolution = (solutionIndex: number, featureIndex: number) => {
    if (!solutionsData) return;
    
    const newSolutions = [...solutionsData.solutions];
    const newFeatures = newSolutions[solutionIndex].features.filter((_, i) => i !== featureIndex);
    newSolutions[solutionIndex] = {
      ...newSolutions[solutionIndex],
      features: newFeatures
    };
    updateSolutionsData('solutions', newSolutions);
  };

  const updateSolutionFeature = (solutionIndex: number, featureIndex: number, value: string) => {
    if (!solutionsData) return;
    
    const newSolutions = [...solutionsData.solutions];
    const newFeatures = [...newSolutions[solutionIndex].features];
    newFeatures[featureIndex] = value;
    newSolutions[solutionIndex] = {
      ...newSolutions[solutionIndex],
      features: newFeatures
    };
    updateSolutionsData('solutions', newSolutions);
  };

  if (!solutionsData) {
    return <div className="py-20 bg-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <section id="solutions" className="py-20 bg-black relative">
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
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
            {iconMap[solutionsData.badge.icon as keyof typeof iconMap] && 
              React.createElement(iconMap[solutionsData.badge.icon as keyof typeof iconMap], { className: "w-4 h-4 mr-2" })
            }
            {isEditMode ? (
              <input
                type="text"
                value={solutionsData.badge.text}
                onChange={(e) => updateSolutionsData('badge.text', e.target.value)}
                className="bg-transparent border-b border-green-400 text-green-800 outline-none"
              />
            ) : (
              solutionsData.badge.text
            )}
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-400 mb-4">
            {isEditMode ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={solutionsData.title.main}
                  onChange={(e) => updateSolutionsData('title.main', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-blue-400"
                  placeholder="Main title"
                />
                <input
                  type="text"
                  value={solutionsData.title.highlight}
                  onChange={(e) => updateSolutionsData('title.highlight', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-blue-400 outline-none focus:border-blue-400"
                  placeholder="Highlighted title"
                />
              </div>
            ) : (
              <>
                {solutionsData.title.main}
                <span className="text-blue-600 block">{solutionsData.title.highlight}</span>
              </>
            )}
          </h2>
          
          <div className="text-xl text-gray-500 max-w-3xl mx-auto">
            {isEditMode ? (
              <textarea
                value={solutionsData.description}
                onChange={(e) => updateSolutionsData('description', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-gray-200 outline-none focus:border-blue-400 min-h-[120px]"
                placeholder="Solutions description"
              />
            ) : (
              solutionsData.description
            )}
          </div>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {solutionsData.solutions.map((solution, index) => {
            const Icon = iconMap[solution.icon as keyof typeof iconMap];
            return (
              <div
                key={index}
                className="group bg-purple-950/10 rounded-xl p-8 shadow-sm border border-gray-900 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${solution.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    {Icon && <Icon className="h-8 w-8 text-white" />}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-400 mb-3">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={solution.title}
                        onChange={(e) => {
                          const newSolutions = [...solutionsData.solutions];
                          newSolutions[index] = { ...newSolutions[index], title: e.target.value };
                          updateSolutionsData('solutions', newSolutions);
                        }}
                        className="w-full bg-gray-800/50 border border-gray-600 rounded px-2 py-1 text-gray-200 outline-none focus:border-blue-400"
                      />
                    ) : (
                      solution.title
                    )}
                  </h3>
                  
                  <div className="text-gray-200 leading-relaxed mb-6">
                    {isEditMode ? (
                      <textarea
                        value={solution.description}
                        onChange={(e) => {
                          const newSolutions = [...solutionsData.solutions];
                          newSolutions[index] = { ...newSolutions[index], description: e.target.value };
                          updateSolutionsData('solutions', newSolutions);
                        }}
                        className="w-full bg-gray-800/50 border border-gray-600 rounded px-2 py-1 text-gray-200 outline-none focus:border-blue-400 min-h-[80px] resize-none"
                      />
                    ) : (
                      solution.description
                    )}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-6">
                  {solution.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3 group/feature">
                      <CheckCircle className="h-4 w-4 text-green-300 flex-shrink-0" />
                      {isEditMode ? (
                        <>
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => updateSolutionFeature(index, featureIndex, e.target.value)}
                            className="flex-1 bg-gray-800/50 border border-gray-600 rounded px-2 py-1 text-gray-200 outline-none focus:border-blue-400 text-sm"
                            placeholder="Feature description"
                          />
                          <button
                            onClick={() => removeFeatureFromSolution(index, featureIndex)}
                            className="opacity-0 group-hover/feature:opacity-100 p-1 text-red-400 hover:text-red-300 transition-all"
                            title="Remove feature"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">{feature}</span>
                      )}
                    </div>
                  ))}
                  
                  {/* Add Feature Button - Only shown in edit mode */}
                  {isEditMode && (
                    <button
                      onClick={() => addFeatureToSolution(index)}
                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm transition-colors mt-2"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Feature</span>
                    </button>
                  )}
                </div>

                {/* Learn More Link */}
                <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-800/40 rounded-2xl p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            {isEditMode ? (
              <input
                type="text"
                value={solutionsData.bottomCta.title}
                onChange={(e) => updateSolutionsData('bottomCta.title', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-blue-400"
              />
            ) : (
              solutionsData.bottomCta.title
            )}
          </h3>
          <div className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {isEditMode ? (
              <textarea
                value={solutionsData.bottomCta.description}
                onChange={(e) => updateSolutionsData('bottomCta.description', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-gray-200 outline-none focus:border-blue-400 min-h-[100px]"
              />
            ) : (
              solutionsData.bottomCta.description
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white hover:bg-gray-100 text-blue-600 font-medium rounded-lg transition-colors">
              {isEditMode ? (
                <input
                  type="text"
                  value={solutionsData.bottomCta.primary.text}
                  onChange={(e) => updateSolutionsData('bottomCta.primary.text', e.target.value)}
                  className="bg-transparent outline-none text-blue-600"
                  onClick={(e) => e.preventDefault()}
                />
              ) : (
                solutionsData.bottomCta.primary.text
              )}
            </button>
            <button className="px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg border border-blue-500 transition-colors">
              {isEditMode ? (
                <input
                  type="text"
                  value={solutionsData.bottomCta.secondary.text}
                  onChange={(e) => updateSolutionsData('bottomCta.secondary.text', e.target.value)}
                  className="bg-transparent outline-none"
                  onClick={(e) => e.preventDefault()}
                />
              ) : (
                solutionsData.bottomCta.secondary.text
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
