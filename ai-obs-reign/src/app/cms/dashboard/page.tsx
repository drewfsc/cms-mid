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
  Plus,
  GripVertical,
  EyeOff,
  Trash2,
  Copy,
  Menu,
  ChevronDown,
  ChevronUp,
  Grid3x3,
  LayoutGrid,
  Columns,
  Minus,
  Code,
  Images
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { CMSDataManager } from '@/lib/cms-data';
import { DynamicSection } from '@/lib/dynamic-sections';

export default function CMSDashboard() {
  const [sections, setSections] = useState<DynamicSection[]>([]);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = () => {
    const dynamicSections = CMSDataManager.getDynamicSections();
    setSections(dynamicSections);
  };

  const handleDeleteSection = (sectionId: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      CMSDataManager.deleteDynamicSection(sectionId);
      loadSections();
    }
  };

  const handleToggleVisibility = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      CMSDataManager.updateDynamicSection(sectionId, {
        isVisible: !section.isVisible
      });
      loadSections();
    }
  };

  const handleToggleNavigation = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      CMSDataManager.updateDynamicSection(sectionId, {
        includeInNavigation: !section.includeInNavigation
      });
      loadSections();
    }
  };

  const handleUpdateNavigationLabel = (sectionId: string, label: string) => {
    CMSDataManager.updateDynamicSection(sectionId, {
      navigationLabel: label
    });
    loadSections();
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedSection(sectionId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', sectionId);
    
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedSection(null);
    setDragOverSection(null);
    
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSection(sectionId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverSection(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedSection || draggedSection === targetSectionId) {
      return;
    }

    const draggedIndex = sections.findIndex(s => s.id === draggedSection);
    const targetIndex = sections.findIndex(s => s.id === targetSectionId);

    if (draggedIndex === -1 || targetIndex === -1) {
      return;
    }

    const reorderedSections = [...sections];
    const [draggedSectionData] = reorderedSections.splice(draggedIndex, 1);
    reorderedSections.splice(targetIndex, 0, draggedSectionData);

    reorderedSections.forEach((section, index) => {
      section.order = index;
    });

    CMSDataManager.saveDynamicSections(reorderedSections);
    loadSections();

    setDraggedSection(null);
    setDragOverSection(null);
  };

  const sectionTypes = [
    {
      name: 'Hero Section',
      icon: Layout,
      description: 'Full-width hero with title and CTA',
      href: '/cms/sections?add=hero',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
    },
    {
      name: 'Bento Grid',
      icon: Grid3x3,
      description: 'Asymmetric grid layout',
      href: '/cms/sections?add=bento',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
    },
    {
      name: 'Content Grid',
      icon: LayoutGrid,
      description: 'Regular content grid',
      href: '/cms/sections?add=grid',
      color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
    },
    {
      name: 'Columns',
      icon: Columns,
      description: 'Two-column layout',
      href: '/cms/sections?add=columns',
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300'
    },
    {
      name: 'Divider',
      icon: Minus,
      description: 'Visual separator',
      href: '/cms/sections?add=divider',
      color: 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300'
    },
    {
      name: 'Image Section',
      icon: Image,
      description: 'Image with caption',
      href: '/cms/sections?add=image',
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300'
    },
    {
      name: 'Code Block',
      icon: Code,
      description: 'Syntax highlighted code',
      href: '/cms/sections?add=code',
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
    },
    {
      name: 'Gallery',
      icon: Images,
      description: 'Image gallery grid',
      href: '/cms/sections?add=gallery',
      color: 'bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300'
    },
    {
      name: 'Contact Form',
      icon: FileText,
      description: 'Lead capture form',
      href: '/cms/sections?add=form',
      color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
    }
  ];

  const menuItems = [
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CMSHeader title="Dashboard" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your website content and settings
          </p>
        </div>

        {/* Sections List - Single Line with Reordering */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Page Sections</h2>
            <Link
              href="/cms/sections"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg btn-neumorphic hover:from-blue-600 hover:to-blue-700 flex items-center space-x-2 border-0"
            >
              <Plus className="w-4 h-4" />
              <span>Manage Sections</span>
            </Link>
          </div>
          
          {sections.length > 0 ? (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-neumorphic border-0 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-8">
                    <span className="w-8">Order</span>
                    <span className="flex-1">Section Name</span>
                    <span className="w-20">Type</span>
                    <span className="w-16">Status</span>
                    <span className="w-20">Navigation</span>
                  </div>
                  <span className="w-24 text-right">Actions</span>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {sections.map((section, index) => {
                  const isDragging = draggedSection === section.id;
                  const isDragOver = dragOverSection === section.id;
                  
                  return (
                    <div
                      key={section.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, section.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, section.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, section.id)}
                      className={`px-4 py-3 transition-all duration-200 ${
                        isDragging 
                          ? 'opacity-50 bg-blue-50 dark:bg-blue-900/20' 
                          : isDragOver 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-8 flex-1">
                          <div className="flex items-center space-x-2 w-8">
                            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{index + 1}</span>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              {section.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {section.navigationLabel && `Nav: ${section.navigationLabel}`}
                            </p>
                          </div>
                          
                          <div className="w-20">
                            <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                              {section.layout}
                            </span>
                          </div>
                          
                          <div className="w-16">
                            <div className="flex items-center space-x-1">
                              {section.isVisible ? (
                                <Eye className="w-4 h-4 text-green-600" />
                              ) : (
                                <EyeOff className="w-4 h-4 text-red-600" />
                              )}
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                {section.isVisible ? 'Visible' : 'Hidden'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="w-20">
                            {section.includeInNavigation ? (
                              <div className="flex items-center space-x-1">
                                <Menu className="w-4 h-4 text-green-600" />
                                <span className="text-xs text-green-600">In Nav</span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">Not in Nav</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 w-24 justify-end">
                          <button
                            onClick={() => handleToggleVisibility(section.id)}
                            className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                            title={section.isVisible ? 'Hide section' : 'Show section'}
                          >
                            {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          
                          <button
                            onClick={() => handleToggleNavigation(section.id)}
                            className={`p-1 rounded transition-colors ${
                              section.includeInNavigation
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                            title={section.includeInNavigation ? 'Remove from navigation' : 'Include in navigation'}
                          >
                            <Menu className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteSection(section.id)}
                            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Delete section"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-neumorphic border-0">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No sections yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Create your first section to get started
              </p>
              <Link
                href="/cms/sections"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg btn-neumorphic hover:from-blue-600 hover:to-blue-700 inline-flex items-center space-x-2 border-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Section</span>
              </Link>
            </div>
          )}
        </div>

        {/* Section Types Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add New Section</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sectionTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Link
                  key={type.name}
                  href={type.href}
                  className="block p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-neumorphic hover:shadow-neumorphic-hover transition-all duration-300 group border-0"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-3 rounded-lg ${type.color} group-hover:scale-110 transition-transform mb-3`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      {type.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {type.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Other Management Tools */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Management Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </main>
    </div>
  );
}
