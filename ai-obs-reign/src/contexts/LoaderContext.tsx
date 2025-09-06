'use client';


import React, { createContext, useContext, useState, useEffect } from 'react';
import AppLoader from '@/components/ui/AppLoader';

interface LoaderContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  setLoading: (loading: boolean) => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};

interface LoaderProviderProps {
  children: React.ReactNode;
  initialLoading?: boolean;
  autoHideDelay?: number;
}

export const LoaderProvider: React.FC<LoaderProviderProps> = ({ 
  children, 
  initialLoading = true,
  autoHideDelay = 3000 
}) => {
  const [isLoading, setIsLoading] = useState(initialLoading);

  useEffect(() => {
    if (autoHideDelay > 0) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [autoHideDelay]);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);
  const setLoading = (loading: boolean) => setIsLoading(loading);

  return (
    <LoaderContext.Provider value={{ isLoading, startLoading, stopLoading, setLoading }}>
      {children}
      {isLoading && <AppLoader />}
    </LoaderContext.Provider>
  );
};
