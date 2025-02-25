// ReactTemplateRenderer.tsx
import React, { useEffect, useRef, useState } from 'react';
import parse, { DOMNode, Element, domToReact } from 'html-react-parser';
import DOMPurify from 'dompurify';
import { ErrorBoundary } from 'react-error-boundary';
import { useAuthContext } from '@/features/auth/components/AuthProvider';
import { useTheme } from '@/components/layout/ThemeContext';

interface ReactTemplateRendererProps {
  htmlContent: string;
  css?: string;
  className?: string;
  onRenderComplete?: () => void;
  // Add new props to accept values from parent
  authUser?: any;
  theme?: string;
}

// Component mapping to apply design system classes
const componentMapping: Record<string, (props: any) => JSX.Element> = {
  h1: (props) => <h1 {...props} className={`text-4xl font-bold mb-6 text-gray-900 ${props.className || ''}`} />,
  h2: (props) => <h2 {...props} className={`text-3xl font-semibold mb-5 text-gray-800 ${props.className || ''}`} />,
  h3: (props) => <h3 {...props} className={`text-2xl font-semibold mb-4 text-gray-800 ${props.className || ''}`} />,
  h4: (props) => <h4 {...props} className={`text-xl font-semibold mb-3 text-gray-800 ${props.className || ''}`} />,
  p: (props) => <p {...props} className={`text-gray-600 mb-4 leading-relaxed ${props.className || ''}`} />,
  a: (props) => (
    <a
      {...props}
      className={`text-blue-600 hover:text-blue-800 transition-colors duration-200 ${props.className || ''}`}
    />
  ),
  button: (props) => (
    <button
      {...props}
      className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm ${props.className || ''}`}
    />
  ),
  // Updated img mapping with relative path handling and fallback for broken images
  img: (props) => {
    const originalSrc = props.src;
    let src = originalSrc;

    if (originalSrc && typeof originalSrc === 'string' && !originalSrc.startsWith('http') && !originalSrc.startsWith('/')) {
      src = `/${originalSrc}`;
    }

    if (originalSrc && typeof originalSrc === 'string' && originalSrc.includes('/api/')) {
      // Images from API should already have the correct path.
      // If you need special handling for authenticated images, consider:
      // src = `${originalSrc}${originalSrc.includes('?') ? '&' : '?'}auth=${authToken}`;
    }

    return (
      <img
        {...props}
        src={src}
        loading="lazy"
        className={`max-w-full h-auto rounded-lg ${props.className || ''}`}
        alt={props.alt || 'Image'}
        onError={(e) => {
          console.warn(`Image failed to load: ${src}`);
          e.currentTarget.src = 'src/assets/images/placeholder.webp';
          e.currentTarget.alt = 'Image not available';
        }}
      />
    );
  },
  ul: (props) => <ul {...props} className={`list-disc list-inside space-y-2 mb-4 ${props.className || ''}`} />,
  ol: (props) => <ol {...props} className={`list-decimal list-inside space-y-2 mb-4 ${props.className || ''}`} />,
  li: (props) => <li {...props} className={`text-gray-600 ${props.className || ''}`} />,
  blockquote: (props) => (
    <blockquote {...props} className={`border-l-4 border-blue-500 pl-4 italic my-4 ${props.className || ''}`} />
  ),
  hr: (props) => <hr {...props} className={`my-6 border-gray-200 ${props.className || ''}`} />,
  // Form elements
  input: (props) => (
    <input
      {...props}
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${props.className || ''}`}
    />
  ),
  textarea: (props) => (
    <textarea
      {...props}
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${props.className || ''}`}
    />
  ),
  select: (props) => (
    <select
      {...props}
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${props.className || ''}`}
    />
  ),
  // Layout/sectioning
  section: (props) => <section {...props} className={`my-12 ${props.className || ''}`} />,
  div: (props) => <div {...props} />,
};

// Helper to extract class names from inline styles
const extractClasses = (style: string): Record<string, string> => {
  // Very basic style parser - in production you'd want a more robust solution
  const classes: Record<string, string> = {};
  const styleArray = style.split(';').filter(Boolean);
  
  styleArray.forEach((item) => {
    const [property, value] = item.split(':').map((s) => s.trim());
    if (property && value) {
      classes[property] = value;
    }
  });
  
  return classes;
};

