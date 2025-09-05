"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut, Settings } from 'lucide-react';
import { CMSAuthManager } from '@/lib/cms-auth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState('');
  const router = useRouter();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '#features' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const loggedIn = CMSAuthManager.isLoggedIn();
      const userName = CMSAuthManager.getUserDisplayName();
      
      console.log('Header auth check:', { loggedIn, userName }); // Debug log
      
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        setUserDisplayName(userName);
      }
    };

    checkAuth();
    
    // Check auth status periodically
    const interval = setInterval(checkAuth, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    CMSAuthManager.logout();
    setIsLoggedIn(false);
    setUserDisplayName('');
    router.push('/');
  };

  return (
    <header className="fixed top-0 w-full bg-white/10 backdrop-blur-md border-b border-white/20 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OC</span>
              </div>
              <span className="text-xl font-bold text-white">R.E.I.G.N</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* CMS User Info */}
                <div className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg">
                  <Settings className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">
                    {userDisplayName}
                  </span>
                </div>
                
                {/* CMS Dashboard Link */}
                <Link
                  href="/cms/dashboard"
                  className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  CMS Dashboard
                </Link>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {/* TODO: Implement demo modal */}}
                  className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Request Demo
                </button>
                <button
                  onClick={() => {/* TODO: Implement get started modal */}}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Get Started
                </button>
                {/* Quick Test Login Button */}
                <button
                  onClick={() => {
                    CMSAuthManager.login('demo@reign.com', 'demo123');
                    const checkAuth = () => {
                      const loggedIn = CMSAuthManager.isLoggedIn();
                      const userName = CMSAuthManager.getUserDisplayName();
                      setIsLoggedIn(loggedIn);
                      if (loggedIn) {
                        setUserDisplayName(userName);
                      }
                    };
                    checkAuth();
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                  title="Quick test login"
                >
                  Test Login
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white/80 hover:text-white p-2"
            >
{isMenuOpen ? (
                <X className="h-6 w-6" suppressHydrationWarning />
              ) : (
                <Menu className="h-6 w-6" suppressHydrationWarning />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/20 backdrop-blur-md border-t border-white/20">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white/80 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                {isLoggedIn ? (
                  <>
                    {/* Mobile CMS User Info */}
                    <div className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg">
                      <Settings className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-white">
                        {userDisplayName}
                      </span>
                    </div>
                    
                    {/* Mobile CMS Dashboard Link */}
                    <Link
                      href="/cms/dashboard"
                      className="block text-white/80 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      CMS Dashboard
                    </Link>
                    
                    {/* Mobile Logout Button */}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        /* TODO: Implement demo modal */
                        setIsMenuOpen(false);
                      }}
                      className="block text-white/80 hover:text-white px-3 py-2 rounded-md text-base font-medium w-full text-left"
                    >
                      Request Demo
                    </button>
                    <button
                      onClick={() => {
                        /* TODO: Implement get started modal */
                        setIsMenuOpen(false);
                      }}
                      className="block bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium text-center w-full"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

    
    </header>
  );
};

export default Header;
