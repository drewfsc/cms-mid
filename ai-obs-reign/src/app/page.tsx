import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import React from 'react';
import ParallaxBackground from '@/components/layout/ParallaxBackground';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import SolutionsSection from '@/components/sections/SolutionsSection';
import ContentSection from '@/components/sections/ContentSection';
import AboutSection from '@/components/sections/AboutSection';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
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
            <HeroSection />
            <FeaturesSection />
          </div>
          
          {/* Sections with regular background */}
          <div className="relative z-10 bg-black">
            <SolutionsSection />
            <ContentSection />
            <AboutSection />
            <ContactSection />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
