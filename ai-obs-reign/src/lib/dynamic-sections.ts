/* eslint-disable @typescript-eslint/no-unused-vars */
// Dynamic section types and interfaces

export type SectionLayout = 'hero' | 'bento' | 'grid' | 'columns' | 'divider' | 'image' | 'code' | 'gallery' | 'form' | 'social-feed' | 'charts' | 'video';

export interface SectionField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'rich-text' | 'image' | 'link' | 'select' | 'boolean' | 'list' | 'number' | 'url';
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select type
  defaultValue?: unknown;
}

export interface SectionStyling {
  backgroundColor: string; // Color ID from site config
  backgroundImage?: string; // URL to background image
  imageOpacity?: number; // 0-100, opacity of background image
  enableParallax?: boolean; // Enable parallax effect for background image
  textColor?: 'light' | 'dark' | 'auto'; // Text color theme
  padding?: 'none' | 'small' | 'medium' | 'large'; // Section padding
  cardBorderRadius?: number; // 0-24, border radius for cards/containers
  cardOpacity?: number; // 0-100, opacity for cards/containers
}

export interface DynamicSection {
  id: string;
  name: string;
  layout: SectionLayout;
  order: number;
  isVisible: boolean;
  includeInNavigation: boolean; // Whether to show in header navigation
  navigationLabel?: string; // Custom label for navigation (defaults to name)
  fields: Record<string, unknown>; // Actual content values
  schema: SectionField[]; // Field definitions
  styling: SectionStyling; // Visual styling options
  createdAt: string;
  updatedAt: string;
}

export interface SectionTemplate {
  layout: SectionLayout;
  name: string;
  description: string;
  icon: string;
  preview?: string;
  defaultFields: SectionField[];
}

