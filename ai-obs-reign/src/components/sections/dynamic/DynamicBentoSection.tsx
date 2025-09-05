'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { DynamicSection } from '@/lib/dynamic-sections';

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
  onUpdate?: (fields: Record<string, any>) => void;
}

const DynamicBentoSection: React.FC<DynamicBentoSectionProps> = ({ section, isEditMode = false, onUpdate }) => {
  const { fields } = section;
  const cards = (fields.cards as BentoCard[]) || [];

  const handleFieldChange = (fieldName: string, value: any) => {
    if (onUpdate) {
      onUpdate({ ...fields, [fieldName]: value });
    }
  };

  const handleCardChange = (index: number, cardField: string, value: any) => {
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
      blue: 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20',
      purple: 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20',
      green: 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20',
      orange: 'bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20',
      pink: 'bg-pink-500/10 border-pink-500/20 hover:bg-pink-500/20',
    };
    return colors[color] || colors.blue;
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {isEditMode ? (
              <input
                type="text"
                value={fields.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-blue-400"
                placeholder="Section title"
              />
            ) : (
              fields.title || 'Bento Section'
            )}
          </h2>

          {(fields.subtitle || isEditMode) && (
            <p className="text-xl text-gray-400">
              {isEditMode ? (
                <input
                  type="text"
                  value={fields.subtitle || ''}
                  onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-gray-400 outline-none focus:border-blue-400"
                  placeholder="Section subtitle (optional)"
                />
              ) : (
                fields.subtitle
              )}
            </p>
          )}
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`relative ${getSizeClasses(card.size)} ${getColorClasses(card.color)} border rounded-2xl p-6 transition-all duration-300 group`}
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
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-semibold text-white mb-2">
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

                <p className="text-gray-300 text-sm flex-1">
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
              className="col-span-1 row-span-1 border-2 border-dashed border-gray-600 rounded-2xl flex items-center justify-center hover:border-gray-500 hover:bg-gray-800/50 transition-colors"
            >
              <div className="text-center">
                <Plus className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <span className="text-gray-500 text-sm">Add Card</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default DynamicBentoSection;
