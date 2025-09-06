/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import React from 'react';

interface SimpleLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SimpleLoader: React.FC<SimpleLoaderProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer rotating ring */}
        <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 border-r-cyan-400 rounded-full animate-spin"></div>
        
        {/* Inner rotating ring */}
        <div className="absolute inset-1 border-4 border-transparent border-b-cyan-300 border-l-cyan-300 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
      </div>
    </div>
  );
};

export default SimpleLoader;
