// ModernPreviewSandbox.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import CogLoader from '@/components/ui/CogLoader';
import { PreviewErrorBoundary } from '@/features/summary/components/PreviewErrorBoundary';
import ReactTemplateRenderer from './ReactTemplateRenderer';
import { PreviewCache } from '../utils/PreviewCache';
import { useAuthContext } from '@/features/auth/components/AuthProvider';
import { useTheme } from '@/components/layout/ThemeContext';

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

interface ModernPreviewSandboxProps {
  template?: Template | string;
  projectId: number;
  width?: string;
  height?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  viewportScale?: number;
  deviceMode?: 'mobile' | 'tablet' | 'desktop';
}

/**
 * Breaks down a large HTML string into smaller chunks for more efficient processing
 * @param html The large HTML string to chunk
 * @param chunkSize Approximate size of each chunk (in number of HTML elements)
 * @returns Array of HTML chunks
 */
const chunkHtmlContent = (html: string, chunkSize = 50): string[] => {
  // Simple chunking based on closing tags
  const closingTags = ['</div>', '</section>', '</article>', '</main>', '</header>', '</footer>'];

  // If HTML is small enough, don't chunk
  if (html.length < 10000) {
    return [html];
  }

  const chunks: string[] = [];
  let remaining = html;

  while (remaining.length > 0) {
    let breakPoint = -1;

    // Try to find a suitable closing tag after approximate chunkSize
    for (const tag of closingTags) {
      const position = remaining.indexOf(tag, chunkSize);
      if (position !== -1 && (breakPoint === -1 || position < breakPoint)) {
        breakPoint = position + tag.length;
      }
    }

    // If no good breakpoint found, take a reasonable chunk
    if (breakPoint === -1) {
      breakPoint = Math.min(remaining.length, chunkSize * 20);
    }

    const chunk = remaining.substring(0, breakPoint);
    chunks.push(chunk);
    remaining = remaining.substring(breakPoint);

    // Safety mechanism to prevent infinite loops
    if (breakPoint === 0) {
      break;
    }
  }

  return chunks;
};

/**
 * A modern approach to previewing templates by converting HTML to React components.
 * Uses Tailwind design system instead of iframe sandbox.
 */
