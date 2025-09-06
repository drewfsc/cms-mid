'use client';

import React from 'react';
import { DynamicSection } from '@/lib/dynamic-sections';

// Import dynamic section components
import DynamicHeroSection from './dynamic/DynamicHeroSection';
import DynamicBentoSection from './dynamic/DynamicBentoSection';
import DynamicGridSection from './dynamic/DynamicGridSection';
import DynamicColumnsSection from './dynamic/DynamicColumnsSection';
import DynamicDividerSection from './dynamic/DynamicDividerSection';
import DynamicImageSection from './dynamic/DynamicImageSection';
import DynamicCodeSection from './dynamic/DynamicCodeSection';
import DynamicGallerySection from './dynamic/DynamicGallerySection';
import DynamicFormSection from './dynamic/DynamicFormSection';
import DynamicSocialFeedSection from './dynamic/DynamicSocialFeedSection';
import DynamicChartsSection from './dynamic/DynamicChartsSection';
import DynamicVideoSection from './dynamic/DynamicVideoSection';

interface DynamicSectionRendererProps {
  sections: DynamicSection[];
}

const DynamicSectionRenderer: React.FC<DynamicSectionRendererProps> = ({ sections }) => {
  const renderDynamicSection = (section: DynamicSection) => {
    // Skip if section is not visible
    if (!section.isVisible) return null;

    const sectionProps = {
      section,
      isEditMode: false,
      onUpdate: undefined
    };

    switch (section.layout) {
      case 'hero':
        return <DynamicHeroSection key={section.id} {...sectionProps} />;
      case 'bento':
        return <DynamicBentoSection key={section.id} {...sectionProps} />;
      case 'grid':
        return <DynamicGridSection key={section.id} {...sectionProps} />;
      case 'columns':
        return <DynamicColumnsSection key={section.id} {...sectionProps} />;
      case 'divider':
        return <DynamicDividerSection key={section.id} {...sectionProps} />;
      case 'image':
        return <DynamicImageSection key={section.id} {...sectionProps} />;
      case 'code':
        return <DynamicCodeSection key={section.id} {...sectionProps} />;
      case 'gallery':
        return <DynamicGallerySection key={section.id} {...sectionProps} />;
      case 'form':
        return <DynamicFormSection key={section.id} {...sectionProps} />;
      case 'social-feed':
        return <DynamicSocialFeedSection key={section.id} {...sectionProps} />;
      case 'charts':
        return <DynamicChartsSection key={section.id} {...sectionProps} />;
      case 'video':
        return <DynamicVideoSection key={section.id} {...sectionProps} />;
      default:
        return null;
    }
  };

  return (
    <>
      {sections.map((section) => renderDynamicSection(section))}
    </>
  );
};

export default DynamicSectionRenderer;
