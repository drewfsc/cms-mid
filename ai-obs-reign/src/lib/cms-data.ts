// CMS Data Types and Management
export interface HeroSectionData {
  id: string;
  badge: {
    text: string;
    icon: boolean;
  };
  title: {
    main: string;
    highlight: string;
  };
  description: string;
  benefits: string[];
  cta: {
    primary: {
      text: string;
      href: string;
    };
    secondary: {
      text: string;
      href: string;
    };
  };
  updatedAt: string;
}

export interface AboutSectionData {
  id: string;
  badge: {
    text: string;
    icon: string;
  };
  title: {
    main: string;
    highlight: string;
  };
  description: string;
  stats: Array<{
    number: string;
    label: string;
  }>;
  values: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  team: {
    title: string;
    description: string;
    ctaText: string;
  };
  updatedAt: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
  bg: string;
  border: string;
}

export interface FeaturesSectionData {
  id: string;
  badge: {
    text: string;
    icon: string;
  };
  title: {
    main: string;
    highlight: string;
  };
  description: string;
  features: Feature[];
  bottomCta: {
    text: string;
    primary: {
      text: string;
      href: string;
    };
    secondary: {
      text: string;
      href: string;
    };
  };
  updatedAt: string;
}

export interface Solution {
  icon: string;
  title: string;
  description: string;
  features: string[];
  color: string;
}

export interface SolutionsSectionData {
  id: string;
  badge: {
    text: string;
    icon: string;
  };
  title: {
    main: string;
    highlight: string;
  };
  description: string;
  solutions: Solution[];
  bottomCta: {
    title: string;
    description: string;
    primary: {
      text: string;
      href: string;
    };
    secondary: {
      text: string;
      href: string;
    };
  };
  updatedAt: string;
}

export interface ContactMethod {
  icon: string;
  title: string;
  description: string;
  contact: string;
  href: string;
}

export interface ContactSectionData {
  id: string;
  badge: {
    text: string;
    icon: string;
  };
  title: {
    main: string;
    highlight: string;
  };
  description: string;
  contactMethods: ContactMethod[];
  form: {
    title: string;
    fields: Array<{
      name: string;
      label: string;
      type: string;
      placeholder: string;
      required: boolean;
    }>;
    submitText: string;
  };
  updatedAt: string;
}

// Default Data for All Sections
export const defaultHeroData: HeroSectionData = {
  id: 'hero-section-1',
  badge: {
    text: 'AI-Powered Observability Platform',
    icon: true
  },
  title: {
    main: 'Transform Your',
    highlight: 'DevOps Operations'
  },
  description: 'R.E.I.G.N delivers intelligent observability and automation for modern workforce management teams. Monitor, analyze, and optimize your infrastructure with AI-powered insights that scale with your business.',
  benefits: [
    'Real-time AI-powered monitoring',
    'Automated incident response',
    'Predictive analytics and insights',
    'Seamless DevOps integration'
  ],
  cta: {
    primary: {
      text: 'Get Started Free',
      href: '#get-started'
    },
    secondary: {
      text: 'Watch Demo',
      href: '#demo'
    }
  },
  updatedAt: new Date().toISOString()
};

export const defaultAboutData: AboutSectionData = {
  id: 'about-section-1',
  badge: {
    text: 'About R.E.I.G.N',
    icon: 'Users'
  },
  title: {
    main: 'Empowering DevOps Teams',
    highlight: 'Worldwide'
  },
  description: 'Founded by experienced DevOps engineers, R.E.I.G.N was created to solve the observability challenges we faced in our own careers. Today, we help teams around the world achieve operational excellence.',
  stats: [
    { number: '500+', label: 'Enterprise Customers' },
    { number: '99.9%', label: 'Platform Uptime' },
    { number: '50M+', label: 'Events Processed Daily' },
    { number: '24/7', label: 'Support Coverage' }
  ],
  values: [
    {
      icon: 'Target',
      title: 'Mission-Driven',
      description: 'We exist to simplify DevOps complexity and empower teams to focus on innovation.'
    },
    {
      icon: 'Users',
      title: 'Customer-Centric',
      description: 'Every feature and decision is made with our customers\' success as the primary consideration.'
    },
    {
      icon: 'Zap',
      title: 'Innovation First',
      description: 'We leverage cutting-edge AI and machine learning to stay ahead of industry challenges.'
    },
    {
      icon: 'Award',
      title: 'Excellence',
      description: 'We maintain the highest standards in security, reliability, and performance.'
    }
  ],
  team: {
    title: 'Built by DevOps Engineers, for DevOps Engineers',
    description: 'Our team combines decades of experience in DevOps, Site Reliability Engineering, and AI/ML to create solutions that truly understand your challenges.',
    ctaText: 'Meet the Team'
  },
  updatedAt: new Date().toISOString()
};

