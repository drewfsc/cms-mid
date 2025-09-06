/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import React from 'react';
import { CheckCircle, Plus, Trash2 } from 'lucide-react';
import { DynamicSection } from '@/lib/dynamic-sections';
import { SectionStylingUtils, useParallaxScroll } from '@/lib/section-styling';

interface DynamicColumnsSectionProps {
  section: DynamicSection;
  isEditMode?: boolean;
  onUpdate?: (fields: Record<string, unknown>) => void;
}

const DynamicColumnsSection: React.FC<DynamicColumnsSectionProps> = ({ section, isEditMode = false, onUpdate }) => {
  const { fields, styling } = section;
  const features = (fields.features as string[]) || [];
  const layoutDirection = fields.layout || 'text-left';
  
  // Provide fallback styling if not defined
  const fallbackStyling = {
    backgroundColor: 'white',
    textColor: 'auto' as const,
    padding: 'large' as const
  };
  
  const sectionStyling = styling || fallbackStyling;
  
  // Get section styles from SectionStylingUtils
  const { containerStyle, containerClass, backgroundImageStyle } = SectionStylingUtils.getSectionStyles(sectionStyling);
  
  // Handle parallax scrolling if enabled
  const parallaxTransform = useParallaxScroll(sectionStyling.enableParallax || false);

  const handleFieldChange = (fieldName: string, value: unknown) => {
    if (onUpdate) {
      onUpdate({ ...fields, [fieldName]: value });
    }
  };

  const addFeature = () => {
    handleFieldChange('features', [...features, 'New feature']);
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    handleFieldChange('features', newFeatures);
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    handleFieldChange('features', newFeatures);
  };

  const textContent = (
    <div className="space-y-6">
      <h2 className={`text-3xl md:text-4xl font-bold ${SectionStylingUtils.getHeadingColorClasses(sectionStyling)}`}>
        {isEditMode ? (
          <input
            type="text"
            value={fields.title || ''}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-blue-400"
            placeholder="Section title"
          />
        ) : (
          fields.title || 'Section Title'
        )}
      </h2>

      {(fields.subtitle || isEditMode) && (
        <h3 className={`text-xl ${SectionStylingUtils.getSubheadingColorClasses(sectionStyling)}`}>
          {isEditMode ? (
            <input
              type="text"
              value={fields.subtitle || ''}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-blue-600 dark:text-blue-400 outline-none focus:border-blue-400"
              placeholder="Section subtitle (optional)"
            />
          ) : (
            fields.subtitle
          )}
        </h3>
      )}

      <div className={`prose prose-lg dark:prose-invert max-w-none ${SectionStylingUtils.getBodyTextColorClasses(sectionStyling)}`}>
        {isEditMode ? (
          <textarea
            value={fields.content || ''}
            onChange={(e) => handleFieldChange('content', e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-blue-400 min-h-[200px]"
            placeholder="Main content (supports markdown)"
          />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: fields.content || '<p>Add your content here</p>' }} />
        )}
      </div>

      {/* Features List */}
      {(features.length > 0 || isEditMode) && (
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3 group">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              {isEditMode ? (
                <>
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-900 dark:text-white outline-none focus:border-blue-400"
                    placeholder="Feature text"
                  />
                  <button
                    onClick={() => removeFeature(index)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-600 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <span className={SectionStylingUtils.getBodyTextColorClasses(sectionStyling)}>{feature}</span>
              )}
            </div>
          ))}
          
          {isEditMode && (
            <button
              onClick={addFeature}
              className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Feature</span>
            </button>
          )}
        </div>
      )}

      {/* CTA Button */}
      {(fields.ctaText || isEditMode) && (
        <div className="pt-4">
          <a
            href={fields.ctaLink || '#'}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            {isEditMode ? (
              <input
                type="text"
                value={fields.ctaText || ''}
                onChange={(e) => handleFieldChange('ctaText', e.target.value)}
                className="bg-transparent outline-none"
                placeholder="Button text"
                onClick={(e) => e.preventDefault()}
              />
            ) : (
              fields.ctaText || 'Learn More'
            )}
          </a>
          
          {isEditMode && (
            <input
              type="text"
              value={fields.ctaLink || ''}
              onChange={(e) => handleFieldChange('ctaLink', e.target.value)}
              className="ml-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
              placeholder="Button link"
            />
          )}
        </div>
      )}
    </div>
  );

  const imageContent = (
    <div className="relative">
      {fields.image ? (
        <img
          src={fields.image}
          alt={fields.imageAlt || 'Featured image'}
          className="w-full h-full object-cover rounded-2xl shadow-xl"
        />
      ) : (
        <div className="w-full h-full min-h-[400px] bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
          {isEditMode ? (
            <div className="text-center">
              <input
                type="text"
                value={fields.image || ''}
                onChange={(e) => handleFieldChange('image', e.target.value)}
                className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm mb-2"
                placeholder="Image URL"
              />
              <p className="text-gray-500 dark:text-gray-400 text-sm">Enter image URL</p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No image</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <section 
      id={section.id} 
      className={containerClass}
      style={containerStyle}
    >
      {/* Background Image with Parallax */}
      {sectionStyling.backgroundImage && (
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            ...backgroundImageStyle,
            transform: parallaxTransform
          }}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {isEditMode && (
          <div className="mb-6 flex items-center justify-center">
            <label className="text-sm text-gray-600 dark:text-gray-400 mr-2">Layout:</label>
            <select
              value={layoutDirection}
              onChange={(e) => handleFieldChange('layout', e.target.value)}
              className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm"
            >
              <option value="text-left">Text Left, Image Right</option>
              <option value="text-right">Image Left, Text Right</option>
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {layoutDirection === 'text-left' ? (
            <>
              {textContent}
              {imageContent}
            </>
          ) : (
            <>
              {imageContent}
              {textContent}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default DynamicColumnsSection;
