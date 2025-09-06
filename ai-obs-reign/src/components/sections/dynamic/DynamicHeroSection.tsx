'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { DynamicSection } from '@/lib/dynamic-sections';
import { SectionStylingUtils, useParallaxScroll } from '@/lib/section-styling';

interface DynamicHeroSectionProps {
  section: DynamicSection;
  isEditMode?: boolean;
  onUpdate?: (fields: Record<string, any>) => void;
}

const DynamicHeroSection: React.FC<DynamicHeroSectionProps> = ({ section, isEditMode = false, onUpdate }) => {
  const { fields, styling } = section;
  
  // Provide fallback styling if not defined
  const fallbackStyling = {
    backgroundColor: 'gradient-dark',
    backgroundImage: '/bg.jpg',
    imageOpacity: 40,
    enableParallax: true,
    textColor: 'light' as const,
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
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          {fields.badge && (
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 text-blue-300 rounded-full text-sm font-medium mb-6">
              {isEditMode ? (
                <input
                  type="text"
                  value={fields.badge}
                  onChange={(e) => handleFieldChange('badge', e.target.value)}
                  className="bg-transparent border-b border-blue-400 outline-none"
                  placeholder="Badge text"
                />
              ) : (
                fields.badge
              )}
            </div>
          )}

          {/* Title */}
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${SectionStylingUtils.getHeadingColorClasses(sectionStyling)}`}>
            {isEditMode ? (
              <input
                type="text"
                value={fields.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-blue-400"
                placeholder="Main title"
              />
            ) : (
              fields.title || 'Add Title'
            )}
          </h1>

          {/* Subtitle */}
          {(fields.subtitle || isEditMode) && (
            <h2 className={`text-xl md:text-2xl mb-6 ${SectionStylingUtils.getSubheadingColorClasses(sectionStyling)}`}>
              {isEditMode ? (
                <input
                  type="text"
                  value={fields.subtitle || ''}
                  onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-blue-400 outline-none focus:border-blue-400"
                  placeholder="Subtitle (optional)"
                />
              ) : (
                fields.subtitle
              )}
            </h2>
          )}

          {/* Description */}
          <div className={`text-lg mb-10 max-w-3xl mx-auto ${SectionStylingUtils.getBodyTextColorClasses(sectionStyling)}`}>
            {isEditMode ? (
              <textarea
                value={fields.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-gray-300 outline-none focus:border-blue-400 min-h-[120px]"
                placeholder="Description"
              />
            ) : (
              fields.description || 'Add description'
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {(fields.primaryCta || isEditMode) && (
              <a
                href={fields.primaryCtaLink || '#'}
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors group"
              >
                {isEditMode ? (
                  <input
                    type="text"
                    value={fields.primaryCta || ''}
                    onChange={(e) => handleFieldChange('primaryCta', e.target.value)}
                    className="bg-transparent outline-none"
                    placeholder="Primary CTA"
                    onClick={(e) => e.preventDefault()}
                  />
                ) : (
                  fields.primaryCta || 'Primary Action'
                )}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            )}

            {(fields.secondaryCta || isEditMode) && (
              <a
                href={fields.secondaryCtaLink || '#'}
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/20 transition-colors"
              >
                {isEditMode ? (
                  <input
                    type="text"
                    value={fields.secondaryCta || ''}
                    onChange={(e) => handleFieldChange('secondaryCta', e.target.value)}
                    className="bg-transparent outline-none"
                    placeholder="Secondary CTA"
                    onClick={(e) => e.preventDefault()}
                  />
                ) : (
                  fields.secondaryCta || 'Secondary Action'
                )}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DynamicHeroSection;
