'use client';

import Link from 'next/link';
import CMSHeader from '@/components/cms/CMSHeader';
import { 
  FileText, 
  Settings, 
  BarChart3, 
  Image,
  Globe,
  Eye,
  Edit,
  TrendingUp,
  Calendar,
  Layout,
  Plus
} from 'lucide-react';

export default function CMSDashboard() {
  const menuItems = [
    { 
      name: 'Page Sections', 
      href: '/cms/sections', 
      icon: Layout, 
      description: 'Add, edit, and manage all page sections',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
      stats: 'Dynamic content'
    },
    { 
      name: 'Media Library', 
      href: '/cms/media', 
      icon: Image, 
      description: 'Upload and manage images and documents',
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
      stats: '24 files'
    },
    { 
      name: 'Site Settings', 
      href: '/cms/settings', 
      icon: Globe, 
      description: 'Global site configuration and SEO',
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300',
      stats: 'Last updated today'
    },
  ];

  const recentActivity = [
    {
      action: 'Updated Hero Section',
      user: 'Admin',
      time: '2 hours ago',
      icon: Edit,
      color: 'text-blue-600'
    },
    {
      action: 'Added new feature',
      user: 'Admin',
      time: '5 hours ago',
      icon: BarChart3,
      color: 'text-green-600'
    },
    {
      action: 'Uploaded media files',
      user: 'Admin',
      time: '1 day ago',
      icon: Image,
      color: 'text-orange-600'
    },
    {
      action: 'Updated site settings',
      user: 'Admin',
      time: '2 days ago',
      icon: Settings,
      color: 'text-purple-600'
    }
  ];

  const quickStats = [
    {
      label: 'Dynamic Sections',
      value: '5',
      change: '+5',
      icon: Layout,
      color: 'text-blue-600'
    },
    {
      label: 'Media Files',
      value: '24',
      change: '+5',
      icon: Image,
      color: 'text-orange-600'
    },
    {
      label: 'Last Updated',
      value: 'Today',
      change: '',
      icon: Calendar,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CMSHeader title="Dashboard" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your R.E.I.G.N website content and settings
          </p>
        </div>

        {/* Quick Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg shadow-neumorphic border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      {stat.change !== '+0' && (
                        <span className="text-sm text-green-600 font-medium">
                          {stat.change}
                        </span>
                      )}
                    </div>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            );
          })}
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Management Grid */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Content Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-neumorphic hover:shadow-neumorphic-hover transition-all duration-300 group border-0"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${item.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {item.stats}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.description}</p>
                    
                    <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                      <span>Manage</span>
                      <Edit className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            {/* <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-neumorphic p-6 border-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <Link
                  href="/cms/sections"
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-700 dark:to-blue-600 rounded-lg shadow-neumorphic hover:shadow-neumorphic-hover transition-all duration-300 border-0"
                >
                  <div className="flex items-center space-x-3">
                    <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Add Section</span>
                  </div>
                </Link>
                
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg shadow-neumorphic hover:shadow-neumorphic-hover transition-all duration-300 border-0"
                >
                  <div className="flex items-center space-x-3">
                    <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Preview Site</span>
                  </div>
                </Link>
              </div>
            </div> */}

            {/* Recent Activity */}
            {/* <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-neumorphic p-6 border-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Recent Activity
              </h3>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                        <Icon className={`w-4 h-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          by {activity.user} • {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
}
