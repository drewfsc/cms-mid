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

// Default Hero Section Data
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

// Local storage key for CMS data
export const CMS_STORAGE_KEY = 'reign-cms-data';

// CMS Data Management Functions
export class CMSDataManager {
  private static useSupabase = false; // Toggle this to true when Supabase is configured

  static async getHeroData(): Promise<HeroSectionData> {
    if (this.useSupabase) {
      // TODO: Use SupabaseCMSManager when ready
      // return await SupabaseCMSManager.getHeroData();
    }
    
    // Fallback to localStorage
    if (typeof window === 'undefined') return defaultHeroData;
    
    try {
      const stored = localStorage.getItem(`${CMS_STORAGE_KEY}-hero`);
      return stored ? JSON.parse(stored) : defaultHeroData;
    } catch (error) {
      console.error('Error loading hero data:', error);
      return defaultHeroData;
    }
  }

  static async saveHeroData(data: HeroSectionData): Promise<void> {
    if (this.useSupabase) {
      // TODO: Use SupabaseCMSManager when ready
      // return await SupabaseCMSManager.saveHeroData(data);
    }
    
    // Fallback to localStorage
    if (typeof window === 'undefined') return;
    
    try {
      const updatedData = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(`${CMS_STORAGE_KEY}-hero`, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error saving hero data:', error);
      throw error;
    }
  }

  static resetHeroData(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(`${CMS_STORAGE_KEY}-hero`);
  }

  // Synchronous version for compatibility
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
}