// Helper to translate CSS style properties to Tailwind classes
const mapStylesToTailwind = (styles: Record<string, string>): string => {
  const classMap: Record<string, (value: string) => string> = {
    'color': (v) => {
      const colorMap: Record<string, string> = {
        '#000': 'text-black',
        '#000000': 'text-black',
        'black': 'text-black',
        '#fff': 'text-white',
        '#ffffff': 'text-white',
        'white': 'text-white',
        // Add more color mappings as needed
      };
      return colorMap[v] || '';
    },
    'font-weight': (v) => {
      const weightMap: Record<string, string> = {
        'bold': 'font-bold',
        '700': 'font-bold',
        'normal': 'font-normal',
        '400': 'font-normal',
        // Add more weight mappings as needed
      };
      return weightMap[v] || '';
    },
    // Add more style property mappings as needed
  };

  return Object.entries(styles)
    .map(([prop, value]) => (classMap[prop] ? classMap[prop](value) : ''))
    .filter(Boolean)
    .join(' ');
};

// Custom parser options
const createParserOptions = () => {
  return {
    replace: (domNode: DOMNode) => {
      if (domNode instanceof Element) {
        const { name, attribs, children } = domNode;
        
        // Convert 'class' attribute to 'className'
        if (attribs.class) {
          attribs.className = attribs.class;
          delete attribs.class;
        }
        
        const ComponentOverride = componentMapping[name];

        if (ComponentOverride) {
          // Extract style attribute to convert to Tailwind classes if needed
          let additionalClasses = '';
          if (attribs.style) {
            const styles = extractClasses(attribs.style);
            additionalClasses = mapStylesToTailwind(styles);
            delete attribs.style; // Remove inline styles
          }

          // Combine existing classes with additional Tailwind classes
          const className = `${attribs.className || ''} ${additionalClasses}`.trim();
          const props = {
            ...attribs,
            className: className || undefined,
            children: children.length > 0 ? domToReact(children, createParserOptions()) : null,
          };

          return <ComponentOverride {...props} />;
        }
      }

      return undefined;
    },
  };
};

// Style component for injecting custom CSS
const StyleInjector: React.FC<{ css: string }> = ({ css }) => {
  return <style dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(css) }} />;
};

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  return (
    <div className="p-6 border border-red-300 bg-red-50 rounded-lg">
      <h3 className="text-lg font-semibold text-red-800 mb-2">Error Rendering Template</h3>
      <p className="text-red-600 mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
      >
        Try Again
      </button>
    </div>
  );
};

// Main component
export const ReactTemplateRenderer: React.FC<ReactTemplateRendererProps> = ({
  htmlContent,
  css = '',
  className = '',
  onRenderComplete,
  authUser, // Use the prop passed from parent
  theme: propTheme, // Use the prop passed from parent with alias to avoid naming conflict
}) => {
  const [sanitizedHtml, setSanitizedHtml] = useState('');
  
  // Try to access contexts with fallback to props
  let auth = { user: authUser, isAuthenticated: !!authUser, isLoading: false };
  let effectiveTheme = propTheme || 'light';
  
  try {
    // Try to access auth context as fallback if prop not provided
    const contextAuth = useAuthContext();
    if (contextAuth && !authUser) {
      auth = contextAuth;
    }
  } catch (error) {
    console.warn('Using provided authUser prop instead of context');
  }
  
  try {
    // Try to access theme context as fallback if prop not provided
    const contextTheme = useTheme();
    if (contextTheme && !propTheme) {
      effectiveTheme = contextTheme.theme;
    }
  } catch (error) {
    console.warn('Using provided theme prop instead of context');
  }

  useEffect(() => {
    if (htmlContent) {
      // Sanitize HTML to prevent XSS
      const clean = DOMPurify.sanitize(htmlContent, {
        ADD_TAGS: ['style'],
        ADD_ATTR: ['target', 'rel'],
        FORBID_TAGS: ['script'],
        FORBID_ATTR: ['onerror', 'onload'],
        WHOLE_DOCUMENT: false,
        RETURN_DOM: false,
        USE_PROFILES: { html: true }
      });
      setSanitizedHtml(clean);
      
      // Notify parent when rendering is complete
      onRenderComplete?.();
    }
  }, [htmlContent, onRenderComplete]);

  const resetErrorState = () => {
    // Reset any error state here if needed
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={resetErrorState}>
      <div className={`template-render-container ${className}`} data-theme={effectiveTheme}>
        {css && <StyleInjector css={css} />}
        {sanitizedHtml ? parse(sanitizedHtml, createParserOptions()) : null}
      </div>
    </ErrorBoundary>
  );
};

export default ReactTemplateRenderer;
