// Dynamic section types and interfaces

export type SectionLayout = 'hero' | 'bento' | 'grid' | 'columns';

export interface SectionField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'rich-text' | 'image' | 'link' | 'select' | 'boolean' | 'list';
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select type
  defaultValue?: any;
}

export interface DynamicSection {
  id: string;
  name: string;
  layout: SectionLayout;
  order: number;
  isVisible: boolean;
  fields: Record<string, any>; // Actual content values
  schema: SectionField[]; // Field definitions
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
        defaultValue: []
      }
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
  
  return {
    id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    layout: template.layout,
    order: 0, // Will be set based on existing sections
    isVisible: true,
    fields,
    schema: template.defaultFields,
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