export const defaultFeaturesData: FeaturesSectionData = {
  id: 'features-section-1',
  badge: {
    text: 'Platform Features',
    icon: 'Cpu'
  },
  title: {
    main: 'Everything You Need for',
    highlight: 'Complete Observability'
  },
  description: 'Our comprehensive platform provides all the tools and insights you need to monitor, analyze, and optimize your DevOps infrastructure with AI-powered intelligence.',
  features: [
    {
      icon: 'Brain',
      title: 'AI-Powered Analytics',
      description: 'Advanced machine learning algorithms analyze patterns and predict potential issues before they impact your systems.',
      color: 'text-blue-300',
      bg: 'bg-blue-900/15',
      border: 'border-blue-900/30'
    },
    {
      icon: 'AlertTriangle',
      title: 'Intelligent Alerting',
      description: 'Smart alert system that reduces noise and focuses on what matters most, with contextual information for faster resolution.',
      color: 'text-red-300',
      bg: 'bg-red-900/20',
      border: 'border-red-900/30'
    },
    {
      icon: 'Zap',
      title: 'Automated Response',
      description: 'Automated incident response workflows that can resolve common issues without human intervention.',
      color: 'text-yellow-300',
      bg: 'bg-yellow-900/20',
      border: 'border-yellow-900/30'
    },
    {
      icon: 'BarChart3',
      title: 'Real-time Monitoring',
      description: 'Comprehensive monitoring of infrastructure, applications, and services with real-time metrics and dashboards.',
      color: 'text-green-300',
      bg: 'bg-green-900/20',
      border: 'border-green-900/30'
    },
    {
      icon: 'Network',
      title: 'Service Mapping',
      description: 'Automatic discovery and mapping of service dependencies to understand the impact of issues across your stack.',
      color: 'text-purple-300',
      bg: 'bg-purple-900/20',
      border: 'border-purple-900/30'
    },
    {
      icon: 'Clock',
      title: 'Historical Analysis',
      description: 'Deep historical analysis with trend identification and capacity planning recommendations.',
      color: 'text-indigo-300',
      bg: 'bg-indigo-900/20',
      border: 'border-indigo-900/30'
    },
    {
      icon: 'Shield',
      title: 'Security Monitoring',
      description: 'Integrated security monitoring with threat detection and compliance reporting capabilities.',
      color: 'text-cyan-300',
      bg: 'bg-cyan-900/20',
      border: 'border-cyan-900/30'
    },
    {
      icon: 'Database',
      title: 'Data Integration',
      description: 'Seamless integration with existing tools and data sources for unified observability.',
      color: 'text-pink-300',
      bg: 'bg-pink-900/20',
      border: 'border-pink-900/30'
    },
    {
      icon: 'Cpu',
      title: 'Performance Optimization',
      description: 'AI-driven performance recommendations and automated optimization suggestions.',
      color: 'text-orange-300',
      bg: 'bg-orange-900/20',
      border: 'border-orange-900/30'
    }
  ],
  bottomCta: {
    text: 'Ready to experience the power of AI-driven observability?',
    primary: {
      text: 'Get Started Free',
      href: '#get-started'
    },
    secondary: {
      text: 'Watch Demo',
      href: '#demo'
    }
  },
  updatedAt: new Date().toISOString()
};

