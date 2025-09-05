// Migration utility to convert static content to dynamic sections

import { CMSDataManager } from './cms-data';
import { createSection, SECTION_TEMPLATES, DynamicSection } from './dynamic-sections';

export class ContentMigration {
  static migrateStaticToDynamic(): DynamicSection[] {
    const migratedSections: DynamicSection[] = [];
    
    // Get existing static data
    const heroData = CMSDataManager.getHeroDataSync();
    const aboutData = CMSDataManager.getAboutDataSync();
    const featuresData = CMSDataManager.getFeaturesDataSync();
    const solutionsData = CMSDataManager.getSolutionsDataSync();
    const contactData = CMSDataManager.getContactDataSync();

    // 1. Create Hero Section
    const heroTemplate = SECTION_TEMPLATES.find(t => t.layout === 'hero');
    if (heroTemplate) {
      const heroSection = createSection(heroTemplate, 'Hero Section');
      heroSection.fields = {
        badge: heroData.badge.text,
        title: heroData.title.main,
        subtitle: heroData.title.highlight,
        description: heroData.description,
        primaryCta: heroData.cta.primary.text,
        primaryCtaLink: heroData.cta.primary.href,
        secondaryCta: heroData.cta.secondary.text,
        secondaryCtaLink: heroData.cta.secondary.href,
        backgroundImage: '/bg.jpg'
      };
      heroSection.order = 0;
      migratedSections.push(heroSection);
    }

    // 2. Create Features Grid
    const gridTemplate = SECTION_TEMPLATES.find(t => t.layout === 'grid');
    if (gridTemplate) {
      const featuresSection = createSection(gridTemplate, 'Platform Features');
      featuresSection.fields = {
        title: featuresData.title.main,
        subtitle: featuresData.title.highlight,
        description: featuresData.description,
        columns: '3',
        items: featuresData.features.map(feature => ({
          icon: this.getEmojiForIcon(feature.icon),
          title: feature.title,
          description: feature.description,
          link: '#'
        }))
      };
      featuresSection.order = 1;
      migratedSections.push(featuresSection);
    }

    // 3. Create Solutions Bento Grid
    const bentoTemplate = SECTION_TEMPLATES.find(t => t.layout === 'bento');
    if (bentoTemplate) {
      const solutionsSection = createSection(bentoTemplate, 'Our Solutions');
      solutionsSection.fields = {
        title: solutionsData.title.main,
        subtitle: solutionsData.title.highlight,
        cards: solutionsData.solutions.map((solution, index) => ({
          size: index === 0 ? 'large' : index < 3 ? 'medium' : 'small',
          title: solution.title,
          description: solution.description,
          icon: this.getEmojiForIcon(solution.icon),
          color: this.getColorForSolution(index),
          image: ''
        }))
      };
      solutionsSection.order = 2;
      migratedSections.push(solutionsSection);
    }

    // 4. Create About Section (Two Column)
    const columnsTemplate = SECTION_TEMPLATES.find(t => t.layout === 'columns');
    if (columnsTemplate) {
      const aboutSection = createSection(columnsTemplate, 'About R.E.I.G.N');
      aboutSection.fields = {
        title: aboutData.title.main,
        subtitle: aboutData.title.highlight,
        layout: 'text-left',
        content: `<p>${aboutData.description}</p>`,
        image: '/bg.jpg',
        imageAlt: 'R.E.I.G.N Platform',
        ctaText: aboutData.team.ctaText,
        ctaLink: '#team',
        features: aboutData.values.map(value => value.title)
      };
      aboutSection.order = 3;
      migratedSections.push(aboutSection);
    }

    // 5. Create Contact Section (Two Column)
    if (columnsTemplate) {
      const contactSection = createSection(columnsTemplate, 'Contact Us');
      contactSection.fields = {
        title: contactData.title.main,
        subtitle: contactData.title.highlight,
        layout: 'text-right',
        content: `<p>${contactData.description}</p>`,
        image: '/bg.jpg',
        imageAlt: 'Contact R.E.I.G.N',
        ctaText: 'Get In Touch',
        ctaLink: '#contact',
        features: contactData.contactMethods.map(method => `${method.title}: ${method.contact}`)
      };
      contactSection.order = 4;
      migratedSections.push(contactSection);
    }

    return migratedSections;
  }

  static runMigration(): void {
    // Check if migration has already been run
    if (typeof window !== 'undefined') {
      const migrationFlag = localStorage.getItem('cms-migration-completed');
      if (migrationFlag) {
        console.log('Migration already completed');
        return;
      }
    }

    // Get migrated sections
    const migratedSections = this.migrateStaticToDynamic();
    
    // Save all migrated sections
    migratedSections.forEach(section => {
      CMSDataManager.addDynamicSection(section);
    });

    // Set migration flag
    if (typeof window !== 'undefined') {
      localStorage.setItem('cms-migration-completed', 'true');
      localStorage.setItem('cms-migration-date', new Date().toISOString());
    }

    console.log(`Migration completed: ${migratedSections.length} sections created`);
  }

  static resetMigration(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cms-migration-completed');
      localStorage.removeItem('cms-migration-date');
      CMSDataManager.resetDynamicSections();
    }
  }

  // Helper functions
  private static getEmojiForIcon(iconName: string): string {
    const iconMap: Record<string, string> = {
      'Brain': '🧠',
      'Shield': '🛡️',
      'Zap': '⚡',
      'BarChart3': '📊',
      'AlertTriangle': '⚠️',
      'Clock': '⏰',
      'Network': '🌐',
      'Cpu': '💻',
      'Database': '🗄️',
      'Cloud': '☁️',
      'Container': '📦',
      'Server': '🖥️',
      'Smartphone': '📱',
      'Globe': '🌍',
      'Users': '👥',
      'Target': '🎯',
      'Award': '🏆',
      'Mail': '📧',
      'Phone': '📞',
      'MapPin': '📍',
      'MessageSquare': '💬'
    };
    return iconMap[iconName] || '🔹';
  }

  private static getColorForSolution(index: number): string {
    const colors = ['blue', 'purple', 'green', 'orange', 'pink'];
    return colors[index % colors.length];
  }
}
