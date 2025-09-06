/* eslint-disable @next/next/no-img-element */
'use client';


import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, LogOut, User, ChevronDown, Settings } from 'lucide-react';
import { useDarkMode } from '@/lib/dark-mode-context';
import { CMSAuthManager, CMSUser } from '@/lib/cms-auth';
import { SiteConfigManager } from '@/lib/site-config';

interface CMSHeaderProps {
  title: string;
  showBackButton?: boolean;
}

const CMSHeader: React.FC<CMSHeaderProps> = ({ title, showBackButton = false }) => {
  const { isDark, toggle } = useDarkMode();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CMSUser | null>(null);
  const [userDisplayName, setUserDisplayName] = useState('');
  const [mounted, setMounted] = useState(false);
  const [siteIcon, setSiteIcon] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const user = CMSAuthManager.getCurrentUser();
    const displayName = CMSAuthManager.getUserDisplayName();
    const icon = SiteConfigManager.getSiteIcon();
    setCurrentUser(user);
    setUserDisplayName(displayName);
    setSiteIcon(icon);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    // Use the auth manager to handle logout
    CMSAuthManager.logout();
    
    // Redirect to homepage
    router.push('/');
  };
  
  return (
    <header className="bg-black dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Link
                href="/cms/dashboard"
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-black dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {/* Back to Dashboard */}
              </Link>
            )}
            
            <Link href="/cms/dashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                {siteIcon ? (
                  <img 
                    src={siteIcon} 
                    alt="Site Icon" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-sm">OC</span>
                )}
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">CMS</span>
            </Link>
            
            <span className="text-gray-500 dark:text-gray-400">|</span>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* User Dropdown - Only render after mounting to prevent hydration mismatch */}
            {mounted ? (
              currentUser && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {userDisplayName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                      {currentUser.role}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{userDisplayName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.email}</p>
                        </div>
                        
                        <Link
                          href="/cms/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </Link>
                        
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            ) : (
              // Loading placeholder to prevent layout shift
              <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            )}

            {/* Animated Dark Mode Toggle */}
            <div className="flex items-center">
              <button
                onClick={toggle}
                className="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-300 dark:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                title="Toggle dark mode"
              >
                <span className={`inline-block w-4 h-4 transform rounded-full bg-white transition-transform ${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <Link
              href="/"
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <Home className="w-4 h-4 mr-2" />
              View Site
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CMSHeader;

