// TemplateUtils.ts
import DOMPurify from 'dompurify';

export interface Template {
  css: string;
  js: string;
  sections: { [key: string]: string };
  meta: {
    colors: { [key: string]: string };
    typography: { headings: string; body: string };
    logo?: string;
    navigation?: string[];
  };
}

/**
 * Parses a string into a Template object
 */
export const parseTemplate = (template: string | any): Template => {
  if (typeof template === 'string') {
    try {
      return JSON.parse(template) as Template;
    } catch (error) {
      console.error('Failed to parse template string', error);
      throw new Error('Invalid template format');
    }
  }
  
  if (typeof template === 'object' && template !== null) {
    return template as Template;
  }
  
  throw new Error('Invalid template format');
};

/**
 * Sanitizes HTML content for safe rendering
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ADD_TAGS: ['style', 'script'],
    ADD_ATTR: ['target', 'rel', 'data-editable'],
    ALLOW_DATA_ATTR: true,
  });
};

/**
 * Combines sections into a single HTML string
 */
export const combineSections = (template: Template): string => {
  const sections = template.sections || {};
  return Object.entries(sections)
    .map(([id, content]) => {
      // Wrap sections with identifiable containers
      return `<section id="${id}" class="template-section" data-section-id="${id}">${content}</section>`;
    })
    .join('\n');
};

/**
 * Enhances HTML with editable attributes for the editor
 */
export const makeHtmlEditable = (html: string): string => {
  // This is a simplified version - a real implementation would use a DOM parser
  return html
    .replace(/<h[1-6]([^>]*)>/g, '<h$1 data-editable="true">')
    .replace(/<p([^>]*)>/g, '<p$1 data-editable="true">')
    .replace(/<a([^>]*)>/g, '<a$1 data-editable="true">')
    .replace(/<img([^>]*)>/g, '<img$1 data-editable="true">')
    .replace(/<button([^>]*)>/g, '<button$1 data-editable="true">')
    .replace(/<div class="([^"]*)"([^>]*)>/g, '<div class="$1" data-editable="true"$2>');
};

/**
 * Extracts script tags from HTML and returns them separately
 */
export const extractScripts = (html: string): { cleanHtml: string; scripts: string[] } => {
  const scripts: string[] = [];
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  
  const cleanHtml = html.replace(scriptRegex, (match, scriptContent) => {
    scripts.push(scriptContent.trim());
    return '';
  });
  
  return { cleanHtml, scripts };
};

/**
 * Combines base CSS with template CSS
 */
export const combineCSS = (baseCSS: string, templateCSS: string): string => {
  return `${baseCSS}\n${templateCSS}`;
};

/**
 * Maps HTML tag names to Tailwind classes for consistent styling
 */
export const getTagDefaultClasses = (tagName: string): string => {
  const classMap: Record<string, string> = {
    h1: 'text-4xl font-bold mb-6 text-gray-900',
    h2: 'text-3xl font-semibold mb-5 text-gray-800',
    h3: 'text-2xl font-semibold mb-4 text-gray-800',
    h4: 'text-xl font-semibold mb-3 text-gray-800',
    h5: 'text-lg font-semibold mb-2 text-gray-800',
    h6: 'text-base font-semibold mb-2 text-gray-800',
    p: 'text-gray-600 mb-4 leading-relaxed',
    a: 'text-blue-600 hover:text-blue-800 transition-colors duration-200',
    button: 'px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm',
    img: 'max-w-full h-auto rounded-lg',
    section: 'py-12',
    div: '',
    span: '',
    ul: 'list-disc list-inside space-y-2 mb-4',
    ol: 'list-decimal list-inside space-y-2 mb-4',
    li: 'text-gray-600',
    blockquote: 'border-l-4 border-blue-500 pl-4 italic my-4',
    hr: 'my-6 border-gray-200',
    input: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    textarea: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    select: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    form: 'space-y-4',
    label: 'block text-sm font-medium text-gray-700 mb-1'
  };
  
  return classMap[tagName.toLowerCase()] || '';
};

/**
 * Apply modern design principles to dated layouts
 */
export const modernizeLayout = (html: string): string => {
  // Remove outdated practices and add modern container behavior
  return html
    .replace(/<center>/g, '<div class="flex justify-center">')
    .replace(/<\/center>/g, '</div>')
    .replace(/<table([^>]*)class="([^"]*)"/g, '<table$1class="$2 w-full border-collapse"')
    .replace(/<table(?![^>]*class=)/g, '<table class="w-full border-collapse"')
    .replace(/<td([^>]*)>/g, '<td$1 class="p-2">')
    .replace(/<div class="container"/g, '<div class="container mx-auto px-4 sm:px-6 lg:px-8"');
};

/**
 * Extracts common CSS colors from template for color palette
 */
export const extractColorPalette = (css: string): Record<string, string> => {
  const colorPalette: Record<string, string> = {};
  const hexColorRegex = /#([a-f0-9]{3,6})\b/gi;
  const rgbColorRegex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/gi;
  
  // Extract hex colors
  let match;
  while ((match = hexColorRegex.exec(css)) !== null) {
    const color = match[0];
    if (!colorPalette[color]) {
      colorPalette[color] = color;
    }
  }
  
  // Extract RGB colors
  while ((match = rgbColorRegex.exec(css)) !== null) {
    const color = match[0];
    if (!colorPalette[color]) {
      colorPalette[color] = color;
    }
  }
  
  return colorPalette;
};

