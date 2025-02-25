// TemplateSystemIntegration.tsx
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

// Import modern components
import ModernPreviewSandbox from '@/features/summary/components/ModernPreviewSandbox';
import { PreviewErrorBoundary } from '@/features/summary/components/PreviewErrorBoundary';
import { PreviewCache } from '@/features/summary/utils/PreviewCache';
import { parseTemplate, sanitizeHtml, combineSections, applyTailwindClasses } from '@/features/summary/utils/TemplateUtils';

// Types
import { Template } from '@/features/summary/types/summary.types';

// Feature flags for gradual rollout - using Vite's import.meta.env
const FEATURES = {
  // Set this to false initially, then gradually turn on for more users
  USE_MODERN_RENDERER: import.meta.env.VITE_USE_MODERN_RENDERER === 'true' || false,
  
  // Debug mode for development
  DEBUG_MODE: import.meta.env.MODE === 'development'
};

interface TemplateSystemProps {
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
 * Integration component that handles the transition from PreviewSandbox to ModernPreviewSandbox.
 * This provides a smooth migration path by using feature flags to control which renderer is used.
 */
const TemplateSystemIntegration: React.FC<TemplateSystemProps> = ({
  template,
  projectId,
  width = '100%',
  height = '500px',
  onLoad,
  onError,
  viewportScale = 1,
  deviceMode = 'desktop',
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processedTemplate, setProcessedTemplate] = useState<Template | null>(null);
  const [legacyMode, setLegacyMode] = useState(!FEATURES.USE_MODERN_RENDERER);
  const containerRef = useRef<HTMLDivElement>(null);

  // Process template when it changes
  useEffect(() => {
    const processTemplateData = async () => {
      if (!template) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Check cache first
        const cache = PreviewCache.getInstance();
        const cacheKey = `template_${projectId}_${deviceMode}`;
        const cachedTemplate = cache.get(cacheKey);
        
        if (cachedTemplate) {
          console.log('Using cached template');
          setProcessedTemplate(JSON.parse(cachedTemplate));
          setIsLoading(false);
          onLoad?.();
          return;
        }
        
        // Parse template if it's a string
        let templateObj: Template;
        try {
          // Use parseTemplate utility for consistent handling
          templateObj = parseTemplate(template);
          
          // Apply modern enhancements to the template
          if (!legacyMode) {
            // Apply Tailwind classes to ensure consistent styling
            templateObj = applyTailwindClasses(templateObj);
            
            // Sanitize HTML in all sections
            if (templateObj.sections) {
              Object.entries(templateObj.sections).forEach(([key, value]) => {
                templateObj.sections[key] = sanitizeHtml(value);
              });
            }
          }
        } catch (e) {
          console.error('Failed to parse template:', e);
          setError('Invalid template format');
          setIsLoading(false);
          onError?.(e as Error);
          return;
        }
        
        // Set the processed template
        setProcessedTemplate(templateObj);
        
        // Cache the result
        cache.set(cacheKey, JSON.stringify(templateObj));
        
        setIsLoading(false);
        onLoad?.();
      } catch (error) {
        console.error('Template processing error:', error);
        setError((error as Error).message);
        setIsLoading(false);
        onError?.(error as Error);
      }
    };

    processTemplateData();
  }, [template, projectId, deviceMode, onLoad, onError, legacyMode]);

  // Handle fallback to legacy mode
  const handleModernError = (error: Error) => {
    console.error('Modern renderer error, falling back to legacy mode:', error);
    toast.warning('Using compatibility mode for preview');
    setLegacyMode(true);
    onError?.(error);
  };

  // Handle toggle between modern and legacy mode (debug feature)
  const toggleRenderMode = () => {
    setLegacyMode(!legacyMode);
    toast.info(`Switched to ${!legacyMode ? 'legacy' : 'modern'} rendering mode`);
  };

  // If we're in debug mode and in development environment, show a toggle button
  const renderDebugControls = () => {
    if (!FEATURES.DEBUG_MODE) return null;
    
    return (
      <div className="debug-toolbar absolute top-0 right-0 z-50 bg-gray-800 text-white p-2 text-xs rounded-bl-md">
        <button 
          onClick={toggleRenderMode}
          className="px-2 py-1 bg-blue-600 rounded text-xs"
        >
          {legacyMode ? 'Try Modern' : 'Use Legacy'}
        </button>
        <div className="text-xs mt-1">Mode: {legacyMode ? 'Legacy' : 'Modern'}</div>
      </div>
    );
  };

  return (
    <PreviewErrorBoundary onRetry={() => setError(null)}>
      <div className="template-system relative" style={{ width, height }}>
        {/* Debug controls */}
        {renderDebugControls()}

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error message */}
        {error && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 p-6 z-10">
            <div className="max-w-md p-6 bg-red-50 border border-red-200 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-3">Preview Error</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Content - conditional rendering based on mode */}
        <div ref={containerRef} className="h-full">
          {!error && processedTemplate && (
            <>
              {/* Legacy renderer (iframe based) */}
              {legacyMode && (
                <PreviewSandbox
                  template={processedTemplate}
                  projectId={projectId}
                  width={width}
                  height={height}
                  onLoad={onLoad}
                  onError={onError}
                  viewportScale={viewportScale}
                />
              )}
              
              {/* Modern renderer (React component based) */}
              {!legacyMode && (
                <ModernPreviewSandbox
                  template={processedTemplate}
                  projectId={projectId}
                  width={width}
                  height={height}
                  onLoad={onLoad}
                  onError={handleModernError}
                  viewportScale={viewportScale}
                  deviceMode={deviceMode}
                />
              )}
            </>
          )}
        </div>
      </div>
    </PreviewErrorBoundary>
  );
};

export default TemplateSystemIntegration;