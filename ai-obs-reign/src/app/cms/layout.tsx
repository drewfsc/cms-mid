/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import { DarkModeProvider } from '@/lib/dark-mode-context';

export default function CMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </div>
    </DarkModeProvider>
  );
}



