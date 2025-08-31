import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, CheckCircle, Edit3 } from 'lucide-react';
import { CMSDataManager, HeroSectionData } from '@/lib/cms-data';

const HeroSection = () => {
  const [heroData, setHeroData] = useState<HeroSectionData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setHeroData(CMSDataManager.getHeroDataSync());
  }, []);

  if (!heroData) {
    return <div className="pt-20 pb-0 bg-black/70 min-h-screen flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  const handleSave = () => {
    if (heroData) {
      CMSDataManager.saveHeroDataSync(heroData);
      setIsEditMode(false);
    }
  };

  const updateHeroData = (field: string, value: unknown) => {
    if (!heroData) return;
    
    const keys = field.split('.');
    const newData = { ...heroData };
    let current: Record<string, unknown> = newData as Record<string, unknown>;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] as Record<string, unknown>;
    }
    
    current[keys[keys.length - 1]] = value;
    setHeroData(newData);
  };

  return (
    <section className="pt-20 pb-0 bg-black/70 relative">
      {/* Edit Mode Toggle */}
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
          <button
            onClick={handleSave}
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-white">
        <div className="grid grid-cols-1 w-full self-center lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 text-blue-800 rounded-full text-sm font-medium">
                {heroData.badge.icon && <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>}
                {isEditMode ? (
                  <input
                    type="text"
                    value={heroData.badge.text}
                    onChange={(e) => updateHeroData('badge.text', e.target.value)}
                    className="bg-transparent border-b border-blue-400 text-blue-800 outline-none"
                  />
                ) : (
                  heroData.badge.text
                )}
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {isEditMode ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={heroData.title.main}
                      onChange={(e) => updateHeroData('title.main', e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-blue-400"
                      placeholder="Main title"
                    />
                    <input
                      type="text"
                      value={heroData.title.highlight}
                      onChange={(e) => updateHeroData('title.highlight', e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-blue-400 outline-none focus:border-blue-400"
                      placeholder="Highlighted title"
                    />
                  </div>
                ) : (
                  <>
                    {heroData.title.main}
                    <span className="text-blue-400 block">{heroData.title.highlight}</span>
                  </>
                )}
              </h1>
              
              {/* Description */}
              <div className="text-xl text-gray-200 leading-relaxed max-w-xl">
                {isEditMode ? (
                  <textarea
                    value={heroData.description}
                    onChange={(e) => updateHeroData('description', e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-gray-200 outline-none focus:border-blue-400 min-h-[120px]"
                    placeholder="Hero description"
                  />
                ) : (
                  heroData.description
                )}
              </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-3">
              {heroData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-pink-200 flex-shrink-0" />
                  {isEditMode ? (
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => {
                        const newBenefits = [...heroData.benefits];
                        newBenefits[index] = e.target.value;
                        updateHeroData('benefits', newBenefits);
                      }}
                      className="flex-1 bg-gray-800/50 border border-gray-600 rounded px-3 py-1 text-gray-200 outline-none focus:border-blue-400"
                    />
                  ) : (
                    <span className="text-gray-200">{benefit}</span>
                  )}
                </div>
              ))}
              {isEditMode && (
                <button
                  onClick={() => updateHeroData('benefits', [...heroData.benefits, 'New benefit'])}
                  className="text-blue-400 hover:text-blue-300 text-sm ml-8"
                >
                  + Add Benefit
                </button>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={heroData.cta.secondary.href}
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-800 to-green-600 hover:bg-gray-50 text-gray-900 font-medium rounded-lg border border-gray-300 transition-colors"
              >
                <Play className="mr-2 h-4 w-4" />
                {isEditMode ? (
                  <input
                    type="text"
                    value={heroData.cta.secondary.text}
                    onChange={(e) => updateHeroData('cta.secondary.text', e.target.value)}
                    className="bg-transparent outline-none"
                    onClick={(e) => e.preventDefault()}
                  />
                ) : (
                  heroData.cta.secondary.text
                )}
              </Link>
              <Link
                href={heroData.cta.primary.href}
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors group"
              >
                {isEditMode ? (
                  <input
                    type="text"
                    value={heroData.cta.primary.text}
                    onChange={(e) => updateHeroData('cta.primary.text', e.target.value)}
                    className="bg-transparent outline-none"
                    onClick={(e) => e.preventDefault()}
                  />
                ) : (
                  heroData.cta.primary.text
                )}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="relative z-10 bg-purple-500/10 rounded-2xl shadow-2xl p-8">
              {/* Mock Dashboard */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-100">System Overview</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">All Systems Operational</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-950/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">99.9%</div>
                    <div className="text-sm text-gray-500">Uptime</div>
                  </div>
                  <div className="bg-gray-950/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">2.1s</div>
                    <div className="text-sm text-gray-500">Avg Response</div>
                  </div>
                  <div className="bg-gray-950/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">847</div>
                    <div className="text-sm text-gray-500">Active Services</div>
                  </div>
                  <div className="bg-gray-950/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">12</div>
                    <div className="text-sm text-gray-500">Alerts Resolved</div>
                  </div>
                </div>

                {/* Mock Chart */}
                <div className="bg-gray-950/50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-2">Performance Trend</div>
                  <div className="h-20 bg-gradient-to-b from-purple-900 to-blue-800 rounded opacity-30"></div>
                </div>
              </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
            <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
