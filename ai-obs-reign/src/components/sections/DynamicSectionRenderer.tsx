'use client';

import React from 'react';
import { DynamicSection } from '@/lib/dynamic-sections';

// Import dynamic section components
import DynamicHeroSection from './dynamic/DynamicHeroSection';
import DynamicBentoSection from './dynamic/DynamicBentoSection';
import DynamicGridSection from './dynamic/DynamicGridSection';
import DynamicColumnsSection from './dynamic/DynamicColumnsSection';

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
