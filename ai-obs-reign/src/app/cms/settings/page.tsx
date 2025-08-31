'use client';

import CMSHeader from '@/components/cms/CMSHeader';
import { Globe, Shield, Database, Bell, Users, Palette, Save, RotateCcw } from 'lucide-react';

export default function CMSSettings() {
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
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
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

        {/* Quick Settings Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
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



