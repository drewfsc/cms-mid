// CMS Authentication Management
// Simple auth system for CMS access control

export interface CMSUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
  loginTime: string;
}

export class CMSAuthManager {
  private static readonly AUTH_KEY = 'cms-auth';
  private static readonly SESSION_KEY = 'cms-session';

  // Check if user is currently logged in
  static isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const authData = localStorage.getItem(this.AUTH_KEY);
      const sessionData = sessionStorage.getItem(this.SESSION_KEY);
      
      if (!authData || !sessionData) return false;
      
      const session = JSON.parse(sessionData);
      const now = new Date().getTime();
      const sessionAge = now - new Date(session.loginTime).getTime();
      const maxAge = 8 * 60 * 60 * 1000; // 8 hours
      
      return sessionAge < maxAge;
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  }

  // Get current user data
  static getCurrentUser(): CMSUser | null {
    if (typeof window === 'undefined' || !this.isLoggedIn()) return null;
    
    try {
      const authData = localStorage.getItem(this.AUTH_KEY);
      return authData ? JSON.parse(authData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Simple login (for demo purposes - replace with real auth)
  static login(email: string, password: string): boolean {
    if (typeof window === 'undefined') return false;
    
    // Demo credentials (replace with real authentication)
    const validCredentials = [
      { email: 'admin@reign.com', password: 'admin123', role: 'admin' as const },
      { email: 'editor@reign.com', password: 'editor123', role: 'editor' as const },
      { email: 'demo@reign.com', password: 'demo123', role: 'admin' as const }
    ];
    
    const user = validCredentials.find(
      cred => cred.email === email && cred.password === password
    );
    
    if (!user) return false;
    
    const userData: CMSUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: user.email,
      name: user.email.split('@')[0],
      role: user.role,
      loginTime: new Date().toISOString()
    };
    
    try {
      localStorage.setItem(this.AUTH_KEY, JSON.stringify(userData));
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify({
        loginTime: userData.loginTime,
        sessionId: userData.id
      }));
      
      return true;
    } catch (error) {
      console.error('Error saving login data:', error);
      return false;
    }
  }

  // Logout user
  static logout(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.AUTH_KEY);
      localStorage.removeItem(this.SESSION_KEY);
      sessionStorage.clear();
      
      // Clear any CMS data caches
      const cmsKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('reign-cms-') || key.startsWith('cms-')
      );
      
      // Optionally clear CMS data on logout (uncomment if desired)
      // cmsKeys.forEach(key => localStorage.removeItem(key));
      
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // Check if user has required role
  static hasRole(requiredRole: 'admin' | 'editor'): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    if (requiredRole === 'editor') {
      return user.role === 'admin' || user.role === 'editor';
    }
    
    return user.role === 'admin';
  }

  // Get user display name
  static getUserDisplayName(): string {
    const user = this.getCurrentUser();
    return user ? user.name : 'Guest';
  }

  // Session management
  static refreshSession(): void {
    if (typeof window === 'undefined' || !this.isLoggedIn()) return;
    
    try {
      const authData = localStorage.getItem(this.AUTH_KEY);
      if (authData) {
        const userData = JSON.parse(authData);
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify({
          loginTime: new Date().toISOString(),
          sessionId: userData.id
        }));
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  }
}

// Demo credentials for easy testing
export const DEMO_CREDENTIALS = {
  admin: { email: 'admin@reign.com', password: 'admin123' },
  editor: { email: 'editor@reign.com', password: 'editor123' },
  demo: { email: 'demo@reign.com', password: 'demo123' }
};
