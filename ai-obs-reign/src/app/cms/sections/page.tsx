'use client';

import React, { useState, useEffect } from 'react';
import CMSHeader from '@/components/cms/CMSHeader';
import SectionTypeModal from '@/components/cms/SectionTypeModal';
import SectionStylingPanel from '@/components/cms/SectionStylingPanel';
import { CMSDataManager } from '@/lib/cms-data';
import { DynamicSection, createSection, SectionTemplate, SectionStyling, SECTION_TEMPLATES } from '@/lib/dynamic-sections';
import { 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  GripVertical,
  Copy,
  Menu,
  Layout,
  Grid3x3,
  LayoutGrid,
  Columns,
  Minus,
  Image,
  Code,
  Images,
  FileText
} from 'lucide-react';

// Import section components
import DynamicHeroSection from '@/components/sections/dynamic/DynamicHeroSection';
import DynamicBentoSection from '@/components/sections/dynamic/DynamicBentoSection';
import DynamicGridSection from '@/components/sections/dynamic/DynamicGridSection';
import DynamicColumnsSection from '@/components/sections/dynamic/DynamicColumnsSection';
import DynamicDividerSection from '@/components/sections/dynamic/DynamicDividerSection';
import DynamicImageSection from '@/components/sections/dynamic/DynamicImageSection';
import DynamicCodeSection from '@/components/sections/dynamic/DynamicCodeSection';
import DynamicGallerySection from '@/components/sections/dynamic/DynamicGallerySection';
import DynamicFormSection from '@/components/sections/dynamic/DynamicFormSection';

