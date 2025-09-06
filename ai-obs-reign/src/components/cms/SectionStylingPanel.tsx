/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import React from 'react';
import { Palette, Image, Eye, Move, Layers, CornerDownRight, Circle } from 'lucide-react';
import { SectionStyling } from '@/lib/dynamic-sections';
import { SiteConfigManager, SiteColors } from '@/lib/site-config';

interface SectionStylingPanelProps {
  styling: SectionStyling;
  onUpdate: (styling: SectionStyling) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const SectionStylingPanel: React.FC<SectionStylingPanelProps> = ({
  styling,
  onUpdate,
  isOpen,
  onToggle
}) => {
  const backgroundColors = SiteConfigManager.getBackgroundColors();

  const handleStylingChange = (field: keyof SectionStyling, value: unknown) => {
    onUpdate({
      ...styling,
      [field]: value
    });
  };

  const getBackgroundStyle = (color: SiteColors) => {
    if (color.hex.startsWith('linear-gradient')) {
      return { background: color.hex };
    }
    return { backgroundColor: color.hex };
  };

  const getTextColorClasses = (textColor: string) => {
    switch (textColor) {
      case 'light':
        return 'text-white';
      case 'dark':
        return 'text-gray-900';
      default:
        return 'text-gray-900 dark:text-white';
    }
  };

  const getPaddingClasses = (padding: string) => {
    switch (padding) {
      case 'none':
        return 'py-0';
      case 'small':
        return 'py-8';
      case 'large':
        return 'py-32';
      default:
        return 'py-20';
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-3 flex items-center justify-between text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Palette className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Section Styling
          </span>
        </div>
        <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Styling Controls */}
      {isOpen && (
        <div className="px-6 pb-6 space-y-6">
          {/* Background Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Background Color
            </label>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {backgroundColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleStylingChange('backgroundColor', color.id)}
                  className={`relative w-full h-12 rounded-lg border-2 transition-all ${
                    styling.backgroundColor === color.id
                      ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  style={getBackgroundStyle(color)}
                  title={color.description || color.name}
                >
                  {styling.backgroundColor === color.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Selected: {backgroundColors.find(c => c.id === styling.backgroundColor)?.name || 'Unknown'}
            </p>
          </div>

          {/* Background Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Background Image (Optional)
            </label>
            <div className="flex items-center space-x-3">
              <Image className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={styling.backgroundImage || ''}
                onChange={(e) => handleStylingChange('backgroundImage', e.target.value)}
                placeholder="https://example.com/image.jpg or /local-image.jpg"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Image Opacity */}
          {styling.backgroundImage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image Opacity: {styling.imageOpacity || 20}%
              </label>
              <div className="flex items-center space-x-3">
                <Eye className="w-4 h-4 text-gray-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={styling.imageOpacity || 20}
                  onChange={(e) => handleStylingChange('imageOpacity', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                  {styling.imageOpacity || 20}%
                </span>
              </div>
            </div>
          )}

          {/* Parallax Toggle */}
          {styling.backgroundImage && (
            <div>
              <label className="flex items-center space-x-3">
                <Move className="w-4 h-4 text-gray-400" />
                <input
                  type="checkbox"
                  checked={styling.enableParallax || false}
                  onChange={(e) => handleStylingChange('enableParallax', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable Parallax Effect
                </span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 ml-7">
                Background image moves slower than content when scrolling
              </p>
            </div>
          )}

          {/* Text Color Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Text Color Theme
            </label>
            <div className="flex space-x-2">
              {[
                { value: 'auto', label: 'Auto', icon: '🔄' },
                { value: 'light', label: 'Light', icon: '☀️' },
                { value: 'dark', label: 'Dark', icon: '🌙' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStylingChange('textColor', option.value)}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                    styling.textColor === option.value
                      ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-300'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="mr-1">{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Padding */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Section Padding
            </label>
            <div className="flex space-x-2">
              {[
                { value: 'none', label: 'None' },
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStylingChange('padding', option.value)}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                    styling.padding === option.value
                      ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-300'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Card Border Radius */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Card Border Radius: {styling.cardBorderRadius || 8}px
            </label>
            <div className="flex items-center space-x-3">
              <CornerDownRight className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0"
                max="24"
                value={styling.cardBorderRadius || 8}
                onChange={(e) => handleStylingChange('cardBorderRadius', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                {styling.cardBorderRadius || 8}px
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Controls the rounded corners of cards and containers within this section
            </p>
          </div>

          {/* Card Opacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Card Opacity: {styling.cardOpacity || 100}%
            </label>
            <div className="flex items-center space-x-3">
              <Circle className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={styling.cardOpacity || 100}
                onChange={(e) => handleStylingChange('cardOpacity', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                {styling.cardOpacity || 100}%
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Controls the transparency of cards and containers within this section
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionStylingPanel;
