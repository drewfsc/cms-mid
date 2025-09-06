/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import React, { useState, useEffect } from 'react';
import { X, Layout, Grid3x3, LayoutGrid, Columns, Minus, Image, Code, Images, FileText } from 'lucide-react';
import { SECTION_TEMPLATES, SectionLayout, SectionTemplate } from '@/lib/dynamic-sections';

interface SectionTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: SectionTemplate, name: string) => void;
  onDragStart?: (template: SectionTemplate, name: string) => void;
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

const SectionTypeModal: React.FC<SectionTypeModalProps> = ({ isOpen, onClose, onSelect, onDragStart }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<SectionTemplate | null>(null);
  const [sectionName, setSectionName] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedTemplate) {
      setError('Please select a section type');
      return;
    }

    if (!sectionName.trim()) {
      setError('Please enter a section name');
      return;
    }

    onSelect(selectedTemplate, sectionName.trim());
    handleClose();
  };

  const handleClose = () => {
    setSelectedTemplate(null);
    setSectionName('');
    setError('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 overflow-y-auto"
      style={{ 
        zIndex: 999999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={handleClose}
          style={{ zIndex: 999998 }}
        />

        {/* Modal panel */}
        <div 
          className="relative w-full max-w-3xl bg-white dark:bg-gray-800 shadow-2xl rounded-2xl"
          style={{ zIndex: 999999 }}
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Section
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Section Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Section Name *
              </label>
              <input
                type="text"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                placeholder="e.g., Our Services, Team Members, Testimonials"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Template Selection Grid */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Choose Section Layout *
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SECTION_TEMPLATES.map((template) => {
                  const Icon = iconMap[template.icon as keyof typeof iconMap];
                  return (
                    <button
                      key={template.layout}
                      type="button"
                      onClick={() => setSelectedTemplate(template)}
                      draggable={true}
                      onDragStart={(e) => {
                        if (onDragStart && sectionName.trim()) {
                          e.dataTransfer.setData('application/json', JSON.stringify({
                            template,
                            name: sectionName.trim()
                          }));
                          onDragStart(template, sectionName.trim());
                        }
                      }}
                      onDragEnd={() => {
                        // Reset any visual feedback
                      }}
                      className={`p-6 border-2 rounded-xl text-left transition-all cursor-grab active:cursor-grabbing ${
                        selectedTemplate?.layout === template.layout
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${
                          selectedTemplate?.layout === template.layout
                            ? 'bg-blue-100 dark:bg-blue-800'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          {Icon && <Icon className={`w-6 h-6 ${
                            selectedTemplate?.layout === template.layout
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`} />}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {template.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {template.description}
                          </p>
                        </div>
                      </div>

                      {/* Preview mockup */}
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        {template.layout === 'hero' && (
                          <div className="space-y-2">
                            <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                            <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                            <div className="flex space-x-2 mt-3">
                              <div className="h-6 bg-blue-400 rounded w-20"></div>
                              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                            </div>
                          </div>
                        )}
                        
                        {template.layout === 'bento' && (
                          <div className="grid grid-cols-4 gap-1">
                            <div className="col-span-2 row-span-2 h-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            <div className="col-span-2 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                          </div>
                        )}
                        
                        {template.layout === 'grid' && (
                          <div className="grid grid-cols-3 gap-1">
                            {[...Array(6)].map((_, i) => (
                              <div key={i} className="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            ))}
                          </div>
                        )}
                        
                        {template.layout === 'columns' && (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                              <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
                              <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                            </div>
                            <div className="h-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                          </div>
                        )}

                        {template.layout === 'divider' && (
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                            <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                          </div>
                        )}

                        {template.layout === 'image' && (
                          <div className="space-y-2">
                            <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto"></div>
                          </div>
                        )}

                        {template.layout === 'code' && (
                          <div className="bg-gray-800 rounded p-2 space-y-1">
                            <div className="flex items-center space-x-1 mb-1">
                              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            </div>
                            <div className="h-1 bg-green-400 rounded w-1/3"></div>
                            <div className="h-1 bg-blue-400 rounded w-1/2"></div>
                            <div className="h-1 bg-green-400 rounded w-2/3"></div>
                          </div>
                        )}

                        {template.layout === 'gallery' && (
                          <div className="grid grid-cols-3 gap-1">
                            {[...Array(6)].map((_, i) => (
                              <div key={i} className="h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            ))}
                          </div>
                        )}

                        {template.layout === 'form' && (
                          <div className="space-y-2">
                            <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600"></div>
                            <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600"></div>
                            <div className="h-6 bg-blue-400 rounded w-1/2 mt-3"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Section
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SectionTypeModal;
