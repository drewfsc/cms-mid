/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { DynamicSection } from '@/lib/dynamic-sections';
import EmojiPicker from '@/components/ui/EmojiPicker';

interface BentoCard {
  size: 'large' | 'medium' | 'small';
  title: string;
  description: string;
  icon?: string;
  color: string;
  image?: string;
}

interface DynamicBentoSectionProps {
  section: DynamicSection;
  isEditMode?: boolean;
  onUpdate?: (fields: Record<string, unknown>) => void;
}

const DynamicBentoSection: React.FC<DynamicBentoSectionProps> = ({ section, isEditMode = false, onUpdate }) => {
  const { fields, styling } = section;
  const cards = (fields.cards as BentoCard[]) || [];
  
  // Provide fallback styling if not defined
  const fallbackStyling = {
    backgroundColor: 'gray-900',
    imageOpacity: 20,
    textColor: 'light' as const,
    padding: 'large' as const,
    cardBorderRadius: 16,
    cardOpacity: 95
  };
  
  const sectionStyling = styling || fallbackStyling;

  const handleFieldChange = (fieldName: string, value: unknown) => {
    if (onUpdate) {
      onUpdate({ ...fields, [fieldName]: value });
    }
  };

  const handleCardChange = (index: number, cardField: string, value: unknown) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [cardField]: value };
    handleFieldChange('cards', newCards);
  };

  const addCard = () => {
    const newCard: BentoCard = {
      size: 'medium',
      title: 'New Card',
      description: 'Card description',
      color: 'blue',
      icon: ''
    };
    handleFieldChange('cards', [...cards, newCard]);
  };

  const removeCard = (index: number) => {
    const newCards = cards.filter((_, i) => i !== index);
    handleFieldChange('cards', newCards);
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'large':
        return 'col-span-2 row-span-2';
      case 'small':
        return 'col-span-1 row-span-1';
      default:
        return 'col-span-1 row-span-1 md:col-span-2';
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 shadow-neumorphic hover:shadow-neumorphic-hover',
      purple: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 shadow-neumorphic hover:shadow-neumorphic-hover',
      green: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 shadow-neumorphic hover:shadow-neumorphic-hover',
      orange: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 shadow-neumorphic hover:shadow-neumorphic-hover',
      pink: 'bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 shadow-neumorphic hover:shadow-neumorphic-hover',
    };
    return colors[color] || colors.blue;
  };

  const getBackgroundColorWithOpacity = (color: string, opacity: number) => {
    const opacityValue = opacity / 100;
    const colors: Record<string, string> = {
      blue: `linear-gradient(to bottom right, rgba(59, 130, 246, ${opacityValue}), rgba(37, 99, 235, ${opacityValue}))`,
      purple: `linear-gradient(to bottom right, rgba(147, 51, 234, ${opacityValue}), rgba(126, 34, 206, ${opacityValue}))`,
      green: `linear-gradient(to bottom right, rgba(34, 197, 94, ${opacityValue}), rgba(22, 163, 74, ${opacityValue}))`,
      orange: `linear-gradient(to bottom right, rgba(249, 115, 22, ${opacityValue}), rgba(234, 88, 12, ${opacityValue}))`,
      pink: `linear-gradient(to bottom right, rgba(236, 72, 153, ${opacityValue}), rgba(219, 39, 119, ${opacityValue}))`,
    };
    return colors[color] || colors.blue;
  };

  return (
    <section id={section.id} className="py-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {isEditMode ? (
              <input
                type="text"
                value={String(fields.title || '')}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-blue-400"
                placeholder="Section title"
              />
            ) : (
              String(fields.title || 'Bento Section')
            )}
          </h2>

          {(fields.subtitle || isEditMode) && (
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {isEditMode ? (
                <input
                  type="text"
                  value={String(fields.subtitle || '')}
                  onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-gray-400 outline-none focus:border-blue-400"
                  placeholder="Section subtitle (optional)"
                />
              ) : (
                String(fields.subtitle || '')
              )}
            </p>
          )}
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`relative ${getSizeClasses(card.size)} transition-all duration-300 group border-0 shadow-neumorphic hover:shadow-neumorphic-hover`}
              style={{
                borderRadius: `${sectionStyling.cardBorderRadius || 16}px`,
                background: getBackgroundColorWithOpacity(card.color, sectionStyling.cardOpacity || 95)
              }}
            >
              {isEditMode && (
                <button
                  onClick={() => removeCard(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500/20 text-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* Card Content */}
              <div className="h-full flex flex-col p-6">
                {/* Icon */}
                {card.icon && (
                  <div className="text-2xl mb-2">
                    {isEditMode ? (
                      <EmojiPicker
                        value={card.icon}
                        onChange={(emoji) => handleCardChange(index, 'icon', emoji)}
                        placeholder="Select icon"
                        className="w-12"
                      />
                    ) : (
                      <span>{card.icon}</span>
                    )}
                  </div>
                )}
                
                {/* Icon picker when no icon is set */}
                {isEditMode && !card.icon && (
                  <div className="mb-2">
                    <EmojiPicker
                      value=""
                      onChange={(emoji) => handleCardChange(index, 'icon', emoji)}
                      placeholder="Add icon"
                      className="w-12"
                    />
                  </div>
                )}

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => handleCardChange(index, 'title', e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded px-2 py-1 text-white outline-none focus:border-blue-400"
                      placeholder="Card title"
                    />
                  ) : (
                    card.title
                  )}
                </h3>

                <p className="text-gray-700 dark:text-gray-300 text-sm flex-1">
                  {isEditMode ? (
                    <textarea
                      value={card.description}
                      onChange={(e) => handleCardChange(index, 'description', e.target.value)}
                      className="w-full h-full bg-gray-800/50 border border-gray-600 rounded px-2 py-1 text-gray-300 outline-none focus:border-blue-400 resize-none"
                      placeholder="Card description"
                    />
                  ) : (
                    card.description
                  )}
                </p>

                {isEditMode && (
                  <div className="mt-2 flex gap-2">
                    <select
                      value={card.size}
                      onChange={(e) => handleCardChange(index, 'size', e.target.value)}
                      className="bg-gray-800/50 border border-gray-600 rounded px-2 py-1 text-xs text-white"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>

                    <select
                      value={card.color}
                      onChange={(e) => handleCardChange(index, 'color', e.target.value)}
                      className="bg-gray-800/50 border border-gray-600 rounded px-2 py-1 text-xs text-white"
                    >
                      <option value="blue">Blue</option>
                      <option value="purple">Purple</option>
                      <option value="green">Green</option>
                      <option value="orange">Orange</option>
                      <option value="pink">Pink</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Background decoration */}
              {card.image && (
                <div
                  className="absolute inset-0 opacity-10 rounded-2xl"
                  style={{
                    backgroundImage: `url(${card.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
              )}
            </div>
          ))}

          {/* Add Card Button */}
          {isEditMode && (
            <button
              onClick={addCard}
              className="col-span-1 row-span-1 shadow-neumorphic hover:shadow-neumorphic-hover transition-all duration-300 border-0 flex items-center justify-center"
              style={{
                borderRadius: `${sectionStyling.cardBorderRadius || 16}px`,
                background: `linear-gradient(to bottom right, rgba(209, 213, 219, ${(sectionStyling.cardOpacity || 95) / 100}), rgba(156, 163, 175, ${(sectionStyling.cardOpacity || 95) / 100}))`
              }}
            >
              <div className="text-center">
                <Plus className="w-8 h-8 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">Add Card</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default DynamicBentoSection;
