// Section styling utilities

import React from 'react';
import { SectionStyling } from './dynamic-sections';
import { SiteConfigManager } from './site-config';

export class SectionStylingUtils {
  static getSectionStyles(styling: SectionStyling): {
    containerStyle: React.CSSProperties;
    containerClass: string;
    backgroundImageStyle?: React.CSSProperties;
  } {
    const backgroundColors = SiteConfigManager.getBackgroundColors();
    const selectedColor = backgroundColors.find(c => c.id === styling.backgroundColor);
    
    let containerStyle: React.CSSProperties = {};
    let containerClass = '';
    let backgroundImageStyle: React.CSSProperties | undefined;

    // Apply text color theme
    switch (styling.textColor) {
      case 'light':
        containerClass += ' text-white';
        break;
      case 'dark':
        containerClass += ' text-gray-900';
        break;
      default:
        containerClass += ' text-gray-900 dark:text-white';
        break;
    }

    // Apply padding
    switch (styling.padding) {
      case 'none':
        containerClass += ' py-0';
        break;
      case 'small':
        containerClass += ' py-8';
        break;
      case 'large':
        containerClass += ' py-32';
        break;
      default:
        containerClass += ' py-20';
        break;
    }

    // Handle background styling
    if (styling.backgroundImage) {
      // If background image is present, apply it with proper layering
      const opacity = (styling.imageOpacity || 20) / 100;
      
      backgroundImageStyle = {
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${styling.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity,
        zIndex: 0 // Above the background color, below content (z-10)
      };

      // Add parallax transform if enabled
      if (styling.enableParallax) {
        backgroundImageStyle.transform = 'translateZ(0)'; // Enable GPU acceleration
        backgroundImageStyle.willChange = 'transform';
      }

      // Apply background color to container (will be behind the image)
      if (selectedColor) {
        if (selectedColor.hex.startsWith('linear-gradient')) {
          containerStyle.background = selectedColor.hex;
        } else {
          containerStyle.backgroundColor = selectedColor.hex;
        }
      }

      // Ensure container is relative for absolute positioning
      containerClass += ' relative overflow-hidden';
    } else {
      // If no background image, just apply the background color directly
      if (selectedColor) {
        if (selectedColor.hex.startsWith('linear-gradient')) {
          containerStyle.background = selectedColor.hex;
        } else {
          containerStyle.backgroundColor = selectedColor.hex;
        }
      }
    }

    return {
      containerStyle,
      containerClass: containerClass.trim(),
      backgroundImageStyle
    };
  }

  static getParallaxTransform(scrollY: number, enableParallax: boolean): string {
    if (!enableParallax) return '';
    return `translateY(${scrollY * 0.5}px)`;
  }

  static getColorPreview(colorId: string): string {
    const backgroundColors = SiteConfigManager.getBackgroundColors();
    const color = backgroundColors.find(c => c.id === colorId);
    return color?.hex || '#ffffff';
  }

  static isLightBackground(colorId: string): boolean {
    const color = this.getColorPreview(colorId);
    
    // For gradients, assume they might be dark
    if (color.startsWith('linear-gradient')) {
      return false;
    }

    // Convert hex to RGB and calculate luminance
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5;
  }

  static getContrastTextColor(colorId: string): 'light' | 'dark' {
    return this.isLightBackground(colorId) ? 'dark' : 'light';
  }

  static getTextColorClasses(styling: SectionStyling): string {
    switch (styling.textColor) {
      case 'light':
        return 'text-white';
      case 'dark':
        return 'text-gray-900';
      default:
        return 'text-gray-900 dark:text-white';
    }
  }

  static getHeadingColorClasses(styling: SectionStyling): string {
    switch (styling.textColor) {
      case 'light':
        return 'text-white';
      case 'dark':
        return 'text-gray-900';
      default:
        return 'text-gray-900 dark:text-white';
    }
  }

  static getSubheadingColorClasses(styling: SectionStyling): string {
    switch (styling.textColor) {
      case 'light':
        return 'text-blue-300';
      case 'dark':
        return 'text-blue-600';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  }

  static getBodyTextColorClasses(styling: SectionStyling): string {
    switch (styling.textColor) {
      case 'light':
        return 'text-gray-200';
      case 'dark':
        return 'text-gray-700';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  }
}

// Hook for parallax scrolling
export function useParallaxScroll(enabled: boolean) {
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enabled]);

  return scrollY;
}
