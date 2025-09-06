/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';


import React from 'react';
import { ExternalLink } from 'lucide-react';
import { DynamicSection } from '@/lib/dynamic-sections';
import { SectionStylingUtils, useParallaxScroll } from '@/lib/section-styling';
import MediaSelector from '@/components/media/MediaSelector';

interface DynamicImageSectionProps {
  section: DynamicSection;
  isEditMode?: boolean;
  onUpdate?: (fields: Record<string, unknown>) => void;
}

const DynamicImageSection: React.FC<DynamicImageSectionProps> = ({ section, isEditMode = false, onUpdate }) => {
  const { fields, styling } = section;
  
  // Provide fallback styling if not defined
  const fallbackStyling = {
    backgroundColor: 'white',
    textColor: 'auto' as const,
    padding: 'medium' as const
  };
  
  const sectionStyling = styling || fallbackStyling;
  const scrollY = useParallaxScroll(sectionStyling.enableParallax || false);
  const { containerStyle, containerClass, backgroundImageStyle } = SectionStylingUtils.getSectionStyles(sectionStyling);

  const handleFieldChange = (fieldName: string, value: unknown) => {
    if (onUpdate) {
      onUpdate({ ...fields, [fieldName]: value });
    }
  };

  const getSizeClasses = () => {
    switch (fields.size) {
      case 'small':
        return 'max-w-md';
      case 'medium':
        return 'max-w-2xl';
      case 'large':
        return 'max-w-4xl';
      case 'full':
        return 'max-w-full';
      default:
        return 'max-w-4xl';
    }
  };

  const getAlignmentClass = () => {
    switch (fields.alignment) {
      case 'left':
        return 'mr-auto';
      case 'right':
        return 'ml-auto';
      default:
        return 'mx-auto';
    }
  };

  const renderImage = () => {
    const imageElement = (
      <div className={`${getSizeClasses()} ${getAlignmentClass()}`}>
        {typeof fields.image === 'string' && fields.image ? (
          <img
            src={typeof fields.image === 'string' ? fields.image : ''}
            alt={typeof fields.alt === 'string' ? fields.alt : 'Image'}
            className="w-full h-auto rounded-lg shadow-neumorphic"
          />
        ) : isEditMode ? (
          <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">No image selected</p>
          </div>
        ) : null}
        
        {(typeof fields.caption === 'string' && fields.caption) && (
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-3 italic">
            {isEditMode ? (
              <input
                type="text"
                value={typeof fields.caption === 'string' ? fields.caption : ''}
                onChange={(e) => handleFieldChange('caption', e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-center"
                placeholder="Image caption"
              />
            ) : (
              typeof fields.caption === 'string' ? fields.caption : ''
            )}
          </p>
        )}
      </div>
    );

    if (typeof fields.link === 'string' && fields.link && !isEditMode) {
      return (
        <a href={typeof fields.link === 'string' ? fields.link : '#'} className="group block">
          {imageElement}
          <div className="text-center mt-2">
            <span className="text-blue-600 dark:text-blue-400 text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300 inline-flex items-center">
              View Full Size
              <ExternalLink className="w-3 h-3 ml-1" />
            </span>
          </div>
        </a>
      );
    }

    return imageElement;
  };

  return (
    <section 
      id={section.id}
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
        {renderImage()}

        {/* Edit Mode Controls */}
        {isEditMode && (
          <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Image Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Image
                </label>
                <MediaSelector
                  onSelect={(file) => {
                    if (file) {
                      handleFieldChange('image', file.url);
                      handleFieldChange('alt', file.alt || file.name);
                    } else {
                      handleFieldChange('image', '');
                      handleFieldChange('alt', '');
                    }
                  }}
                  currentValue={typeof fields.image === 'string' ? fields.image : ''}
                  acceptedTypes={['image']}
                  className="mb-4"
                />
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Or enter image URL manually:
                </div>
                <input
                  type="text"
                  value={typeof fields.image === 'string' ? fields.image : ''}
                  onChange={(e) => handleFieldChange('image', e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white mt-2"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={typeof fields.alt === 'string' ? fields.alt : ''}
                  onChange={(e) => handleFieldChange('alt', e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white"
                  placeholder="Descriptive text for accessibility"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image Size
                </label>
                <select
                  value={typeof fields.size === 'string' ? fields.size : 'large'}
                  onChange={(e) => handleFieldChange('size', e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white"
                >
                  <option value="small">Small (max-width: 384px)</option>
                  <option value="medium">Medium (max-width: 672px)</option>
                  <option value="large">Large (max-width: 896px)</option>
                  <option value="full">Full Width</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alignment
                </label>
                <select
                  value={typeof fields.alignment === 'string' ? fields.alignment : 'center'}
                  onChange={(e) => handleFieldChange('alignment', e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Link URL (Optional)
                </label>
                <input
                  type="text"
                  value={typeof fields.link === 'string' ? fields.link : ''}
                  onChange={(e) => handleFieldChange('link', e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={typeof fields.caption === 'string' ? fields.caption : ''}
                  onChange={(e) => handleFieldChange('caption', e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white"
                  placeholder="Image caption"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DynamicImageSection;
