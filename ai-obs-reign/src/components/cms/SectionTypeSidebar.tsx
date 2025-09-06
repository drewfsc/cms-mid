'use client';


import React from 'react';
import { Layout, Grid3x3, LayoutGrid, Columns, Minus, Image, Code, Images, FileText } from 'lucide-react';
import { SECTION_TEMPLATES, SectionTemplate } from '@/lib/dynamic-sections';

interface SectionTypeSidebarProps {
  onDragStart: (template: SectionTemplate, name: string) => void;
  onDragEnd: () => void;
}

const iconMap = {
  Layout,
  Grid3x3,
  LayoutGrid,
  Columns,
  Minus,
  Image,
  Code,
  Images,
  FileText
};

const SectionTypeSidebar: React.FC<SectionTypeSidebarProps> = ({ onDragStart, onDragEnd }) => {
  const handleDragStart = (e: React.DragEvent, template: SectionTemplate) => {
    const defaultName = template.name.replace(' Section', '').replace(' Grid', '');
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify({
      template,
      name: defaultName
    }));
    onDragStart(template, defaultName);
  };

  return (
    <div className="w-80 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-neumorphic border-0 p-6 h-fit">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
          <Layout className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
          Section Types
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Drag any section type to add it to your page
        </p>
      </div>

      <div className="space-y-3">
        {SECTION_TEMPLATES.map((template) => {
          const Icon = iconMap[template.icon as keyof typeof iconMap];
          return (
            <div
              key={template.layout}
              draggable
              onDragStart={(e) => handleDragStart(e, template)}
              onDragEnd={onDragEnd}
              className="group p-4 bg-white dark:bg-gray-700 rounded-lg shadow-neumorphic hover:shadow-neumorphic-hover transition-all duration-200 cursor-grab active:cursor-grabbing border-0"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg group-hover:scale-110 transition-transform">
                  {Icon && <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 truncate">
                    {template.name}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {template.description}
                  </p>
                </div>
              </div>

              {/* Mini preview */}
              <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                {template.layout === 'hero' && (
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
                    <div className="h-1.5 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                    <div className="flex space-x-1 mt-2">
                      <div className="h-4 bg-blue-400 rounded w-16"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                    </div>
                  </div>
                )}
                
                {template.layout === 'bento' && (
                  <div className="grid grid-cols-4 gap-0.5">
                    <div className="col-span-2 row-span-2 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="col-span-2 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                )}
                
                {template.layout === 'grid' && (
                  <div className="grid grid-cols-3 gap-0.5">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    ))}
                  </div>
                )}
                
                {template.layout === 'columns' && (
                  <div className="grid grid-cols-2 gap-1">
                    <div className="space-y-0.5">
                      <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                      <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                    </div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                )}

                {template.layout === 'divider' && (
                  <div className="flex items-center space-x-1">
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                    <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                  </div>
                )}

                {template.layout === 'image' && (
                  <div className="space-y-1">
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="h-0.5 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto"></div>
                  </div>
                )}

                {template.layout === 'code' && (
                  <div className="bg-gray-800 rounded p-1 space-y-0.5">
                    <div className="flex items-center space-x-0.5 mb-0.5">
                      <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="h-0.5 bg-green-400 rounded w-1/3"></div>
                    <div className="h-0.5 bg-blue-400 rounded w-1/2"></div>
                    <div className="h-0.5 bg-green-400 rounded w-2/3"></div>
                  </div>
                )}

                {template.layout === 'gallery' && (
                  <div className="grid grid-cols-3 gap-0.5">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    ))}
                  </div>
                )}

                {template.layout === 'form' && (
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600"></div>
                    <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600"></div>
                    <div className="h-3 bg-blue-400 rounded w-1/2 mt-1"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">How to use:</p>
            <p>1. Drag any section type from this sidebar</p>
            <p>2. Drop it between sections, at the top, or at the bottom</p>
            <p>3. The section will open in edit mode automatically</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionTypeSidebar;
