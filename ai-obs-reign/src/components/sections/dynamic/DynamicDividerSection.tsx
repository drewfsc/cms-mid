/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import React from 'react';
import { DynamicSection } from '@/lib/dynamic-sections';
import { SectionStylingUtils, useParallaxScroll } from '@/lib/section-styling';

interface DynamicDividerSectionProps {
  section: DynamicSection;
  isEditMode?: boolean;
  onUpdate?: (fields: Record<string, unknown>) => void;
}

const DynamicDividerSection: React.FC<DynamicDividerSectionProps> = ({ section, isEditMode = false, onUpdate }) => {
  const { fields, styling } = section;
  
  // Provide fallback styling if not defined
  const fallbackStyling = {
    backgroundColor: 'white',
    textColor: 'auto' as const,
    padding: 'small' as const
  };
  
  const sectionStyling = styling || fallbackStyling;
  const scrollY = useParallaxScroll(sectionStyling.enableParallax || false);
  const { containerStyle, containerClass, backgroundImageStyle } = SectionStylingUtils.getSectionStyles(sectionStyling);

  const handleFieldChange = (fieldName: string, value: unknown) => {
    if (onUpdate) {
      onUpdate({ ...fields, [fieldName]: value });
    }
  };

  const getAlignmentClass = () => {
    switch (fields.alignment) {
      case 'left':
        return 'text-left';
      case 'right':
        return 'text-right';
      default:
        return 'text-center';
    }
  };

  const getLineStyleClass = () => {
    switch (fields.lineStyle) {
      case 'dashed':
        return 'border-dashed';
      case 'dotted':
        return 'border-dotted';
      default:
        return 'border-solid';
    }
  };

  const getTextSizeClass = () => {
    switch (fields.textSize) {
      case 'xs':
        return 'text-xs';
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      case 'xl':
        return 'text-xl';
      case '2xl':
        return 'text-2xl';
      default:
        return 'text-base';
    }
  };

  const getTextWeightClass = () => {
    switch (fields.textWeight) {
      case 'light':
        return 'font-light';
      case 'normal':
        return 'font-normal';
      case 'semibold':
        return 'font-semibold';
      case 'bold':
        return 'font-bold';
      case 'extrabold':
        return 'font-extrabold';
      default:
        return 'font-medium';
    }
  };

  const getTextColorClass = () => {
    switch (fields.textColor) {
      case 'gray':
        return 'text-gray-600 dark:text-gray-400';
      case 'blue':
        return 'text-blue-600 dark:text-blue-400';
      case 'green':
        return 'text-green-600 dark:text-green-400';
      case 'red':
        return 'text-red-600 dark:text-red-400';
      case 'purple':
        return 'text-purple-600 dark:text-purple-400';
      case 'yellow':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'white':
        return 'text-white';
      case 'black':
        return 'text-black dark:text-white';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTextColorStyle = () => {
    switch (fields.textColor) {
      case 'gray':
        return { color: '#4B5563' }; // gray-600
      case 'blue':
        return { color: '#2563EB' }; // blue-600
      case 'green':
        return { color: '#059669' }; // green-600
      case 'red':
        return { color: '#DC2626' }; // red-600
      case 'purple':
        return { color: '#7C3AED' }; // purple-600
      case 'yellow':
        return { color: '#D97706' }; // yellow-600
      case 'white':
        return { color: '#FFFFFF' }; // white
      case 'black':
        return { color: '#000000' }; // black
      default:
        return { color: '#4B5563' }; // gray-600
    }
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
        <div className={`flex items-center ${getAlignmentClass()}`}>
          {/* Left Line */}
          {fields.showLine && fields.alignment !== 'left' && (
            <div className={`flex-1 border-t border-gray-300 dark:border-gray-600 ${getLineStyleClass()}`}></div>
          )}
          
          {/* Text Content */}
          {(fields.text || isEditMode) && (
            <div className="px-6">
              {isEditMode ? (
                <input
                  type="text"
                  value={fields.text || ''}
                  onChange={(e) => handleFieldChange('text', e.target.value)}
                  className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-blue-400"
                  placeholder="Divider text (optional)"
                />
              ) : (
                <span 
                  className={`${getTextSizeClass()} ${getTextWeightClass()} whitespace-nowrap`}
                  style={getTextColorStyle()}
                >
                  {fields.text}
                </span>
              )}
            </div>
          )}
          
          {/* Right Line */}
          {fields.showLine && fields.alignment !== 'right' && (
            <div className={`flex-1 border-t border-gray-300 dark:border-gray-600 ${getLineStyleClass()}`}></div>
          )}
        </div>

        {/* Edit Mode Controls */}
        {isEditMode && (
          <div className="mt-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-6">
            {/* Basic Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Text Alignment
                </label>
                <select
                  value={fields.alignment || 'center'}
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
                  Line Style
                </label>
                <select
                  value={fields.lineStyle || 'solid'}
                  onChange={(e) => handleFieldChange('lineStyle', e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white"
                  disabled={!fields.showLine}
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={fields.showLine !== false}
                    onChange={(e) => handleFieldChange('showLine', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show Divider Line
                  </span>
                </label>
              </div>
            </div>

            {/* Text Styling Controls */}
            <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Text Styling</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Text Size
                  </label>
                  <select
                    value={fields.textSize || 'base'}
                    onChange={(e) => handleFieldChange('textSize', e.target.value)}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white"
                  >
                    <option value="xs">Extra Small</option>
                    <option value="sm">Small</option>
                    <option value="base">Base</option>
                    <option value="lg">Large</option>
                    <option value="xl">Extra Large</option>
                    <option value="2xl">2X Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Weight
                  </label>
                  <select
                    value={fields.textWeight || 'medium'}
                    onChange={(e) => handleFieldChange('textWeight', e.target.value)}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white"
                  >
                    <option value="light">Light</option>
                    <option value="normal">Normal</option>
                    <option value="medium">Medium</option>
                    <option value="semibold">Semibold</option>
                    <option value="bold">Bold</option>
                    <option value="extrabold">Extra Bold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Text Color
                  </label>
                  <select
                    value={fields.textColor || 'gray'}
                    onChange={(e) => handleFieldChange('textColor', e.target.value)}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white"
                  >
                    <option value="gray">Gray</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="red">Red</option>
                    <option value="purple">Purple</option>
                    <option value="yellow">Yellow</option>
                    <option value="white">White</option>
                    <option value="black">Black</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DynamicDividerSection;