const ModernPreviewSandbox: React.FC<ModernPreviewSandboxProps> = ({
  template,
  projectId,
  width = '100%',
  height = '500px',
  onLoad,
  onError,
  viewportScale = 1,
  deviceMode = 'desktop',
}) => {
  // Access context inside the component function
  const auth = useAuthContext();
  const { theme } = useTheme();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [processedTemplate, setProcessedTemplate] = useState<{
    sectionsHtml: string;
    css: string;
    js: string;
  } | null>(null);
  const [renderError, setRenderError] = useState<Error | null>(null);
  const cache = PreviewCache.getInstance();

  // Process template and convert it to a format suitable for React rendering
  const processTemplate = useCallback(() => {
    try {
      const timerName = `processTemplate_${projectId}_${Date.now()}`;
      console.time(timerName);
      
      // Use a version string in the cache key to allow easy invalidation later
      const cacheVersion = 'v1';
      const cacheKey = `template_${projectId}_${deviceMode}_${cacheVersion}`;
      const cachedTemplate = cache.get(cacheKey);
      
      if (cachedTemplate) {
        console.log('Using cached template');
        setProcessedTemplate(JSON.parse(cachedTemplate));
        console.timeEnd(timerName);
        return;
      }

      // Process new template
      if (typeof template === 'string') {
        try {
          const parsed = JSON.parse(template) as Template;
          processTemplateObject(parsed, cacheVersion);
        } catch (e) {
          console.error('Invalid template JSON string:', e);
          setRenderError(new Error('Invalid template format'));
        }
      } else if (template && typeof template === 'object') {
        processTemplateObject(template as Template, cacheVersion);
      } else {
        setRenderError(new Error('No template provided'));
      }
      console.timeEnd(timerName);
    } catch (error) {
      console.error('Error processing template:', error);
      setRenderError(error as Error);
      onError?.(error as Error);
    }
  }, [template, projectId, deviceMode, onError, cache]);

  // Process Template object with chunking for large templates.
  // The cacheVersion is passed in to build a versioned cache key.
  const processTemplateObject = (templateObj: Template, cacheVersion: string) => {
    try {
      // Combine all sections
      const sectionsHtml = Object.values(templateObj.sections ?? {})
        .filter(Boolean)
        .join('\n');
      
      // Get CSS and JS
      const css = templateObj.css ?? '';
      const js = templateObj.js ?? '';
      
      // Use a versioned cache key
      const cacheKey = `template_${projectId}_${deviceMode}_${cacheVersion}`;
      
      // For very large templates, use chunking for better performance
      if (sectionsHtml.length > 100000) {
        console.log('Large template detected, using chunking for better performance');
        
        // Cache the complete HTML for future use
        const fullResult = { sectionsHtml, css, js };
        cache.set(cacheKey, JSON.stringify(fullResult));
        
        // Process in chunks
        const chunks = chunkHtmlContent(sectionsHtml);
        console.log(`Template split into ${chunks.length} chunks for processing`);
        
        // Start with the first chunk for initial rendering
        setProcessedTemplate({ 
          sectionsHtml: chunks[0], 
          css, 
          js 
        });
        
        // Queue remaining chunks for processing after initial render
        if (chunks.length > 1) {
          setTimeout(() => {
            console.log('Processing remaining template chunks');
            setProcessedTemplate(fullResult);
          }, 100);
        }
      } else {
        // For smaller templates, process normally
        const result = { sectionsHtml, css, js };
        setProcessedTemplate(result);
        cache.set(cacheKey, JSON.stringify(result));
      }
    } catch (e) {
      console.error('Error processing template object:', e);
      setRenderError(new Error('Error processing template'));
      onError?.(e as Error);
    }
  };

  // Apply viewport adjustments based on device mode
  const getViewportStyles = useCallback(() => {
    switch (deviceMode) {
      case 'mobile':
        return {
          maxWidth: '375px',
          margin: '0 auto',
        };
      case 'tablet':
        return {
          maxWidth: '768px',
          margin: '0 auto',
        };
      default:
        return {
          width: '100%',
        };
    }
  }, [deviceMode]);

  // Effect to process the template when it changes
  useEffect(() => {
    if (template) {
      processTemplate();
    }
  }, [template, processTemplate]);

  // Handle successful rendering
  const handleRenderComplete = useCallback(() => {
    setLoading(false);
    onLoad?.();
    
    // Execute JS if available
    if (processedTemplate?.js) {
      try {
        const executeJs = new Function(processedTemplate.js);
        executeJs();
      } catch (error) {
        console.error('Error executing JavaScript:', error);
      }
    }
  }, [processedTemplate, onLoad]);

  // Handle rendering errors
  const handleRenderError = useCallback((error: Error) => {
    console.error('Render error:', error);
    setRenderError(error);
    setLoading(false);
    onError?.(error);
  }, [onError]);

  return (
    <PreviewErrorBoundary onRetry={() => processTemplate()}>
      <div
        ref={containerRef}
        style={{
          width,
          height,
          transform: `scale(${viewportScale})`,
          transformOrigin: 'top left',
          position: 'relative',
          overflow: 'auto',
        }}
        className="bg-white rounded-lg shadow"
        data-theme={theme}
      >
        <div style={getViewportStyles()}>
          {processedTemplate ? (
            <ReactTemplateRenderer
              htmlContent={processedTemplate.sectionsHtml}
              css={processedTemplate.css}
              className="template-preview"
              onRenderComplete={handleRenderComplete}
              authUser={auth.user}
              theme={theme}
            />
          ) : null}
        </div>
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <CogLoader className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        
        {renderError && !loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm p-6">
            <div className="max-w-md p-6 bg-red-50 border border-red-200 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-3">Preview Generation Error</h3>
              <p className="text-red-600 mb-4">{renderError.message}</p>
              <button
                onClick={() => processTemplate()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </PreviewErrorBoundary>
  );
};

export default ModernPreviewSandbox;
