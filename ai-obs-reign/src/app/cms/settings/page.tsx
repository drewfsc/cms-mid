'use client';

import CMSHeader from '@/components/cms/CMSHeader';
import { Globe, Shield, Database, Bell, Users, Palette, Save, RotateCcw, Upload, Image, X } from 'lucide-react';
import { SiteConfigManager } from '@/lib/site-config';
import { useState, useEffect } from 'react';

export default function CMSSettings() {
  const [siteIcon, setSiteIcon] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);

  useEffect(() => {
    const currentIcon = SiteConfigManager.getSiteIcon();
    setSiteIcon(currentIcon);
    setIconPreview(currentIcon);
  }, []);

  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Icon file size must be less than 2MB');
      return;
    }

    setIsUploadingIcon(true);

    // Convert to base64 for storage (in a real app, you'd upload to a CDN)
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setIconPreview(dataUrl);
      setIsUploadingIcon(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveIcon = () => {
    if (iconPreview) {
      SiteConfigManager.updateSiteIcon(iconPreview);
      setSiteIcon(iconPreview);
    }
  };

  const handleRemoveIcon = () => {
    SiteConfigManager.removeSiteIcon();
    setSiteIcon(null);
    setIconPreview(null);
  };

  const settingsCategories = [
    {
      name: 'Site Configuration',
      icon: Globe,
      description: 'Basic site settings, SEO, and metadata',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
    },
    {
      name: 'Security',
      icon: Shield,
      description: 'Authentication, permissions, and access control',
      color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
    },
    {
      name: 'Database',
      icon: Database,
      description: 'Data management and backup settings',
      color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
    },
    {
      name: 'Notifications',
      icon: Bell,
      description: 'Email alerts and notification preferences',
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300'
    },
    {
      name: 'User Management',
      icon: Users,
      description: 'User roles, permissions, and access levels',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
    },
    {
      name: 'Appearance',
      icon: Palette,
      description: 'Theme, branding, and visual customization',
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CMSHeader title="Site Settings" showBackButton={true} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Global site configuration and SEO settings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {settingsCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.name}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-neumorphic hover:shadow-neumorphic-hover transition-all duration-300 cursor-pointer border-0"
              >
                <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{category.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{category.description}</p>
                
                <div className="mt-4 text-sm text-blue-600 dark:text-blue-400 font-medium">
                  Configure →
                </div>
              </div>
            );
          })}
        </div>

        {/* Site Icon Configuration */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-neumorphic p-8 mb-8 border-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Site Icon</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Upload a custom icon for your site. This will appear in the header and browser tabs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Current Icon Display */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Current Icon</h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                  {siteIcon ? (
                    <img 
                      src={siteIcon} 
                      alt="Site Icon" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-white font-bold text-lg">OC</span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {siteIcon ? 'Custom icon uploaded' : 'Using default icon'}
                  </p>
                  {siteIcon && (
                    <button
                      onClick={handleRemoveIcon}
                      className="text-red-600 hover:text-red-700 text-sm flex items-center mt-1"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Remove icon
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Icon Upload */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upload New Icon</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                    <div>
                      <label htmlFor="icon-upload" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700 font-medium">
                          Click to upload
                        </span>
                        <span className="text-gray-600 dark:text-gray-400"> or drag and drop</span>
                      </label>
                      <input
                        id="icon-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleIconUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, SVG up to 2MB. Recommended: 64x64px
                    </p>
                  </div>
                </div>

                {/* Preview */}
                {iconPreview && iconPreview !== siteIcon && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <img 
                            src={iconPreview} 
                            alt="Icon Preview" 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                            New Icon Preview
                          </p>
                          <p className="text-xs text-blue-700 dark:text-blue-400">
                            Click save to apply changes
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setIconPreview(siteIcon)}
                          className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveIcon}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Save Icon
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Site Colors Configuration */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-neumorphic p-8 mb-8 border-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Site Colors</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Configure the color palette available for section backgrounds. These colors will be available when styling individual sections.
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Background Colors</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {/* This would show the current background colors */}
                <div className="text-center">
                  <div className="w-full h-16 bg-white border-2 border-gray-300 rounded-lg mb-2"></div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Pure White</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-16 bg-gray-900 border-2 border-gray-300 rounded-lg mb-2"></div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Dark Gray</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-16 bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-gray-300 rounded-lg mb-2"></div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Blue Gradient</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-16 bg-black border-2 border-gray-300 rounded-lg mb-2"></div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Pure Black</p>
                </div>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-3">
                💡 These colors are used in the section styling panel when editing sections.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Settings Form */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-neumorphic p-8 border-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site Title
              </label>
              <input
                type="text"
                defaultValue="R.E.I.G.N"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site Description
              </label>
              <input
                type="text"
                defaultValue="AI Observability Platform"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}



