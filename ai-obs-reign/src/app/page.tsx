import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import SolutionsSection from '@/components/sections/SolutionsSection';
import ContentSection from '@/components/sections/ContentSection';
import AboutSection from '@/components/sections/AboutSection';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <SolutionsSection />
        <ContentSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
