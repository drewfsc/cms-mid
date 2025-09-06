'use client';

import React from 'react';
import { LoaderProvider } from '@/contexts/LoaderContext';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <LoaderProvider initialLoading={true} autoHideDelay={3000}>
      {children}
    </LoaderProvider>
  );
};

export default ClientLayout;
