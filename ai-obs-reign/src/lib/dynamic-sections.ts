// Dynamic section types and interfaces

export type SectionLayout = 'hero' | 'bento' | 'grid' | 'columns' | 'divider' | 'image' | 'code' | 'gallery' | 'form';

export interface SectionField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'rich-text' | 'image' | 'link' | 'select' | 'boolean' | 'list';
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select type
  defaultValue?: any;
}

export interface SectionStyling {
  backgroundColor: string; // Color ID from site config
  backgroundImage?: string; // URL to background image
  imageOpacity?: number; // 0-100, opacity of background image
  enableParallax?: boolean; // Enable parallax effect for background image
  textColor?: 'light' | 'dark' | 'auto'; // Text color theme
  padding?: 'none' | 'small' | 'medium' | 'large'; // Section padding
}

export interface DynamicSection {
  id: string;
  name: string;
  layout: SectionLayout;
  order: number;
  isVisible: boolean;
  includeInNavigation: boolean; // Whether to show in header navigation
  navigationLabel?: string; // Custom label for navigation (defaults to name)
  fields: Record<string, any>; // Actual content values
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
            icon: '',
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
            icon: '',
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
  }
];

// Helper functions
export function createSection(template: SectionTemplate, name: string): DynamicSection {
  const now = new Date().toISOString();
  const fields: Record<string, any> = {};
  
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
          padding: 'large'
        };
      case 'bento':
        return {
          backgroundColor: 'gray-900',
          imageOpacity: 20,
          textColor: 'light',
          padding: 'large'
        };
      case 'grid':
        return {
          backgroundColor: 'gray-50',
          textColor: 'auto',
          padding: 'large'
        };
      case 'columns':
        return {
          backgroundColor: 'white',
          textColor: 'auto',
          padding: 'large'
        };
      case 'divider':
        return {
          backgroundColor: 'white',
          textColor: 'auto',
          padding: 'small'
        };
      case 'image':
        return {
          backgroundColor: 'white',
          textColor: 'auto',
          padding: 'medium'
        };
      case 'code':
        return {
          backgroundColor: 'gray-900',
          textColor: 'light',
          padding: 'medium'
        };
      case 'gallery':
        return {
          backgroundColor: 'gray-50',
          textColor: 'auto',
          padding: 'large'
        };
      case 'form':
        return {
          backgroundColor: 'white',
          textColor: 'auto',
          padding: 'large'
        };
      default:
        return {
          backgroundColor: 'white',
          textColor: 'auto',
          padding: 'medium'
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
    if (field.type === 'link' && value && !isValidUrl(value)) {
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