/**
 * Optimizes images by adding lazy loading and responsive attributes
 */
export const optimizeImages = (html: string): string => {
  return html.replace(/<img([^>]*)>/g, (match, attrs) => {
    // Skip if already has loading or srcset attributes
    if (attrs.includes('loading=') || attrs.includes('srcset=')) {
      return match;
    }
    
    // Add lazy loading and make responsive
    return `<img${attrs} loading="lazy">`;
  });
};

/**
 * Identifies and enhances interactive elements for better UX
 */
export const enhanceInteractivity = (html: string): string => {
  // Add hover effects to buttons
  const enhancedHtml = html.replace(
    /<button([^>]*)class="([^"]*)"/g, 
    '<button$1class="$2 transition-all duration-200 hover:shadow-md"'
  );
  
  // Add focus states to inputs
  return enhancedHtml.replace(
    /<input([^>]*)class="([^"]*)"/g,
    '<input$1class="$2 focus:outline-none focus:ring-2 focus:ring-blue-500"'
  );
};

/**
 * Makes standard HTML components more accessible
 */
export const makeAccessible = (html: string): string => {
  let enhancedHtml = html;
  
  // Add ARIA labels to interactive elements without text
  enhancedHtml = enhancedHtml.replace(
    /<button([^>]*)>([^<]*)<\/button>/g, 
    (match, attrs, content) => {
      if (!content.trim() && !attrs.includes('aria-label')) {
        return `<button${attrs} aria-label="Button">${content}</button>`;
      }
      return match;
    }
  );
  
  // Add alt text to images if missing
  enhancedHtml = enhancedHtml.replace(
    /<img([^>]*)>/g,
    (match, attrs) => {
      if (!attrs.includes('alt=')) {
        return `<img${attrs} alt="Image">`;
      }
      return match;
    }
  );
  
  return enhancedHtml;
};

/**
 * Adds Tailwind CSS utility classes to a template
 */
export const applyTailwindClasses = (template: Template): Template => {
  const newTemplate = { ...template };
  
  // Process each section
  for (const [sectionId, content] of Object.entries(newTemplate.sections)) {
    // Modernize the content with Tailwind classes
    newTemplate.sections[sectionId] = content
      // Headings
      .replace(/<h1([^>]*)>/g, '<h1$1 class="text-4xl font-bold mb-6 text-gray-900">')
      .replace(/<h2([^>]*)>/g, '<h2$1 class="text-3xl font-semibold mb-5 text-gray-800">')
      .replace(/<h3([^>]*)>/g, '<h3$1 class="text-2xl font-semibold mb-4 text-gray-800">')
      .replace(/<h4([^>]*)>/g, '<h4$1 class="text-xl font-semibold mb-3 text-gray-800">')
      
      // Text and links
      .replace(/<p([^>]*)>/g, '<p$1 class="text-gray-600 mb-4 leading-relaxed">')
      .replace(/<a([^>]*)>/g, '<a$1 class="text-blue-600 hover:text-blue-800 transition-colors duration-200">')
      
      // Buttons
      .replace(/<button([^>]*)>/g, '<button$1 class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm">')
      
      // Images
      .replace(/<img([^>]*)>/g, '<img$1 class="max-w-full h-auto rounded-lg">')
      
      // Lists
      .replace(/<ul([^>]*)>/g, '<ul$1 class="list-disc list-inside space-y-2 mb-4">')
      .replace(/<ol([^>]*)>/g, '<ol$1 class="list-decimal list-inside space-y-2 mb-4">')
      .replace(/<li([^>]*)>/g, '<li$1 class="text-gray-600">');
  }
  
  return newTemplate;
};

/**
 * Builds common containers and layout structures used across templates
 */
export const buildCommonStructures = () => {
  return {
    heroSection: `
      <section class="py-16 md:py-24 bg-gray-50">
        <div class="container mx-auto px-4">
          <div class="max-w-3xl mx-auto text-center">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Page Title</h1>
            <p class="text-xl text-gray-600 mb-8">Subtitle text goes here</p>
            <div class="flex flex-wrap justify-center gap-4">
              <button class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm">Primary CTA</button>
              <button class="px-6 py-3 bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 rounded-lg transition-colors duration-200">Secondary CTA</button>
            </div>
          </div>
        </div>
      </section>
    `,
    
    featuresSection: `
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-semibold text-center mb-12">Features</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="p-6 bg-gray-50 rounded-lg">
              <h3 class="text-xl font-semibold mb-3">Feature 1</h3>
              <p class="text-gray-600">Feature description goes here</p>
            </div>
            <div class="p-6 bg-gray-50 rounded-lg">
              <h3 class="text-xl font-semibold mb-3">Feature 2</h3>
              <p class="text-gray-600">Feature description goes here</p>
            </div>
            <div class="p-6 bg-gray-50 rounded-lg">
              <h3 class="text-xl font-semibold mb-3">Feature 3</h3>
              <p class="text-gray-600">Feature description goes here</p>
            </div>
          </div>
        </div>
      </section>
    `,
    
    contactForm: `
      <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <div class="max-w-xl mx-auto">
            <h2 class="text-3xl font-semibold text-center mb-8">Contact Us</h2>
            <form class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
              </div>
              <button type="submit" class="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    `
  };
};