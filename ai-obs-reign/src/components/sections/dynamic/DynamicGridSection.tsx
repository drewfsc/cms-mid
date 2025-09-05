'use client';

import React from 'react';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { DynamicSection } from '@/lib/dynamic-sections';
import { SectionStylingUtils, useParallaxScroll } from '@/lib/section-styling';

interface GridItem {
  icon: string;
  title: string;
  description: string;
  link?: string;
}

interface DynamicGridSectionProps {
  section: DynamicSection;
  isEditMode?: boolean;
  onUpdate?: (fields: Record<string, any>) => void;
}

const DynamicGridSection: React.FC<DynamicGridSectionProps> = ({ section, isEditMode = false, onUpdate }) => {
  const { fields, styling } = section;
  const items = (fields.items as GridItem[]) || [];
  const columns = fields.columns || '3';
  
  // Provide fallback styling if not defined
  const fallbackStyling = {
    backgroundColor: 'gray-50',
    textColor: 'auto' as const,
    padding: 'large' as const
  };
  
  const sectionStyling = styling || fallbackStyling;
  const scrollY = useParallaxScroll(sectionStyling.enableParallax || false);
  const { containerStyle, containerClass, backgroundImageStyle } = SectionStylingUtils.getSectionStyles(sectionStyling);

  const handleFieldChange = (fieldName: string, value: any) => {
    if (onUpdate) {
      onUpdate({ ...fields, [fieldName]: value });
    }
  };

  const handleItemChange = (index: number, itemField: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [itemField]: value };
    handleFieldChange('items', newItems);
  };

  const addItem = () => {
    const newItem: GridItem = {
      icon: '📦',
      title: 'New Item',
      description: 'Item description'
    };
    handleFieldChange('items', [...items, newItem]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    handleFieldChange('items', newItems);
  };

  const getGridColumns = () => {
    switch (columns) {
      case '2':
        return 'md:grid-cols-2';
      case '4':
        return 'md:grid-cols-4';
      default:
        return 'md:grid-cols-3';
    }
  };

  return (
    <section 
      className={`relative ${containerClass}`}
      style={containerStyle}
    >
      {/* Background Image with Parallax */}
      {backgroundImageStyle && (
        <div
          className="absolute inset-0"
          style={{
            ...backgroundImageStyle,
            transform: sectionStyling.enableParallax 
              ? SectionStylingUtils.getParallaxTransform(scrollY, true)
              : undefined
          }}
        />
      )}
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {isEditMode ? (
              <input
                type="text"
                value={fields.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-blue-400"
                placeholder="Section title"
              />
            ) : (
              fields.title || 'Grid Section'
            )}
          </h2>

          {(fields.subtitle || isEditMode) && (
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              {isEditMode ? (
                <input
                  type="text"
                  value={fields.subtitle || ''}
                  onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-600 dark:text-gray-400 outline-none focus:border-blue-400"
                  placeholder="Section subtitle (optional)"
                />
              ) : (
                fields.subtitle
              )}
            </p>
          )}

          {(fields.description || isEditMode) && (
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {isEditMode ? (
                <textarea
                  value={fields.description || ''}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-600 dark:text-gray-300 outline-none focus:border-blue-400 min-h-[80px]"
                  placeholder="Section description (optional)"
                />
              ) : (
                fields.description
              )}
            </p>
          )}

          {isEditMode && (
            <div className="mt-4">
              <label className="text-sm text-gray-600 dark:text-gray-400 mr-2">Columns:</label>
              <select
                value={columns}
                onChange={(e) => handleFieldChange('columns', e.target.value)}
                className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm"
              >
                <option value="2">2 Columns</option>
                <option value="3">3 Columns</option>
                <option value="4">4 Columns</option>
              </select>
            </div>
          )}
        </div>

        {/* Grid */}
        <div className={`grid grid-cols-1 ${getGridColumns()} gap-8`}>
          {items.map((item, index) => (
            <div
              key={index}
              className="relative group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-neumorphic hover:shadow-neumorphic-hover transition-all duration-300 border-0"
            >
              {isEditMode && (
                <button
                  onClick={() => removeItem(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500/20 text-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* Icon */}
              <div className="text-4xl mb-4">
                {isEditMode ? (
                  <input
                    type="text"
                    value={item.icon}
                    onChange={(e) => handleItemChange(index, 'icon', e.target.value)}
                    className="w-20 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-center"
                    placeholder="Icon"
                  />
                ) : (
                  item.icon
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {isEditMode ? (
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                    placeholder="Item title"
                  />
                ) : (
                  item.title
                )}
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {isEditMode ? (
                  <textarea
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 min-h-[60px] resize-none"
                    placeholder="Item description"
                  />
                ) : (
                  item.description
                )}
              </p>

              {/* Link */}
              {(item.link || isEditMode) && (
                <div>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={item.link || ''}
                      onChange={(e) => handleItemChange(index, 'link', e.target.value)}
                      className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                      placeholder="Link URL (optional)"
                    />
                  ) : item.link ? (
                    <a
                      href={item.link}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      Learn More
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  ) : null}
                </div>
              )}
            </div>
          ))}

          {/* Add Item Button */}
          {isEditMode && (
            <button
              onClick={addItem}
              className="bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 shadow-neumorphic hover:shadow-neumorphic-hover rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-300 min-h-[200px] border-0"
            >
              <Plus className="w-8 h-8 text-gray-600 dark:text-gray-400 mb-2" />
              <span className="text-gray-600 dark:text-gray-400">Add Item</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default DynamicGridSection;
