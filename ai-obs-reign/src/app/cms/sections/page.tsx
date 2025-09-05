'use client';

import React, { useState, useEffect } from 'react';
import CMSHeader from '@/components/cms/CMSHeader';
import SectionTypeModal from '@/components/cms/SectionTypeModal';
import { CMSDataManager } from '@/lib/cms-data';
import { DynamicSection, createSection, SectionTemplate } from '@/lib/dynamic-sections';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  GripVertical,
  Save,
  X
} from 'lucide-react';

// Import section components
import DynamicHeroSection from '@/components/sections/dynamic/DynamicHeroSection';
import DynamicBentoSection from '@/components/sections/dynamic/DynamicBentoSection';
import DynamicGridSection from '@/components/sections/dynamic/DynamicGridSection';
import DynamicColumnsSection from '@/components/sections/dynamic/DynamicColumnsSection';

export default function CMSSections() {
  const [sections, setSections] = useState<Array<{type: 'fixed' | 'dynamic', data: any}>>([]);
  const [dynamicSections, setDynamicSections] = useState<DynamicSection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = () => {
    const allSections = CMSDataManager.getAllSections();
    setSections(allSections);
    
    const dynamicOnly = allSections
      .filter(s => s.type === 'dynamic')
      .map(s => s.data as DynamicSection);
    setDynamicSections(dynamicOnly);
  };

  const handleAddSection = (template: SectionTemplate, name: string) => {
    const newSection = createSection(template, name);
    CMSDataManager.addDynamicSection(newSection);
    loadSections();
    setHasChanges(true);
    // Automatically open the new section in edit mode
    setEditingSection(newSection.id);
    // Scroll to the new section after a short delay
    setTimeout(() => {
      const element = document.querySelector(`[data-section-id="${newSection.id}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleDeleteSection = (sectionId: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      CMSDataManager.deleteDynamicSection(sectionId);
      loadSections();
      setHasChanges(true);
    }
  };

  const handleToggleVisibility = (sectionId: string) => {
    const section = dynamicSections.find(s => s.id === sectionId);
    if (section) {
      CMSDataManager.updateDynamicSection(sectionId, {
        isVisible: !section.isVisible
      });
      loadSections();
      setHasChanges(true);
    }
  };

  const handleUpdateSection = (sectionId: string, fields: Record<string, any>) => {
    CMSDataManager.updateDynamicSection(sectionId, { fields });
    loadSections();
    setHasChanges(true);
  };

  const handleReorderSections = (fromIndex: number, toIndex: number) => {
    // This is a simplified reorder - in production you'd want drag-and-drop
    const dynamicOnly = sections.filter(s => s.type === 'dynamic');
    const reorderedIds = dynamicOnly.map(s => s.data.id);
    
    // Swap positions
    const temp = reorderedIds[fromIndex];
    reorderedIds[fromIndex] = reorderedIds[toIndex];
    reorderedIds[toIndex] = temp;
    
    CMSDataManager.reorderDynamicSections(reorderedIds);
    loadSections();
    setHasChanges(true);
  };

  const renderSectionPreview = (section: DynamicSection) => {
    const isEditing = editingSection === section.id;
    
    const sectionProps = {
      section,
      isEditMode: isEditing,
      onUpdate: (fields: Record<string, any>) => handleUpdateSection(section.id, fields)
    };

    switch (section.layout) {
      case 'hero':
        return <DynamicHeroSection {...sectionProps} />;
      case 'bento':
        return <DynamicBentoSection {...sectionProps} />;
      case 'grid':
        return <DynamicGridSection {...sectionProps} />;
      case 'columns':
        return <DynamicColumnsSection {...sectionProps} />;
      default:
        return <div>Unknown section type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CMSHeader title="Section Management" showBackButton={true} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Sections</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Add, edit, and organize page sections
            </p>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Section</span>
          </button>
        </div>

        {/* Section List */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const isFixed = section.type === 'fixed';
            const sectionData = section.data;
            const isDynamic = !isFixed;
            
            return (
              <div
                key={isFixed ? sectionData.sectionType : sectionData.id}
                data-section-id={isDynamic ? sectionData.id : undefined}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              >
                {/* Section Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {isDynamic && (
                        <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                      )}
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {isFixed ? sectionData.title?.main || sectionData.sectionType : sectionData.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {isFixed ? 'Fixed Section' : `${sectionData.layout} Layout`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isDynamic && (
                        <>
                          <button
                            onClick={() => handleToggleVisibility(sectionData.id)}
                            className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                            title={sectionData.isVisible ? 'Hide section' : 'Show section'}
                          >
                            {sectionData.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          
                          <button
                            onClick={() => setEditingSection(
                              editingSection === sectionData.id ? null : sectionData.id
                            )}
                            className={`p-2 rounded ${
                              editingSection === sectionData.id
                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                                : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                            title="Edit section"
                          >
                            {editingSection === sectionData.id ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteSection(sectionData.id)}
                            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete section"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      {isFixed && (
                        <a
                          href={`/cms/content#${sectionData.sectionType}`}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          Edit in Content Manager
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section Preview */}
                {isDynamic && (
                  <div className={`${sectionData.isVisible ? '' : 'opacity-50'}`}>
                    {editingSection === sectionData.id && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800 px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            Editing Mode - Make your changes below
                          </span>
                        </div>
                        <button
                          onClick={() => setEditingSection(null)}
                          className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Done Editing
                        </button>
                      </div>
                    )}
                    <div className={`border-4 transition-colors ${
                      editingSection === sectionData.id 
                        ? 'border-blue-400 dark:border-blue-600' 
                        : 'border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                    }`}>
                      {renderSectionPreview(sectionData)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {dynamicSections.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No dynamic sections yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create your first dynamic section to extend your page
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Section</span>
            </button>
          </div>
        )}

        {/* Notice about changes */}
        {hasChanges && (
          <div className="fixed bottom-4 right-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-lg shadow-lg">
            <p className="text-sm">
              Changes are auto-saved. Visit the homepage to see your updates.
            </p>
          </div>
        )}
      </main>

      {/* Section Type Modal */}
      <SectionTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleAddSection}
      />
    </div>
  );
}
