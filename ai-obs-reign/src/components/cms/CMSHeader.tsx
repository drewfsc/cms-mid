'use client';

import Link from 'next/link';
import { ArrowLeft, Moon, Sun, Home, LogOut } from 'lucide-react';
import { useState } from 'react';

interface CMSHeaderProps {
  title: string;
  showBackButton?: boolean;
}

// Simple dark mode state for this component
const CMSHeader: React.FC<CMSHeaderProps> = ({ title, showBackButton = false }) => {
  const [isDark, setIsDark] = useState(false);
  const toggle = () => setIsDark(!isDark);
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Link
                href="/cms/dashboard"
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            )}
            
            <Link href="/cms/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OC</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">CMS</span>
            </Link>
            
            <span className="text-gray-500 dark:text-gray-400">|</span>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 text-gray-600" />
              )}
            </button>
            
            <Link
              href="/"
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <Home className="w-4 h-4 mr-2" />
              View Site
            </Link>
            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CMSHeader;