export default function CMSSections() {
  const [sections, setSections] = useState<DynamicSection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);
  const [draggedTemplate, setDraggedTemplate] = useState<{template: SectionTemplate, name: string} | null>(null);

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

  const handleTemplateDragStart = (template: SectionTemplate, name: string) => {
    setDraggedTemplate({ template, name });
  };

  const handleTemplateDragEnd = () => {
    setDraggedTemplate(null);
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

  const handleToggleNavigation = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      CMSDataManager.updateDynamicSection(sectionId, {
        includeInNavigation: !section.includeInNavigation
      });
      loadSections();
      setHasChanges(true);
    }
  };

  const handleUpdateNavigationLabel = (sectionId: string, label: string) => {
    CMSDataManager.updateDynamicSection(sectionId, {
      navigationLabel: label
    });
    loadSections();
    setHasChanges(true);
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
    e.stopPropagation();
    // Set appropriate drop effect based on what's being dragged
    e.dataTransfer.dropEffect = draggedTemplate ? 'copy' : 'move';
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
    e.stopPropagation();
    
    // Handle template drop
    if (draggedTemplate) {
      const newSection = createSection(draggedTemplate.template, draggedTemplate.name);
      
      // Find the target section index
      const targetIndex = sections.findIndex(s => s.id === targetSectionId);
      
      if (targetIndex !== -1) {
        // Insert at the target position
        const updatedSections = [...sections];
        updatedSections.splice(targetIndex, 0, newSection);
        
        // Update order values
        updatedSections.forEach((section, index) => {
          section.order = index;
        });
        
        CMSDataManager.saveDynamicSections(updatedSections);
        loadSections();
        setHasChanges(true);
        
        // Automatically enter edit mode for the new section
        setEditingSection(newSection.id);
        
        // Scroll to the new section
        setTimeout(() => {
          const element = document.querySelector(`[data-section-id="${newSection.id}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
      
      setDraggedTemplate(null);
      setDragOverSection(null);
      return;
    }
    
    // Handle section reordering
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
      case 'divider':
        return <DynamicDividerSection {...sectionProps} />;
      case 'image':
        return <DynamicImageSection {...sectionProps} />;
      case 'code':
        return <DynamicCodeSection {...sectionProps} />;
      case 'gallery':
        return <DynamicGallerySection {...sectionProps} />;
      case 'form':
        return <DynamicFormSection {...sectionProps} />;
      default:
        return <div>Unknown section type</div>;
    }
  };

  return (
    <div 
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      onDragOver={(e) => {
        // Allow drag over on the entire page to prevent default browser behavior
        if (draggedTemplate) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }
      }}
      onDragEnd={() => {
        // Clean up drag state when drag ends anywhere on the page
        setDraggedTemplate(null);
        setDraggedSection(null);
        setDragOverSection(null);
      }}
    >
      <CMSHeader title="Section Management" showBackButton={true} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            {/* <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Sections</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Drag section types from the sidebar or use the add button
            </p> */}
          </div>
          
          
        </div>

        {/* Main Content Layout - Split 50/50 */}
        <div className="grid  lg:grid-cols-3 gap-8">
          {/* Left Side - Section Types */}
          <div className="space-y-6 col-span-1">
            <div>
              <div className="flex justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Section Types</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                      Drag section types to add them to your page
                    </p>
                  </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg btn-neumorphic hover:from-blue-600 hover:to-blue-700 flex items-center space-x-2 border-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Section</span>
                  </button>
                  
                </div>
              </div>
              
       
              
              {/* Section Types Grid */}
              <div className="grid grid-cols-3 gap-4">
                {SECTION_TEMPLATES.map((template) => {
                  // Map template layout to icon component
                  const getIconComponent = (layout: string) => {
                    switch (layout) {
                      case 'hero': return Layout;
                      case 'bento': return Grid3x3;
                      case 'grid': return LayoutGrid;
                      case 'columns': return Columns;
                      case 'divider': return Minus;
                      case 'image': return Image;
                      case 'code': return Code;
                      case 'gallery': return Images;
                      case 'form': return FileText;
                      default: return Layout;
                    }
                  };

                  // Map template layout to color
                  const getColor = (layout: string) => {
                    switch (layout) {
                      case 'hero': return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
                      case 'bento': return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300';
                      case 'grid': return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
                      case 'columns': return 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300';
                      case 'divider': return 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300';
                      case 'image': return 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300';
                      case 'code': return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300';
                      case 'gallery': return 'bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300';
                      case 'form': return 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300';
                      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300';
                    }
                  };

                  const Icon = getIconComponent(template.layout);
                  const color = getColor(template.layout);

                  return (
                    <div
                      key={template.layout}
                      draggable
                      onDragStart={(e) => handleTemplateDragStart(template, template.name)}
                      onDragEnd={handleTemplateDragEnd}
                      className="w-[110px] h-[110px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-neumorphic hover:shadow-neumorphic-hover transition-all duration-300 cursor-grab active:cursor-grabbing border-0 group relative"
                      title={template.description}
                    >
                      <div className="h-full flex flex-col items-center justify-center p-2 text-center">
                        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs font-semibold text-gray-900 dark:text-white mt-1 leading-tight">
                          {template.name}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side - Active Sections */}
          <div className="space-y-6 col-span-2">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Active Sections</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Drag to reorder sections or click edit to modify
              </p>
            </div>

            {/* Section List */}
        <div className="space-y-4">
          {/* Top Drop Zone */}
          {draggedTemplate && (
            <div 
              className="h-12 border-2 border-dashed border-blue-400 dark:border-blue-500 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (draggedTemplate) {
                  const newSection = createSection(draggedTemplate.template, draggedTemplate.name);
                  const updatedSections = [newSection, ...sections];
                  
                  // Update order values
                  updatedSections.forEach((section, index) => {
                    section.order = index;
                  });
                  
                  CMSDataManager.saveDynamicSections(updatedSections);
                  loadSections();
                  setHasChanges(true);
                  
                  // Automatically enter edit mode for the new section
                  setEditingSection(newSection.id);
                  
                  setDraggedTemplate(null);
                }
              }}
            >
              <div className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                Drop here to add at the top
              </div>
            </div>
          )}
          
          {sections.map((section, index) => {
            const isDragging = draggedSection === section.id;
            const isDragOver = dragOverSection === section.id;
            const isEditing = editingSection === section.id;
            
            return (
              <React.Fragment key={section.id}>
                {/* Dedicated drop zone before each section */}
                {draggedTemplate && (
                  <div 
                    className="h-8 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center transition-all duration-200"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.dataTransfer.dropEffect = 'copy';
                    }}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      if (draggedTemplate) {
                        const newSection = createSection(draggedTemplate.template, draggedTemplate.name);
                        const updatedSections = [...sections];
                        updatedSections.splice(index, 0, newSection);
                        
                        // Update order values
                        updatedSections.forEach((section, idx) => {
                          section.order = idx;
                        });
                        
                        CMSDataManager.saveDynamicSections(updatedSections);
                        loadSections();
                        setHasChanges(true);
                        
                        // Automatically enter edit mode for the new section
                        setEditingSection(newSection.id);
                        
                        setDraggedTemplate(null);
                      }
                    }}
                  >
                    <div className="text-blue-600 dark:text-blue-400 font-medium text-xs">
                      Drop here to add section
                    </div>
                  </div>
                )}
                
                {/* Drop indicator - shows for section reordering */}
                {isDragOver && draggedSection && draggedSection !== section.id && (
                  <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-500 dark:to-blue-600 rounded-full mx-4 animate-pulse shadow-lg">
                    <div className="h-full bg-white/30 dark:bg-black/30 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-white drop-shadow-sm">
                        Drop to reorder
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Single Line Section */}
                <div
                  data-section-id={section.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, section.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, section.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, section.id)}
                  className={`bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-neumorphic border-0 transition-all duration-200 ${
                    isDragging 
                      ? 'opacity-50 scale-95 cursor-grabbing' 
                      : isDragOver 
                      ? 'shadow-neumorphic-hover transform -translate-y-1 border-l-4 border-blue-400' 
                      : 'hover:shadow-neumorphic-hover cursor-grab'
                  }`}
                >
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      {/* Left side - Drag handle and section info */}
                      <div className="flex items-center space-x-4 flex-1">
                        <button
                          className={`p-1 rounded transition-colors ${
                            isDragging ? 'bg-blue-100 dark:bg-blue-800' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          title="Drag to reorder"
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
                          <GripVertical className={`w-4 h-4 cursor-move ${
                            isDragging ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
                          }`} />
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              {section.name}
                            </h3>
                            <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                              {section.layout}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              #{index + 1}
                            </span>
                            {!section.isVisible && (
                              <span className="text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-2 py-1 rounded">
                                HIDDEN
                              </span>
                            )}
                            {section.includeInNavigation && (
                              <span className="text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                                NAV
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Right side - Edit button */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleVisibility(section.id);
                          }}
                          className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                          title={section.isVisible ? 'Hide section' : 'Show section'}
                        >
                          {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSection(
                              editingSection === section.id ? null : section.id
                            );
                          }}
                          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                            isEditing
                              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                          title={isEditing ? 'Close edit mode' : 'Edit section'}
                        >
                          {isEditing ? 'Done' : 'Edit'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit View - Expanded when editing */}
                {isEditing && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg shadow-neumorphic border-0 mt-2">
                    {/* Edit Header */}
                    <div className="px-4 py-3 border-b border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            Editing: {section.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleNavigation(section.id)}
                            className={`px-2 py-1 rounded text-xs transition-colors ${
                              section.includeInNavigation
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                            }`}
                            title={section.includeInNavigation ? 'Remove from navigation' : 'Include in navigation'}
                          >
                            <Menu className="w-3 h-3 mr-1 inline" />
                            {section.includeInNavigation ? 'In Nav' : 'Add to Nav'}
                          </button>
                          
                          <button
                            onClick={() => handleDuplicateSection(section.id)}
                            className="px-2 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-900/40"
                            title="Duplicate section"
                          >
                            <Copy className="w-3 h-3 mr-1 inline" />
                            Duplicate
                          </button>
                          
                          <button
                            onClick={() => handleDeleteSection(section.id)}
                            className="px-2 py-1 bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded text-xs hover:bg-red-200 dark:hover:bg-red-900/40"
                            title="Delete section"
                          >
                            <Trash2 className="w-3 h-3 mr-1 inline" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Label Input - Show when navigation is enabled */}
                    {section.includeInNavigation && (
                      <div className="px-4 py-3 border-b border-blue-200 dark:border-blue-800">
                        <div className="flex items-center space-x-4">
                          <Menu className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                              Navigation Label
                            </label>
                            <input
                              type="text"
                              value={section.navigationLabel || ''}
                              onChange={(e) => handleUpdateNavigationLabel(section.id, e.target.value)}
                              placeholder={section.name}
                              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-green-300 dark:border-green-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white"
                            />
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                              This label will appear in the header navigation. Leave empty to use section name.
                            </p>
                          </div>
                          <div className="text-sm text-green-600 dark:text-green-400">
                            <div className="bg-green-100 dark:bg-green-900/40 px-3 py-2 rounded-lg">
                              <div className="font-medium">Preview:</div>
                              <div className="text-xs mt-1">
                                "{section.navigationLabel || section.name}"
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Section Styling Panel */}
                    <div className="px-4 py-3 border-b border-blue-200 dark:border-blue-800">
                      <SectionStylingPanel
                        styling={section.styling}
                        onUpdate={(styling) => handleUpdateSectionStyling(section.id, styling)}
                        isOpen={true}
                        onToggle={() => {}} // Always open in edit mode
                      />
                    </div>

                    {/* Section Preview */}
                    <div className={`${section.isVisible ? '' : 'opacity-50'}`}>
                      <div className="border-4 border-blue-400 dark:border-blue-600">
                        {renderSectionPreview(section)}
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
          
          {/* Bottom Drop Zone */}
          {draggedTemplate && (
            <div 
              className="h-12 border-2 border-dashed border-blue-400 dark:border-blue-500 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (draggedTemplate) {
                  const newSection = createSection(draggedTemplate.template, draggedTemplate.name);
                  const updatedSections = [...sections, newSection];
                  
                  // Update order values
                  updatedSections.forEach((section, index) => {
                    section.order = index;
                  });
                  
                  CMSDataManager.saveDynamicSections(updatedSections);
                  loadSections();
                  setHasChanges(true);
                  
                  // Automatically enter edit mode for the new section
                  setEditingSection(newSection.id);
                  
                  setDraggedTemplate(null);
                }
              }}
            >
              <div className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                Drop here to add at the bottom
              </div>
            </div>
          )}
        </div>

            {/* Empty State */}
            {sections.length === 0 && (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-neumorphic border-0">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No dynamic sections yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Drag a section type from the sidebar or click the add button
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg btn-neumorphic hover:from-blue-600 hover:to-blue-700 inline-flex items-center space-x-2 border-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Section</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Drag Instructions */}
        {(draggedSection || draggedTemplate) && (
          <div className="fixed bottom-4 left-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-lg shadow-lg z-50">
            <p className="text-sm font-medium">
              {draggedTemplate 
                ? '🎯 Drop template between sections, at the top, or at the bottom to add new section' 
                : '🎯 Drop on another section to reorder'}
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
        onDragStart={handleTemplateDragStart}
      />
    </div>
  );
}
