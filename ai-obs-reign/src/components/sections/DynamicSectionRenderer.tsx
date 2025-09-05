'use client';

import React from 'react';
import { DynamicSection } from '@/lib/dynamic-sections';

// Import fixed section components
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import SolutionsSection from './SolutionsSection';
import ContentSection from './ContentSection';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';

// Import dynamic section components
import DynamicHeroSection from './dynamic/DynamicHeroSection';
import DynamicBentoSection from './dynamic/DynamicBentoSection';
import DynamicGridSection from './dynamic/DynamicGridSection';
import DynamicColumnsSection from './dynamic/DynamicColumnsSection';

interface SectionData {
  type: 'fixed' | 'dynamic';
  data: any;
}

interface DynamicSectionRendererProps {
  sections: SectionData[];
}

const DynamicSectionRenderer: React.FC<DynamicSectionRendererProps> = ({ sections }) => {
  const renderFixedSection = (sectionType: string) => {
    switch (sectionType) {
      case 'hero':
        return <HeroSection />;
      case 'features':
        return <FeaturesSection />;
      case 'solutions':
        return <SolutionsSection />;
      case 'content':
        return <ContentSection />;
      case 'about':
        return <AboutSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return null;
    }
  };

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
      {sections.map((section, index) => {
        if (section.type === 'fixed') {
          return (
            <div key={`fixed-${section.data.sectionType}-${index}`}>
              {renderFixedSection(section.data.sectionType)}
            </div>
          );
        } else {
          return renderDynamicSection(section.data as DynamicSection);
        }
      })}
    </>
  );
};

export default DynamicSectionRenderer;
