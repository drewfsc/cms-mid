/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface DarkModeContextType {
  isDark: boolean;
  toggle: () => void;
  setMode: (mode: 'light' | 'dark') => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

interface DarkModeProviderProps {
  children: ReactNode;
  forceMode?: 'light' | 'dark';
}

export function DarkModeProvider({ children, forceMode }: DarkModeProviderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (forceMode) {
      setIsDark(forceMode === 'dark');
      // Apply the forced mode to the document
      if (forceMode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return;
    }

    // Check for saved preference or default to system preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      const isDarkMode = savedMode === 'dark';
      setIsDark(isDarkMode);
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      }
    } else {
      // Default to system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(systemPrefersDark);
      if (systemPrefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, [forceMode]);

  const toggle = () => {
    if (forceMode) return; // Don't allow toggle if mode is forced
    
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem('darkMode', newMode ? 'dark' : 'light');
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setMode = (mode: 'light' | 'dark') => {
    if (forceMode) return; // Don't allow manual setting if mode is forced
    
    const isDarkMode = mode === 'dark';
    setIsDark(isDarkMode);
    localStorage.setItem('darkMode', mode);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <DarkModeContext.Provider value={{ isDark, toggle, setMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}