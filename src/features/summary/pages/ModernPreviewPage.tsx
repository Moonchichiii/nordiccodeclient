// ModernPreviewPage.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronRight, 
  Smartphone, 
  Tablet, 
  Monitor, 
  PanelLeft, 
  PanelRight,
  Edit3,
  Save,
  EyeOff,
  Download,
  RefreshCw,
  Code,
  CheckCircle,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useSummary } from '@/features/summary/hooks/useSummary';
import CogLoader from '@/components/ui/CogLoader';

// Import our new modern components
import ModernPreviewSandbox from './ModernPreviewSandbox';
import TemplateInteractionHandler from '../../react/TemplateInteractionHandler';

interface ElementInfo {
  id: string;
  element: HTMLElement;
  type: string;
  position: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

const ModernPreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const id = parseInt(projectId || '0');
  
  // State for UI controls
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarContent, setSidebarContent] = useState<'structure' | 'style' | 'properties'>('structure');
  const [isEditable, setIsEditable] = useState(false);
  const [viewportScale, setViewportScale] = useState(1);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);
  
  // Refs
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Fetch data using the useSummary hook
  const { data, isLoading, error, refetch } = useSummary(id, {
    enabled: !!id,
    onError: (err) => {
      setPreviewError(err.message);
      toast.error(`Error loading preview: ${err.message}`);
    }
  });

  // Handle iframe load complete
  const handleIframeLoad = useCallback(() => {
    setIframeLoading(false);
    setPreviewError(null);
  }, []);

  // Handle iframe error
  const handleIframeError = useCallback((error: Error) => {
    setPreviewError(error.message);
    setIframeLoading(false);
    toast.error(`Preview error: ${error.message}`);
  }, []);

  // Toggle edit mode
  const toggleEditMode = useCallback(() => {
    setIsEditable(!isEditable);
    if (!isEditable) {
      toast.info('Edit mode enabled. Click on elements to edit them.');
      setShowSidebar(true); // Show sidebar when entering edit mode
    }
  }, [isEditable]);

  // Reset zoom level
  const resetZoom = useCallback(() => {
    setViewportScale(1);
  }, []);

  // Zoom in/out
  const handleZoom = useCallback((zoomIn: boolean) => {
    setViewportScale(prev => {
      const newScale = zoomIn ? prev + 0.1 : prev - 0.1;
      return Math.max(0.5, Math.min(2, newScale)); // Limit zoom between 0.5x and 2x
    });
  }, []);

  // Handle element editing
  const handleElementEdit = useCallback((elementInfo: ElementInfo, content: string) => {
    // In a real app, you would update the template data here
    console.log('Editing element:', elementInfo.id, content);
    toast.info(`Editing ${elementInfo.type} element`);
    
    // Show a simple prompt for now
    const newContent = prompt('Edit content:', content);
    if (newContent !== null && newContent !== content) {
      // This is a simple direct DOM manipulation for demo purposes
      // In a real app, you would update the template data and re-render
      if (elementInfo.type === 'img') {
        (elementInfo.element as HTMLImageElement).src = newContent;
      } else {
        elementInfo.element.innerText = newContent;
      }
      toast.success('Content updated');
    }
  }, []);

  // Handle element deletion
  const handleElementDelete = useCallback((elementInfo: ElementInfo) => {
    // In a real app, you would update the template data here
    console.log('Deleting element:', elementInfo.id);
    
    // Simple confirmation
    if (confirm(`Are you sure you want to delete this ${elementInfo.type} element?`)) {
      // This is a simple direct DOM manipulation for demo purposes
      // In a real app, you would update the template data and re-render
      elementInfo.element.style.display = 'none';
      toast.success('Element removed');
    }
  }, []);

  // Handle adding a new element
  const handleElementAdd = useCallback((position: { top: number; left: number }, type: string) => {
    // In a real app, you would update the template data here
    console.log('Adding element:', type, 'at position', position);
    toast.info(`Adding new ${type} element`);
  }, []);

  // Export the current template
  const handleExport = useCallback(() => {
    if (!data?.planner?.website_template) {
      toast.error('No template data to export');
      return;
    }
    
    try {
      const templateJson = JSON.stringify(data.planner.website_template, null, 2);
      const blob = new Blob([templateJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `website-template-${id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Template exported successfully');
    } catch (err) {
      toast.error('Failed to export template');
      console.error('Export error:', err);
    }
  }, [data, id]);

  // Get sidebar width based on state
  const getSidebarWidth = useCallback(() => {
    return showSidebar ? 'w-80' : 'w-0';
  }, [showSidebar]);

  // Handle editor content updates (demo for the sidebar code editor)
  const handleCodeUpdate = useCallback((code: string) => {
    console.log('Updated code:', code);
    // In a real app, you would update the template data here
  }, []);

  // Get device width class
  const getDeviceWidthClass = useCallback(() => {
    switch (deviceMode) {
      case 'mobile': return 'max-w-[375px]';
      case 'tablet': return 'max-w-[768px]';
      case 'desktop': return 'w-full';
      default: return 'w-full';
    }
  }, [deviceMode]);

  // Handle finalize and proceed
  const handleFinalize = useCallback(() => {
    // Navigate to the next step (e.g., billing page)
    if (!data?.project) {
      toast.error('Project data not available');
      return;
    }
    
    navigate('/dashboard/billing-inst', {
      state: {
        projectId: id,
        selectedPackage: data.project.package,
        selectedAddons: data.project.addons,
        totalPrice: data.project.total_price_eur,
      },
    });
  }, [navigate, id, data]);

  // Determine if we should show a loading state
  const showLoading = isLoading || iframeLoading;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Website Preview</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Device Mode Selector */}
            <div className="bg-gray-100 rounded-lg p-1 flex items-center">
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`p-2 rounded-md ${deviceMode === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                title="Mobile View"
              >
                <Smartphone className="h-5 w-5" />
              </button>
              <button
                onClick={() => setDeviceMode('tablet')}
                className={`p-2 rounded-md ${deviceMode === 'tablet' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                title="Tablet View"
              >
                <Tablet className="h-5 w-5" />
              </button>
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`p-2 rounded-md ${deviceMode === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                title="Desktop View"
              >
                <Monitor className="h-5 w-5" />
              </button>
            </div>
            
            {/* Zoom Controls */}
            <div className="bg-gray-100 rounded-lg p-1 flex items-center">
              <button
                onClick={() => handleZoom(false)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-200"
                title="Zoom Out"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <span className="px-2 text-sm font-medium text-gray-700">
                {Math.round(viewportScale * 100)}%
              </span>
              <button
                onClick={() => handleZoom(true)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-200"
                title="Zoom In"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <button
                onClick={resetZoom}
                className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-200"
                title="Reset Zoom"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
            
            {/* Toggle Edit Mode */}
            <button
              onClick={toggleEditMode}
              className={`p-2 rounded-md ${isEditable ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200'}`}
              title={isEditable ? 'Exit Edit Mode' : 'Edit Mode'}
            >
              <Edit3 className="h-5 w-5" />
            </button>
            
            {/* Toggle Sidebar */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`p-2 rounded-md ${showSidebar ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200'}`}
              title={showSidebar ? 'Hide Sidebar' : 'Show Sidebar'}
            >
              {showSidebar ? <PanelRight className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
            </button>
            
            {/* Export Template */}
            <button
              onClick={handleExport}
              className="p-2 rounded-md bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200"
              title="Export Template"
            >
              <Download className="h-5 w-5" />
            </button>
            
            {/* Refetch Data */}
            <button
              onClick={() => refetch()}
              className="p-2 rounded-md bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200"
              title="Reload Template"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Sidebar */}
        <div
          className={`h-full border-r border-gray-200 bg-white transition-all duration-300 ${getSidebarWidth()} overflow-hidden`}
        >
          {showSidebar && (
            <div className="h-full flex flex-col">
              {/* Sidebar Tabs */}
              <div className="border-b border-gray-200 bg-gray-50">
                <div className="flex">
                  <button
                    onClick={() => setSidebarContent('structure')}
                    className={`flex-1 px-4 py-3 text-sm font-medium ${sidebarContent === 'structure' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Structure
                  </button>
                  <button
                    onClick={() => setSidebarContent('style')}
                    className={`flex-1 px-4 py-3 text-sm font-medium ${sidebarContent === 'style' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Style
                  </button>
                  <button
                    onClick={() => setSidebarContent('properties')}
                    className={`flex-1 px-4 py-3 text-sm font-medium ${sidebarContent === 'properties' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Properties
                  </button>
                </div>
              </div>
              
              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {sidebarContent === 'structure' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Page Structure</h3>
                    <div className="space-y-2">
                      {Object.keys(data?.planner?.website_template?.sections || {}).map((section) => (
                        <div 
                          key={section}
                          className="p-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                        >
                          <span className="font-medium capitalize">{section}</span>
                          <div className="flex space-x-1">
                            <button className="p-1 text-gray-500 hover:text-blue-600">
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-500 hover:text-red-600">
                              <EyeOff className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {sidebarContent === 'style' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">CSS Editor</h3>
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-2">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-medium text-gray-700">Template CSS</span>
                        <button className="text-xs text-blue-600 hover:text-blue-800">
                          <Save className="h-3 w-3 inline-block mr-1" />
                          Save
                        </button>
                      </div>
                      <textarea
                        ref={editorRef}
                        className="w-full h-80 p-3 text-sm font-mono bg-gray-900 text-gray-100 rounded-md"
                        defaultValue={data?.planner?.website_template?.css || '/* No CSS found */'}
                        onChange={(e) => handleCodeUpdate(e.target.value)}
                      />
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Colors</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {Object.entries(data?.planner?.website_template?.meta?.colors || {}).map(([name, color]) => (
                          <div key={name} className="text-center">
                            <div 
                              className="w-10 h-10 rounded-full mx-auto mb-1 border border-gray-200"
                              style={{ backgroundColor: color as string }}
                            />
                            <span className="text-xs text-gray-600">{name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Typography</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 border border-gray-200 rounded-md">
                          <span className="text-sm">Headings</span>
                          <span className="text-xs font-mono">
                            {data?.planner?.website_template?.meta?.typography?.headings || 'Not set'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 border border-gray-200 rounded-md">
                          <span className="text-sm">Body</span>
                          <span className="text-xs font-mono">
                            {data?.planner?.website_template?.meta?.typography?.body || 'Not set'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {sidebarContent === 'properties' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Project Properties</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Client Summary</h4>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                          <p className="text-sm text-gray-700">
                            {data?.planner?.client_summary || 'No summary available'}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Package Information</h4>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                          <p className="text-sm font-medium text-gray-700">
                            {data?.project?.package?.name || 'No package selected'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Price: €{data?.project?.package?.price_eur || 0}
                          </p>
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-600 mb-1">Features:</p>
                            <ul className="list-disc list-inside text-xs text-gray-600">
                              {data?.project?.package?.features?.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Developer Notes</h4>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                          <div className="space-y-2 text-sm text-gray-700">
                            {data?.planner?.developer_notes?.architecture && (
                              <div>
                                <p className="font-medium">Architecture:</p>
                                <p>{data.planner.developer_notes.architecture}</p>
                              </div>
                            )}
                            {data?.planner?.developer_notes?.framework?.primary && (
                              <div>
                                <p className="font-medium">Recommended Framework:</p>
                                <p>{data.planner.developer_notes.framework.primary}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Bottom Action Bar */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <button
                  onClick={handleFinalize}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Finalize & Proceed</span>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Preview Area */}
        <div className="flex-1 overflow-auto p-6 bg-gray-100">
          {/* Loading State */}
          {showLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center">
                <CogLoader className="w-10 h-10 animate-spin text-blue-600 mb-3" />
                <p className="text-gray-700 font-medium">Loading preview...</p>
              </div>
            </div>
          )}
          
          {/* Error State */}
          {previewError && !showLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
              <div className="max-w-md p-6 bg-red-50 border border-red-200 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Preview Error</h3>
                <p className="text-red-600 mb-4">{previewError}</p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
          
          {/* Preview Container */}
          <div className={`${getDeviceWidthClass()} mx-auto transition-all duration-300`} ref={previewContainerRef}>
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              {data?.planner?.website_template && (
                <ModernPreviewSandbox
                  template={data.planner.website_template}
                  projectId={id}
                  height={deviceMode === 'mobile' ? '667px' : deviceMode === 'tablet' ? '1024px' : '800px'}
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  viewportScale={viewportScale}
                  deviceMode={deviceMode}
                />
              )}
              
              {/* Interactive Editor Overlay */}
              {data?.planner?.website_template && (
                <TemplateInteractionHandler
                  containerRef={previewContainerRef}
                  isEditable={isEditable}
                  onElementEdit={handleElementEdit}
                  onElementDelete={handleElementDelete}
                  onElementAdd={handleElementAdd}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernPreviewPage;