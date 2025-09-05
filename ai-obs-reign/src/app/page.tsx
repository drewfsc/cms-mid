'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ParallaxBackground from '@/components/layout/ParallaxBackground';
import DynamicSectionRenderer from '@/components/sections/DynamicSectionRenderer';
import { CMSDataManager } from '@/lib/cms-data';

export default function Home() {
  const [sections, setSections] = useState<Array<{type: 'fixed' | 'dynamic', data: any}>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load all sections from CMS
    const allSections = CMSDataManager.getAllSections();
    setSections(allSections);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Separate sections that need parallax background from those that don't
  const parallaxSections = sections.filter(s => {
    if (s.type === 'fixed') {
      return ['hero', 'features'].includes(s.data.sectionType);
    }
    return false; // Dynamic sections can be configured later
  });

  const regularSections = sections.filter(s => {
    if (s.type === 'fixed') {
      return !['hero', 'features'].includes(s.data.sectionType);
    }
    return true; // All dynamic sections go in regular background for now
  });

  return (
    <div className="min-h-screen">
      {/* Parallax Background - covers header, hero, and features */}
      <ParallaxBackground />
      
      {/* Content with proper z-index layering */}
      <div className="relative">
        <Header />
        <main>
          {/* Sections with parallax background */}
          <div className="relative z-10">
            <DynamicSectionRenderer sections={parallaxSections} />
          </div>
          
          {/* Sections with regular background */}
          <div className="relative z-10 bg-black">
            <DynamicSectionRenderer sections={regularSections} />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
