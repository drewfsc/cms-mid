'use client';

import { useState, useEffect } from 'react';
import CMSHeader from '@/components/cms/CMSHeader';
import { CMSDataManager, HeroSectionData } from '@/lib/cms-data';
import { Save, RotateCcw, Eye, Plus, Trash2 } from 'lucide-react';

export default function CMSContent() {
  const [heroData, setHeroData] = useState<HeroSectionData | null>(null);
  const [activeTab, setActiveTab] = useState('hero');
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    setHeroData(CMSDataManager.getHeroDataSync());
  }, []);

  const handleSave = () => {
    if (!heroData) return;
    
    setSaveStatus('saving');
    try {
      CMSDataManager.saveHeroDataSync(heroData);
      setHasChanges(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleReset = () => {
    CMSDataManager.resetHeroData();
    setHeroData(CMSDataManager.getHeroDataSync());
    setHasChanges(false);
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
    setHasChanges(true);
  };

  const addBenefit = () => {
    if (!heroData) return;
    updateHeroData('benefits', [...heroData.benefits, 'New benefit']);
  };

  const removeBenefit = (index: number) => {
    if (!heroData) return;
    const newBenefits = heroData.benefits.filter((_, i) => i !== index);
    updateHeroData('benefits', newBenefits);
  };

  if (!heroData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CMSHeader title="Content Sections" showBackButton={true} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Management</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Edit hero, about, and other page sections
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2 inline" />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saveStatus === 'saving'}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                hasChanges
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4 mr-2 inline" />
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('hero')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'hero'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Hero Section
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium text-sm opacity-50 cursor-not-allowed"
              >
                About Section <span className="text-xs">(Coming Soon)</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Hero Section Editor */}
        {activeTab === 'hero' && (
          <div className="space-y-8">
            {/* Badge Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Badge</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={heroData.badge.text}
                    onChange={(e) => updateHeroData('badge.text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="badge-icon"
                    checked={heroData.badge.icon}
                    onChange={(e) => updateHeroData('badge.icon', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="badge-icon" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Show icon
                  </label>
                </div>
              </div>
            </div>

            {/* Title Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Title</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Main Title
                  </label>
                  <input
                    type="text"
                    value={heroData.title.main}
                    onChange={(e) => updateHeroData('title.main', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Highlighted Title
                  </label>
                  <input
                    type="text"
                    value={heroData.title.highlight}
                    onChange={(e) => updateHeroData('title.highlight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Description</h3>
              <textarea
                value={heroData.description}
                onChange={(e) => updateHeroData('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter hero description..."
              />
            </div>

            {/* Benefits Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Benefits</h3>
                <button
                  onClick={addBenefit}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1 inline" />
                  Add Benefit
                </button>
              </div>
              <div className="space-y-3">
                {heroData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => {
                        const newBenefits = [...heroData.benefits];
                        newBenefits[index] = e.target.value;
                        updateHeroData('benefits', newBenefits);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => removeBenefit(index)}
                      className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Call-to-Action Buttons</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Primary Button</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Button text"
                      value={heroData.cta.primary.text}
                      onChange={(e) => updateHeroData('cta.primary.text', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Link URL"
                      value={heroData.cta.primary.href}
                      onChange={(e) => updateHeroData('cta.primary.href', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Secondary Button</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Button text"
                      value={heroData.cta.secondary.text}
                      onChange={(e) => updateHeroData('cta.secondary.text', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Link URL"
                      value={heroData.cta.secondary.href}
                      onChange={(e) => updateHeroData('cta.secondary.href', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Link */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300">Preview Changes</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    View how your changes look on the live site
                  </p>
                </div>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-2 inline" />
                  Preview Site
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}



