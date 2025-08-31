import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconProps {
  icon: LucideIcon;
  className?: string;
  size?: number;
}

const Icon: React.FC<IconProps> = ({ icon: IconComponent, className, size }) => {
  return (
    <span suppressHydrationWarning>
      <IconComponent className={className} size={size} />
    </span>
  );
};

export default Icon;
