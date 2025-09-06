/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { DynamicSection } from '@/lib/dynamic-sections';
import { SectionStylingUtils, useParallaxScroll } from '@/lib/section-styling';

interface DynamicCodeSectionProps {
  section: DynamicSection;
  isEditMode?: boolean;
  onUpdate?: (fields: Record<string, unknown>) => void;
}

const DynamicCodeSection: React.FC<DynamicCodeSectionProps> = ({ section, isEditMode = false, onUpdate }) => {
  const { fields, styling } = section;
  const [copied, setCopied] = useState(false);
  
  // Provide fallback styling if not defined
  const fallbackStyling = {
    backgroundColor: 'gray-900',
    textColor: 'light' as const,
    padding: 'medium' as const
  };
  
  const sectionStyling = styling || fallbackStyling;
  const scrollY = useParallaxScroll(sectionStyling.enableParallax || false);
  const { containerStyle, containerClass, backgroundImageStyle } = SectionStylingUtils.getSectionStyles(sectionStyling);

  const handleFieldChange = (fieldName: string, value: unknown) => {
    if (onUpdate) {
      onUpdate({ ...fields, [fieldName]: value });
    }
  };

  const handleCopyCode = async () => {
    if (fields.code) {
      try {
        await navigator.clipboard.writeText(String(fields.code));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    }
  };

  const formatCodeWithLineNumbers = (code: string) => {
    if (!Boolean(fields.showLineNumbers)) return code;
    
    return String(code).split('\n').map((line, index) => (
      <div key={index} className="flex">
        <span className="text-gray-500 text-sm mr-4 select-none w-8 text-right">
          {index + 1}
        </span>
        <span className="flex-1">{line}</span>
      </div>
    ));
  };

  return (
    <section 
      id={section.id}
      className={`relative ${containerClass}`}
      style={containerStyle}
    >
      {/* Background Image with Parallax */}
      {backgroundImageStyle && (
        <div
          className="absolute inset-0"
          style={{
            ...backgroundImageStyle,
            transform: sectionStyling.enableParallax 
              ? SectionStylingUtils.getParallaxTransform(scrollY, true)
              : undefined
          }}
        />
      )}
      
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-xl shadow-neumorphic overflow-hidden">
          {/* Code Header */}
          <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {(fields.title || isEditMode) && (
                <h3 className="text-lg font-semibold text-white">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={String(fields.title || '')}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white outline-none focus:border-blue-400"
                      placeholder="Code block title"
                    />
                  ) : (
                    String(fields.title || '')
                  )}
                </h3>
              )}
              
              <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
                {String(fields.language || 'javascript')}
              </span>
            </div>

            {Boolean(fields.allowCopy) && !isEditMode && Boolean(fields.code) && (
              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded text-sm transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Code Content */}
          <div className="p-6">
            {isEditMode ? (
              <textarea
                value={String(fields.code || '')}
                onChange={(e) => handleFieldChange('code', e.target.value)}
                className="w-full h-64 bg-gray-800 border border-gray-700 rounded px-4 py-3 text-green-400 font-mono text-sm outline-none focus:border-blue-400 resize-vertical"
                placeholder="Enter your code here..."
                spellCheck={false}
              />
            ) : (
              <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                <code>
                  {fields.showLineNumbers ? 
                    formatCodeWithLineNumbers(String(fields.code || '')) : 
                    String(fields.code || 'No code provided')
                  }
                </code>
              </pre>
            )}
          </div>
        </div>

        {/* Edit Mode Controls */}
        {isEditMode && (
          <div className="mt-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Programming Language
                </label>
                <select
                  value={fields.language || 'javascript'}
                  onChange={(e) => handleFieldChange('language', e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="bash">Bash/Shell</option>
                  <option value="json">JSON</option>
                  <option value="yaml">YAML</option>
                  <option value="sql">SQL</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={fields.showLineNumbers !== false}
                    onChange={(e) => handleFieldChange('showLineNumbers', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show Line Numbers
                  </span>
                </label>
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={fields.allowCopy !== false}
                    onChange={(e) => handleFieldChange('allowCopy', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Allow Copy to Clipboard
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DynamicCodeSection;
