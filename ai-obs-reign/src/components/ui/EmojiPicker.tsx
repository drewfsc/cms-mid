'use client';


import React, { useState } from 'react';
import { ChevronDown, Smile } from 'lucide-react';

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  placeholder?: string;
  className?: string;
}

const PREDEFINED_EMOJIS = [
  '🦺', '🎯', '🧩', '📢', '⚖️', '💻', '📊', '⌚', '🚩', '💯', '🕘', '🎯', '🥇', '🔒', '💬', '🗣️'
];

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  value,
  onChange,
  placeholder = 'Select emoji',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customEmoji, setCustomEmoji] = useState('');

  const handleEmojiSelect = (emoji: string) => {
    onChange(emoji);
    setIsOpen(false);
  };

  const handleCustomEmojiSubmit = () => {
    if (customEmoji.trim()) {
      onChange(customEmoji.trim());
      setCustomEmoji('');
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomEmojiSubmit();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white flex items-center justify-between"
      >
        <div className="flex items-center space-x-2">
          {value ? (
            <span className="text-lg">{value}</span>
          ) : (
            <Smile className="w-4 h-4 text-gray-400" />
          )}
          <span className={value ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          {/* Predefined Emojis Grid */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-600">
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Select</div>
            <div className="grid grid-cols-7 gap-2">
              {PREDEFINED_EMOJIS.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Emoji Input */}
          <div className="p-3">
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Custom Emoji</div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={customEmoji}
                onChange={(e) => setCustomEmoji(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste emoji here..."
                className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                maxLength={10}
              />
              <button
                onClick={handleCustomEmojiSubmit}
                disabled={!customEmoji.trim()}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Paste any emoji or use the quick select options above
            </p>
          </div>

          {/* Close Button */}
          <div className="p-2 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-3 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default EmojiPicker;