export const defaultSolutionsData: SolutionsSectionData = {
  id: 'solutions-section-1',
  badge: {
    text: 'Solutions',
    icon: 'Server'
  },
  title: {
    main: 'Tailored Solutions for',
    highlight: 'Every Environment'
  },
  description: 'From cloud-native startups to enterprise data centers, R.E.I.G.N adapts to your infrastructure and scales with your needs.',
  solutions: [
    {
      icon: 'Cloud',
      title: 'Cloud Infrastructure',
      description: 'Monitor and optimize cloud resources across AWS, Azure, GCP, and hybrid environments.',
      features: ['Multi-cloud visibility', 'Cost optimization', 'Auto-scaling insights', 'Resource tracking'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: 'Container',
      title: 'Container Orchestration',
      description: 'Complete observability for Kubernetes, Docker, and container-based applications.',
      features: ['Pod monitoring', 'Service mesh visibility', 'Resource allocation', 'Health checks'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: 'Server',
      title: 'Infrastructure Monitoring',
      description: 'Traditional and modern infrastructure monitoring with AI-powered anomaly detection.',
      features: ['Server health', 'Network monitoring', 'Storage analytics', 'Performance metrics'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: 'Smartphone',
      title: 'Application Performance',
      description: 'End-to-end application monitoring with user experience insights and error tracking.',
      features: ['APM integration', 'Error tracking', 'User sessions', 'Performance optimization'],
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: 'Database',
      title: 'Database Observability',
      description: 'Database performance monitoring, query optimization, and capacity planning.',
      features: ['Query analysis', 'Index optimization', 'Connection pooling', 'Backup monitoring'],
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: 'Globe',
      title: 'Global Operations',
      description: 'Worldwide infrastructure monitoring with regional insights and compliance.',
      features: ['Multi-region monitoring', 'Compliance reporting', 'SLA tracking', 'Global dashboards'],
      color: 'from-teal-500 to-cyan-500'
    }
  ],
  bottomCta: {
    title: 'Don\'t See Your Use Case?',
    description: 'Our platform is highly customizable. Let\'s discuss how we can tailor R.E.I.G.N to meet your specific observability requirements.',
    primary: {
      text: 'Schedule Consultation',
      href: '#consultation'
    },
    secondary: {
      text: 'View All Solutions',
      href: '#solutions'
    }
  },
  updatedAt: new Date().toISOString()
};

export const defaultContactData: ContactSectionData = {
  id: 'contact-section-1',
  badge: {
    text: 'Get in Touch',
    icon: 'MessageSquare'
  },
  title: {
    main: 'Ready to Transform Your',
    highlight: 'DevOps Operations?'
  },
  description: 'Let\'s discuss how R.E.I.G.N can help your team achieve operational excellence. Our experts are ready to provide personalized recommendations.',
  contactMethods: [
    {
      icon: 'Mail',
      title: 'Email Us',
      description: 'Get in touch with our team',
      contact: 'contact@R.E.I.G.N.com',
      href: 'mailto:contact@R.E.I.G.N.com'
    },
    {
      icon: 'Phone',
      title: 'Call Us',
      description: 'Speak with our experts',
      contact: '+1 (555) 123-4567',
      href: 'tel:+15551234567'
    },
    {
      icon: 'MessageSquare',
      title: 'Live Chat',
      description: 'Chat with support',
      contact: 'Available 24/7',
      href: '#chat'
    },
    {
      icon: 'MapPin',
      title: 'Visit Us',
      description: 'Our headquarters',
      contact: 'San Francisco, CA',
      href: '#location'
    }
  ],
  form: {
    title: 'Send us a message',
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        placeholder: 'John',
        required: true
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        placeholder: 'Doe',
        required: true
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'john@company.com',
        required: true
      },
      {
        name: 'company',
        label: 'Company',
        type: 'text',
        placeholder: 'Your Company',
        required: false
      },
      {
        name: 'message',
        label: 'Message',
        type: 'textarea',
        placeholder: 'Tell us about your observability challenges...',
        required: true
      }
    ],
    submitText: 'Send Message'
  },
  updatedAt: new Date().toISOString()
};

// Local storage key for CMS data
export const CMS_STORAGE_KEY = 'reign-cms-data';

// CMS Data Management
import { DynamicSection } from './dynamic-sections';

export class CMSDataManager {
  private static useSupabase = false; // Toggle this to true when Supabase is configured

  // Hero Section Methods
  static getHeroDataSync(): HeroSectionData {
    if (typeof window === 'undefined') return defaultHeroData;
    
    try {
      const stored = localStorage.getItem(`${CMS_STORAGE_KEY}-hero`);
      return stored ? JSON.parse(stored) : defaultHeroData;
    } catch (error) {
      console.error('Error loading hero data:', error);
      return defaultHeroData;
    }
  }

  static saveHeroDataSync(data: HeroSectionData): void {
    if (typeof window === 'undefined') return;
    
    try {
      const updatedData = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(`${CMS_STORAGE_KEY}-hero`, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error saving hero data:', error);
    }
  }

  static resetHeroData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`${CMS_STORAGE_KEY}-hero`);
  }

  // About Section Methods
  static getAboutDataSync(): AboutSectionData {
    if (typeof window === 'undefined') return defaultAboutData;
    
    try {
      const stored = localStorage.getItem(`${CMS_STORAGE_KEY}-about`);
      return stored ? JSON.parse(stored) : defaultAboutData;
    } catch (error) {
      console.error('Error loading about data:', error);
      return defaultAboutData;
    }
  }

  static saveAboutDataSync(data: AboutSectionData): void {
    if (typeof window === 'undefined') return;
    
    try {
      const updatedData = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(`${CMS_STORAGE_KEY}-about`, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error saving about data:', error);
    }
  }

  static resetAboutData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`${CMS_STORAGE_KEY}-about`);
  }

  // Features Section Methods
  static getFeaturesDataSync(): FeaturesSectionData {
    if (typeof window === 'undefined') return defaultFeaturesData;
    
    try {
      const stored = localStorage.getItem(`${CMS_STORAGE_KEY}-features`);
      return stored ? JSON.parse(stored) : defaultFeaturesData;
    } catch (error) {
      console.error('Error loading features data:', error);
      return defaultFeaturesData;
    }
  }

  static saveFeaturesDataSync(data: FeaturesSectionData): void {
    if (typeof window === 'undefined') return;
    
    try {
      const updatedData = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(`${CMS_STORAGE_KEY}-features`, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error saving features data:', error);
    }
  }

  static resetFeaturesData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`${CMS_STORAGE_KEY}-features`);
  }

  // Solutions Section Methods
  static getSolutionsDataSync(): SolutionsSectionData {
    if (typeof window === 'undefined') return defaultSolutionsData;
    
    try {
      const stored = localStorage.getItem(`${CMS_STORAGE_KEY}-solutions`);
      return stored ? JSON.parse(stored) : defaultSolutionsData;
    } catch (error) {
      console.error('Error loading solutions data:', error);
      return defaultSolutionsData;
    }
  }

  static saveSolutionsDataSync(data: SolutionsSectionData): void {
    if (typeof window === 'undefined') return;
    
    try {
      const updatedData = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(`${CMS_STORAGE_KEY}-solutions`, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error saving solutions data:', error);
    }
  }

  static resetSolutionsData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`${CMS_STORAGE_KEY}-solutions`);
  }

  // Contact Section Methods
  static getContactDataSync(): ContactSectionData {
    if (typeof window === 'undefined') return defaultContactData;
    
    try {
      const stored = localStorage.getItem(`${CMS_STORAGE_KEY}-contact`);
      return stored ? JSON.parse(stored) : defaultContactData;
    } catch (error) {
      console.error('Error loading contact data:', error);
      return defaultContactData;
    }
  }

  static saveContactDataSync(data: ContactSectionData): void {
    if (typeof window === 'undefined') return;
    
    try {
      const updatedData = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(`${CMS_STORAGE_KEY}-contact`, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error saving contact data:', error);
    }
  }

  static resetContactData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`${CMS_STORAGE_KEY}-contact`);
  }

  // Generic reset method
  static resetAllData(): void {
    if (typeof window === 'undefined') return;
    
    this.resetHeroData();
    this.resetAboutData();
    this.resetFeaturesData();
    this.resetSolutionsData();
    this.resetContactData();
    this.resetDynamicSections();
  }

  // Dynamic Sections Management
  static getDynamicSections(): DynamicSection[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('cms-dynamic-sections');
    return data ? JSON.parse(data) : [];
  }

  static saveDynamicSections(sections: DynamicSection[]): void {
    if (typeof window === 'undefined') return;
    
    // Sort sections by order
    const sortedSections = [...sections].sort((a, b) => a.order - b.order);
    
    localStorage.setItem('cms-dynamic-sections', JSON.stringify(sortedSections));
    localStorage.setItem('cms-dynamic-sections-updated', new Date().toISOString());
  }

  static addDynamicSection(section: DynamicSection): void {
    const sections = this.getDynamicSections();
    
    // Set order to place new sections after existing dynamic sections
    // but before the About and Contact sections (which have order 1000+)
    const maxDynamicOrder = sections.reduce((max, s) => 
      s.order < 1000 ? Math.max(max, s.order) : max, -1
    );
    
    // If no dynamic sections exist, start at order 0
    // Otherwise, place after the last dynamic section
    section.order = maxDynamicOrder < 0 ? 0 : maxDynamicOrder + 1;
    
    sections.push(section);
    this.saveDynamicSections(sections);
  }

  static updateDynamicSection(id: string, updates: Partial<DynamicSection>): void {
    const sections = this.getDynamicSections();
    const index = sections.findIndex(s => s.id === id);
    
    if (index !== -1) {
      sections[index] = {
        ...sections[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveDynamicSections(sections);
    }
  }

  static deleteDynamicSection(id: string): void {
    let sections = this.getDynamicSections();
    sections = sections.filter(s => s.id !== id);
    
    // Reorder remaining sections
    sections.forEach((section, index) => {
      section.order = index;
    });
    
    this.saveDynamicSections(sections);
  }

  static reorderDynamicSections(sectionIds: string[]): void {
    const sections = this.getDynamicSections();
    const reorderedSections = sectionIds.map((id, index) => {
      const section = sections.find(s => s.id === id);
      if (section) {
        section.order = index;
      }
      return section;
    }).filter(Boolean) as DynamicSection[];
    
    this.saveDynamicSections(reorderedSections);
  }

  static resetDynamicSections(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('cms-dynamic-sections');
    localStorage.removeItem('cms-dynamic-sections-updated');
  }

  // Get all sections including fixed and dynamic
  static getAllSections(): Array<{type: 'fixed' | 'dynamic', data: any}> {
    const sections: Array<{type: 'fixed' | 'dynamic', data: any}> = [];
    
    // Add fixed sections
    sections.push({ type: 'fixed', data: { ...this.getHeroDataSync(), sectionType: 'hero', order: -5 } });
    sections.push({ type: 'fixed', data: { ...this.getFeaturesDataSync(), sectionType: 'features', order: -4 } });
    sections.push({ type: 'fixed', data: { ...this.getSolutionsDataSync(), sectionType: 'solutions', order: -3 } });
    
    // Add dynamic sections
    const dynamicSections = this.getDynamicSections();
    dynamicSections.forEach(section => {
      sections.push({ type: 'dynamic', data: section });
    });
    
    // Add more fixed sections
    sections.push({ type: 'fixed', data: { ...this.getAboutDataSync(), sectionType: 'about', order: 1000 } });
    sections.push({ type: 'fixed', data: { ...this.getContactDataSync(), sectionType: 'contact', order: 1001 } });
    
    // Sort by order
    return sections.sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
  }
}