// Section templates
export const SECTION_TEMPLATES: SectionTemplate[] = [
  {
    layout: 'hero',
    name: 'Hero Section',
    description: 'Full-width hero section with title, description, and CTAs',
    icon: 'Layout',
    defaultFields: [
      { name: 'badge', label: 'Badge Text', type: 'text', placeholder: 'e.g., New Feature' },
      { name: 'title', label: 'Main Title', type: 'text', required: true },
      { name: 'subtitle', label: 'Subtitle', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'primaryCta', label: 'Primary CTA Text', type: 'text' },
      { name: 'primaryCtaLink', label: 'Primary CTA Link', type: 'link' },
      { name: 'secondaryCta', label: 'Secondary CTA Text', type: 'text' },
      { name: 'secondaryCtaLink', label: 'Secondary CTA Link', type: 'link' },
      { name: 'backgroundImage', label: 'Background Image', type: 'image' },
    ]
  },
  {
    layout: 'bento',
    name: 'Bento Grid',
    description: 'Modern bento box layout with mixed-size cards',
    icon: 'Grid3x3',
    defaultFields: [
      { name: 'title', label: 'Section Title', type: 'text', required: true },
      { name: 'subtitle', label: 'Section Subtitle', type: 'text' },
      {
        name: 'cards',
        label: 'Bento Cards',
        type: 'list',
        defaultValue: [
          {
            size: 'large', // large, medium, small
            title: '',
            description: '',
            icon: '🎯',
            color: 'blue',
            image: ''
          }
        ]
      }
    ]
  },
  {
    layout: 'grid',
    name: 'Feature Grid',
    description: 'Evenly spaced grid layout for features or services',
    icon: 'LayoutGrid',
    defaultFields: [
      { name: 'title', label: 'Section Title', type: 'text', required: true },
      { name: 'subtitle', label: 'Section Subtitle', type: 'text' },
      { name: 'description', label: 'Section Description', type: 'textarea' },
      {
        name: 'columns',
        label: 'Columns per Row',
        type: 'select',
        options: ['2', '3', '4'],
        defaultValue: '3'
      },
      {
        name: 'items',
        label: 'Grid Items',
        type: 'list',
        defaultValue: [
          {
            icon: '🎯',
            title: '',
            description: '',
            link: ''
          }
        ]
      }
    ]
  },
  {
    layout: 'columns',
    name: 'Two Column Layout',
    description: 'Side-by-side layout with text and media',
    icon: 'Columns',
    defaultFields: [
      { name: 'title', label: 'Section Title', type: 'text', required: true },
      { name: 'subtitle', label: 'Section Subtitle', type: 'text' },
      {
        name: 'layout',
        label: 'Layout Direction',
        type: 'select',
        options: ['text-left', 'text-right'],
        defaultValue: 'text-left'
      },
      { name: 'content', label: 'Main Content', type: 'rich-text', required: true },
      { name: 'image', label: 'Featured Image', type: 'image' },
      { name: 'imageAlt', label: 'Image Alt Text', type: 'text' },
      { name: 'ctaText', label: 'CTA Button Text', type: 'text' },
      { name: 'ctaLink', label: 'CTA Button Link', type: 'link' },
      {
        name: 'features',
        label: 'Feature List',
        type: 'list',
        defaultValue: [        ]
      }
    ]
  },
  {
    layout: 'divider',
    name: 'Divider Section',
    description: 'Text divider with customizable alignment and optional line',
    icon: 'Minus',
    defaultFields: [
      { name: 'text', label: 'Divider Text', type: 'text' },
      { 
        name: 'alignment', 
        label: 'Text Alignment', 
        type: 'select', 
        options: ['left', 'center', 'right'], 
        defaultValue: 'center' 
      },
      { name: 'showLine', label: 'Show Divider Line', type: 'boolean', defaultValue: true },
      { 
        name: 'lineStyle', 
        label: 'Line Style', 
        type: 'select', 
        options: ['solid', 'dashed', 'dotted'], 
        defaultValue: 'solid' 
      }
    ]
  },
  {
    layout: 'image',
    name: 'Image Section',
    description: 'Full-width or contained image with adjustable dimensions',
    icon: 'Image',
    defaultFields: [
      { name: 'image', label: 'Image URL', type: 'image', required: true },
      { name: 'alt', label: 'Alt Text', type: 'text', required: true },
      { name: 'caption', label: 'Caption', type: 'text' },
      { 
        name: 'size', 
        label: 'Image Size', 
        type: 'select', 
        options: ['small', 'medium', 'large', 'full'], 
        defaultValue: 'large' 
      },
      { 
        name: 'alignment', 
        label: 'Alignment', 
        type: 'select', 
        options: ['left', 'center', 'right'], 
        defaultValue: 'center' 
      },
      { name: 'link', label: 'Link URL (optional)', type: 'link' }
    ]
  },
  {
    layout: 'code',
    name: 'Code Block',
    description: 'Syntax-highlighted code block with language selection',
    icon: 'Code',
    defaultFields: [
      { name: 'title', label: 'Code Block Title', type: 'text' },
      { name: 'code', label: 'Code Content', type: 'textarea', required: true },
      { 
        name: 'language', 
        label: 'Programming Language', 
        type: 'select', 
        options: ['javascript', 'typescript', 'python', 'bash', 'json', 'yaml', 'sql', 'html', 'css'], 
        defaultValue: 'javascript' 
      },
      { name: 'showLineNumbers', label: 'Show Line Numbers', type: 'boolean', defaultValue: true },
      { name: 'allowCopy', label: 'Allow Copy to Clipboard', type: 'boolean', defaultValue: true }
    ]
  },
  {
    layout: 'gallery',
    name: 'Image Gallery',
    description: 'Grid layout for multiple images with lightbox support',
    icon: 'Images',
    defaultFields: [
      { name: 'title', label: 'Gallery Title', type: 'text' },
      { name: 'description', label: 'Gallery Description', type: 'textarea' },
      { 
        name: 'columns', 
        label: 'Columns per Row', 
        type: 'select', 
        options: ['2', '3', '4', '5'], 
        defaultValue: '3' 
      },
      {
        name: 'images',
        label: 'Gallery Images',
        type: 'list',
        defaultValue: [
          {
            url: '',
            alt: '',
            caption: ''
          }
        ]
      },
      { name: 'enableLightbox', label: 'Enable Lightbox', type: 'boolean', defaultValue: true }
    ]
  },
  {
    layout: 'form',
    name: 'Contact Form',
    description: 'Customizable contact form with field configuration',
    icon: 'FileText',
    defaultFields: [
      { name: 'title', label: 'Form Title', type: 'text', required: true },
      { name: 'description', label: 'Form Description', type: 'textarea' },
      {
        name: 'fields',
        label: 'Form Fields',
        type: 'list',
        defaultValue: [
          {
            name: 'name',
            label: 'Full Name',
            type: 'text',
            required: true,
            placeholder: 'Enter your name'
          },
          {
            name: 'email',
            label: 'Email Address',
            type: 'email',
            required: true,
            placeholder: 'Enter your email'
          },
          {
            name: 'message',
            label: 'Message',
            type: 'textarea',
            required: true,
            placeholder: 'Enter your message'
          }
        ]
      },
      { name: 'submitText', label: 'Submit Button Text', type: 'text', defaultValue: 'Send Message' },
      { name: 'successMessage', label: 'Success Message', type: 'text', defaultValue: 'Thank you! Your message has been sent.' }
    ]
  },
  {
    layout: 'social-feed',
    name: 'Social Media Feed',
    description: 'Display social media posts from LinkedIn, X/Twitter, or other platforms',
    icon: 'Share2',
    defaultFields: [
      { name: 'title', label: 'Section Title', type: 'text', required: true },
      { name: 'subtitle', label: 'Section Subtitle', type: 'text' },
      { 
        name: 'platform', 
        label: 'Social Platform', 
        type: 'select', 
        options: ['linkedin', 'twitter', 'instagram', 'facebook'], 
        defaultValue: 'linkedin' 
      },
      { name: 'username', label: 'Username/Handle', type: 'text', required: true, placeholder: '@username or company-name' },
      { name: 'socialMediaUrl', label: 'Social Media URL (optional)', type: 'url', placeholder: 'https://linkedin.com/in/username' },
      { 
        name: 'postCount', 
        label: 'Number of Posts', 
        type: 'number', 
        defaultValue: 6 
      },
      { 
        name: 'layout', 
        label: 'Layout Style', 
        type: 'select', 
        options: ['grid', 'carousel', 'timeline'], 
        defaultValue: 'grid' 
      },
      { name: 'showProfile', label: 'Show Profile Info', type: 'boolean', defaultValue: true },
      { name: 'showEngagement', label: 'Show Likes/Comments', type: 'boolean', defaultValue: true },
      { name: 'autoRefresh', label: 'Auto Refresh Feed', type: 'boolean', defaultValue: false }
    ]
  },
  {
    layout: 'charts',
    name: 'Charts & Analytics',
    description: 'Interactive charts and graphs powered by Google Sheets data',
    icon: 'BarChart3',
    defaultFields: [
      { name: 'title', label: 'Section Title', type: 'text', required: true },
      { name: 'subtitle', label: 'Section Subtitle', type: 'text' },
      { 
        name: 'chartType', 
        label: 'Chart Type', 
        type: 'select', 
        options: ['bar', 'line', 'pie', 'area', 'scatter', 'donut', 'gauge'], 
        defaultValue: 'bar' 
      },
      { name: 'googleSheetUrl', label: 'Google Sheets URL', type: 'url', required: true, placeholder: 'https://docs.google.com/spreadsheets/d/...' },
      { name: 'sheetName', label: 'Sheet Name', type: 'text', defaultValue: 'Sheet1' },
      { name: 'dataRange', label: 'Data Range', type: 'text', placeholder: 'A1:C10' },
      { 
        name: 'chartHeight', 
        label: 'Chart Height (px)', 
        type: 'number', 
        defaultValue: 400 
      },
      { name: 'showLegend', label: 'Show Legend', type: 'boolean', defaultValue: true },
      { name: 'showTooltips', label: 'Show Tooltips', type: 'boolean', defaultValue: true },
      { name: 'animation', label: 'Enable Animations', type: 'boolean', defaultValue: true },
      { 
        name: 'refreshInterval', 
        label: 'Auto Refresh (minutes)', 
        type: 'number', 
        defaultValue: 0,
        placeholder: '0 = no auto refresh'
      },
      { name: 'enableAI', label: 'Enable AI Analysis', type: 'boolean', defaultValue: true }
    ]
  },
  {
    layout: 'video',
    name: 'Video Section',
    description: 'Embed videos from YouTube, Vimeo, or upload custom videos',
    icon: 'Play',
    defaultFields: [
      { name: 'title', label: 'Section Title', type: 'text' },
      { name: 'subtitle', label: 'Section Subtitle', type: 'text' },
      { 
        name: 'videoType', 
        label: 'Video Source', 
        type: 'select', 
        options: ['youtube', 'vimeo', 'upload', 'url'], 
        defaultValue: 'youtube' 
      },
      { name: 'videoUrl', label: 'Video URL', type: 'url', placeholder: 'YouTube/Vimeo URL or direct video URL' },
      { name: 'videoFile', label: 'Upload Video File', type: 'image' }, // Using image type for file upload
      { 
        name: 'aspectRatio', 
        label: 'Aspect Ratio', 
        type: 'select', 
        options: ['16:9', '4:3', '1:1', '21:9'], 
        defaultValue: '16:9' 
      },
      { name: 'autoplay', label: 'Autoplay Video', type: 'boolean', defaultValue: false },
      { name: 'muted', label: 'Start Muted', type: 'boolean', defaultValue: true },
      { name: 'loop', label: 'Loop Video', type: 'boolean', defaultValue: false },
      { name: 'showControls', label: 'Show Video Controls', type: 'boolean', defaultValue: true },
      { name: 'posterImage', label: 'Poster Image (thumbnail)', type: 'image' },
      { name: 'caption', label: 'Video Caption', type: 'text' }
    ]
  }
];

