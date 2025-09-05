'use client';

import React, { useState, useEffect } from 'react';
import CMSHeader from '@/components/cms/CMSHeader';
import SectionTypeModal from '@/components/cms/SectionTypeModal';
import SectionStylingPanel from '@/components/cms/SectionStylingPanel';
import { CMSDataManager } from '@/lib/cms-data';
import { DynamicSection, createSection, SectionTemplate, SectionStyling } from '@/lib/dynamic-sections';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  GripVertical,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Copy
} from 'lucide-react';

// Import section components
import DynamicHeroSection from '@/components/sections/dynamic/DynamicHeroSection';
import DynamicBentoSection from '@/components/sections/dynamic/DynamicBentoSection';
import DynamicGridSection from '@/components/sections/dynamic/DynamicGridSection';
import DynamicColumnsSection from '@/components/sections/dynamic/DynamicColumnsSection';

export default function CMSSections() {
  const [sections, setSections] = useState<DynamicSection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [stylingPanelOpen, setStylingPanelOpen] = useState<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = useState(false);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = () => {
    const dynamicSections = CMSDataManager.getDynamicSections();
    setSections(dynamicSections);
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
    const section = sections.find(s => s.id === sectionId);
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

  const handleUpdateSectionStyling = (sectionId: string, styling: SectionStyling) => {
    CMSDataManager.updateDynamicSection(sectionId, { styling });
    loadSections();
    setHasChanges(true);
  };

  const toggleStylingPanel = (sectionId: string) => {
    setStylingPanelOpen(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleDuplicateSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      // Create a copy with new ID and updated name
      const duplicatedSection: DynamicSection = {
        ...section,
        id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `${section.name} (Copy)`,
        order: section.order + 0.5, // Insert right after the original
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      CMSDataManager.addDynamicSection(duplicatedSection);
      loadSections();
      setHasChanges(true);
      
      // Automatically open the duplicated section in edit mode
      setEditingSection(duplicatedSection.id);
      
      // Scroll to the new section
      setTimeout(() => {
        const element = document.querySelector(`[data-section-id="${duplicatedSection.id}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const toggleSectionCollapse = (sectionId: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedSection(sectionId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', sectionId);
    
    // Add some visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedSection(null);
    setDragOverSection(null);
    
    // Reset visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSection(sectionId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're actually leaving the element (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverSection(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();
    
    if (!draggedSection || draggedSection === targetSectionId) {
      return;
    }

    // Find the indices of the dragged and target sections
    const draggedIndex = sections.findIndex(s => s.id === draggedSection);
    const targetIndex = sections.findIndex(s => s.id === targetSectionId);

    if (draggedIndex === -1 || targetIndex === -1) {
      return;
    }

    // Reorder the sections
    const reorderedSections = [...sections];
    const [draggedSectionData] = reorderedSections.splice(draggedIndex, 1);
    reorderedSections.splice(targetIndex, 0, draggedSectionData);

    // Update order values
    reorderedSections.forEach((section, index) => {
      section.order = index;
    });

    // Save the reordered sections
    CMSDataManager.saveDynamicSections(reorderedSections);
    loadSections();
    setHasChanges(true);

    // Reset drag state
    setDraggedSection(null);
    setDragOverSection(null);
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
          
          <div className="flex items-center space-x-3">
            {sections.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCollapsedSections(new Set())}
                  className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded"
                >
                  Expand All
                </button>
                <button
                  onClick={() => setCollapsedSections(new Set(sections.map(s => s.id)))}
                  className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded"
                >
                  Collapse All
                </button>
              </div>
            )}
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Section</span>
            </button>
          </div>
        </div>

        {/* Section List */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const isCollapsed = collapsedSections.has(section.id);
            const isDragging = draggedSection === section.id;
            const isDragOver = dragOverSection === section.id;
            
            return (
              <React.Fragment key={section.id}>
                {/* Drop indicator */}
                {isDragOver && draggedSection && draggedSection !== section.id && (
                  <div className="h-2 bg-blue-400 dark:bg-blue-500 rounded-full mx-4 animate-pulse" />
                )}
                
                <div
                  data-section-id={section.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, section.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, section.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, section.id)}
                  className={`bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg transition-all duration-200 ${
                    isDragging 
                      ? 'opacity-50 scale-95 shadow-neumorphic-hover cursor-grabbing' 
                      : isDragOver 
                      ? 'shadow-neumorphic-hover transform -translate-y-1' 
                      : 'shadow-neumorphic hover:shadow-neumorphic-hover cursor-grab'
                  } border-0`}
                >
                {/* Section Header */}
                <div 
                  className="px-6 py-4 border-b border-gray-200 dark:border-gray-700"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        className={`p-1 rounded transition-colors ${
                          isDragging ? 'bg-blue-100 dark:bg-blue-800' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        title="Drag to reorder (or use keyboard: Arrow keys + Ctrl)"
                        onKeyDown={(e) => {
                          if (e.ctrlKey) {
                            const currentIndex = sections.findIndex(s => s.id === section.id);
                            if (e.key === 'ArrowUp' && currentIndex > 0) {
                              e.preventDefault();
                              const reorderedSections = [...sections];
                              [reorderedSections[currentIndex], reorderedSections[currentIndex - 1]] = 
                                [reorderedSections[currentIndex - 1], reorderedSections[currentIndex]];
                              
                              reorderedSections.forEach((s, i) => s.order = i);
                              CMSDataManager.saveDynamicSections(reorderedSections);
                              loadSections();
                              setHasChanges(true);
                            } else if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
                              e.preventDefault();
                              const reorderedSections = [...sections];
                              [reorderedSections[currentIndex], reorderedSections[currentIndex + 1]] = 
                                [reorderedSections[currentIndex + 1], reorderedSections[currentIndex]];
                              
                              reorderedSections.forEach((s, i) => s.order = i);
                              CMSDataManager.saveDynamicSections(reorderedSections);
                              loadSections();
                              setHasChanges(true);
                            }
                          }
                        }}
                        tabIndex={0}
                      >
                        <GripVertical className={`w-5 h-5 cursor-move ${
                          isDragging ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
                        }`} />
                      </button>
                      
                      {/* Collapse/Expand Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSectionCollapse(section.id);
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        title={isCollapsed ? 'Expand section' : 'Collapse section'}
                        style={{ cursor: 'pointer' }}
                      >
                        {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </button>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {section.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {section.layout} Layout • Order: {section.order}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2" onMouseDown={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleVisibility(section.id);
                        }}
                        className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        title={section.isVisible ? 'Hide section' : 'Show section'}
                        style={{ cursor: 'pointer' }}
                      >
                        {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateSection(section.id);
                        }}
                        className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="Duplicate section"
                        style={{ cursor: 'pointer' }}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSection(
                            editingSection === section.id ? null : section.id
                          );
                        }}
                        className={`p-2 rounded transition-colors ${
                          editingSection === section.id
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                            : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        title="Edit section"
                        style={{ cursor: 'pointer' }}
                      >
                        {editingSection === section.id ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSection(section.id);
                        }}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete section"
                        style={{ cursor: 'pointer' }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section Preview - Only show if not collapsed */}
                {!isCollapsed && (
                  <div className={`${section.isVisible ? '' : 'opacity-50'}`}>
                    {editingSection === section.id && (
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
                      editingSection === section.id 
                        ? 'border-blue-400 dark:border-blue-600' 
                        : 'border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                    }`}>
                      {renderSectionPreview(section)}
                    </div>
                  </div>
                )}

                {/* Collapsed State Info */}
                {isCollapsed && (
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span>Section collapsed</span>
                        <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                          {section.layout.toUpperCase()}
                        </span>
                        {!section.isVisible && (
                          <span className="text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-2 py-1 rounded">
                            HIDDEN
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <span>Created: {new Date(section.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Updated: {new Date(section.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section Styling Panel */}
                <SectionStylingPanel
                  styling={section.styling}
                  onUpdate={(styling) => handleUpdateSectionStyling(section.id, styling)}
                  isOpen={stylingPanelOpen.has(section.id)}
                  onToggle={() => toggleStylingPanel(section.id)}
                />
              </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Empty State */}
        {sections.length === 0 && (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-neumorphic border-0">
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

        {/* Drag Instructions */}
        {draggedSection && (
          <div className="fixed bottom-4 left-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-lg shadow-lg z-50">
            <p className="text-sm font-medium">
              🎯 Drop on another section to reorder
            </p>
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
