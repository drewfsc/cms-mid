'use client';

import React from 'react';
import AppLoader from '@/components/ui/AppLoader';
import { useAppLoader } from '@/hooks/useAppLoader';

interface AppWrapperProps {
  children: React.ReactNode;
  showLoader?: boolean;
  loaderDelay?: number;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ 
  children, 
  showLoader = true, 
  loaderDelay = 2000 
}) => {
  const { isLoading } = useAppLoader(showLoader, loaderDelay);

  return (
    <>
      {children}
      {isLoading && <AppLoader />}
    </>
  );
};

export default AppWrapper;