// Helper functions
export function createSection(template: SectionTemplate, name: string): DynamicSection {
  const now = new Date().toISOString();
  const fields: Record<string, unknown> = {};
  
  // Initialize fields with default values
  template.defaultFields.forEach(field => {
    fields[field.name] = field.defaultValue || '';
  });
  
  // Default styling based on section type
  const getDefaultStyling = (layout: SectionLayout): SectionStyling => {
    switch (layout) {
      case 'hero':
        return {
          backgroundColor: 'gradient-dark',
          backgroundImage: '/bg.jpg',
          imageOpacity: 40,
          enableParallax: true,
          textColor: 'light',
          padding: 'large',
          cardBorderRadius: 12,
          cardOpacity: 100
        };
      case 'bento':
        return {
          backgroundColor: 'gray-900',
          imageOpacity: 20,
          textColor: 'light',
          padding: 'large',
          cardBorderRadius: 16,
          cardOpacity: 95
        };
      case 'grid':
        return {
          backgroundColor: 'gray-50',
          textColor: 'auto',
          padding: 'large',
          cardBorderRadius: 8,
          cardOpacity: 100
        };
      case 'columns':
        return {
          backgroundColor: 'white',
          textColor: 'auto',
          padding: 'large',
          cardBorderRadius: 12,
          cardOpacity: 100
        };
      case 'divider':
        return {
          backgroundColor: 'white',
          textColor: 'auto',
          padding: 'small',
          cardBorderRadius: 0,
          cardOpacity: 100
        };
      case 'image':
        return {
          backgroundColor: 'white',
          textColor: 'auto',
          padding: 'medium',
          cardBorderRadius: 8,
          cardOpacity: 100
        };
      case 'code':
        return {
          backgroundColor: 'gray-900',
          textColor: 'light',
          padding: 'medium',
          cardBorderRadius: 8,
          cardOpacity: 100
        };
      case 'gallery':
        return {
          backgroundColor: 'gray-50',
          textColor: 'auto',
          padding: 'large',
          cardBorderRadius: 12,
          cardOpacity: 100
        };
      case 'form':
        return {
          backgroundColor: 'white',
          textColor: 'auto',
          padding: 'large',
          cardBorderRadius: 16,
          cardOpacity: 100
        };
      case 'social-feed':
        return {
          backgroundColor: 'gray-50',
          textColor: 'auto',
          padding: 'large',
          cardBorderRadius: 12,
          cardOpacity: 100
        };
      case 'charts':
        return {
          backgroundColor: 'white',
          textColor: 'auto',
          padding: 'large',
          cardBorderRadius: 12,
          cardOpacity: 100
        };
      case 'video':
        return {
          backgroundColor: 'gray-900',
          textColor: 'light',
          padding: 'large',
          cardBorderRadius: 12,
          cardOpacity: 100
        };
      default:
        return {
          backgroundColor: 'white',
          textColor: 'auto',
          padding: 'medium',
          cardBorderRadius: 8,
          cardOpacity: 100
        };
    }
  };
  
  return {
    id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    layout: template.layout,
    order: 0, // Will be set based on existing sections
    isVisible: true,
    includeInNavigation: false, // Default to false, user can enable
    fields,
    schema: template.defaultFields,
    styling: getDefaultStyling(template.layout),
    createdAt: now,
    updatedAt: now
  };
}

export function validateSectionFields(section: DynamicSection): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  section.schema.forEach(field => {
    const value = section.fields[field.name];
    
    if (field.required && (!value || value === '')) {
      errors.push(`${field.label} is required`);
    }
    
    // Add more validation as needed
    if (field.type === 'link' && value && typeof value === 'string' && !isValidUrl(value)) {
      errors.push(`${field.label} must be a valid URL`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    // Also allow relative URLs
    return string.startsWith('/') || string.startsWith('#');
  }
}
