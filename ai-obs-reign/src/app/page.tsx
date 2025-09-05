'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ParallaxBackground from '@/components/layout/ParallaxBackground';
import DynamicSectionRenderer from '@/components/sections/DynamicSectionRenderer';
import { CMSDataManager } from '@/lib/cms-data';
import { DynamicSection } from '@/lib/dynamic-sections';
import { ContentMigration } from '@/lib/content-migration';

export default function Home() {
  const [sections, setSections] = useState<DynamicSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Run migration if needed (converts static content to dynamic sections)
    ContentMigration.runMigration();
    
    // Load dynamic sections from CMS
    const dynamicSections = CMSDataManager.getDynamicSections();
    setSections(dynamicSections);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Filter visible sections and sort by order
  const visibleSections = sections
    .filter(section => section.isVisible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen">
      {/* Parallax Background - covers header and first sections */}
      <ParallaxBackground />
      
      {/* Content with proper z-index layering */}
      <div className="relative">
        <Header />
        <main className="relative z-10">
          {visibleSections.length === 0 ? (
            // Empty state when no sections exist
            <div className="min-h-screen flex items-center justify-center text-white">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to R.E.I.G.N</h1>
                <p className="text-xl text-gray-300 mb-8">
                  Your dynamic content management system is ready.
                </p>
                <p className="text-gray-400">
                  Visit the CMS to add your first section.
                </p>
              </div>
            </div>
          ) : (
            <DynamicSectionRenderer sections={visibleSections} />
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
