// DevicePreview.tsx
import React from 'react';
import { Smartphone, Tablet, Monitor, Maximize2, RefreshCw, Download, Share2 } from 'lucide-react';

interface DevicePreviewProps {
  children: React.ReactNode;
  onFullscreen: () => void;
  isLoading?: boolean;
  error?: string | null;
  activeDevice?: 'mobile' | 'tablet' | 'desktop';
  onDeviceChange?: (device: 'mobile' | 'tablet' | 'desktop') => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onShare?: () => void;
  showExportButton?: boolean;
  showShareButton?: boolean;
  showRefreshButton?: boolean;
  title?: string;
}

const DevicePreview: React.FC<DevicePreviewProps> = ({
  children,
  onFullscreen,
  isLoading = false,
  error = null,
  activeDevice = 'desktop',
  onDeviceChange,
  onRefresh,
  onExport,
  onShare,
  showExportButton = false,
  showShareButton = false,
  showRefreshButton = true,
  title = 'Website Preview'
}) => {
  // Get device dimensions and styles
  const getDeviceStyles = () => {
    switch(activeDevice) {
      case 'mobile':
        return {
          width: '375px',
          height: '667px',
          className: 'shadow-lg rounded-xl border border-gray-200'
        };
      case 'tablet':
        return {
          width: '768px',
          height: '1024px',
          className: 'shadow-lg rounded-xl border border-gray-200'
        };
      case 'desktop':
      default:
        return {
          width: '100%',
          height: '800px',
          className: 'w-full'
        };
    }
  };

  const deviceStyles = getDeviceStyles();

  // Handle device change
  const handleDeviceChange = (device: 'mobile' | 'tablet' | 'desktop') => {
    if (onDeviceChange) {
      onDeviceChange(device);
    }
  };

  return (
    <div className="w-full bg-gray-50 rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        
        <div className="flex items-center gap-2">
          {/* Device Mode Selector */}
          <div className="bg-white rounded-lg border border-gray-200 p-1 flex gap-1">
            <button
              onClick={() => handleDeviceChange('mobile')}
              className={`p-2 rounded-md transition-all ${
                activeDevice === 'mobile'
                  ? 'bg-blue-100 text-blue-600'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Mobile view"
            >
              <Smartphone className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDeviceChange('tablet')}
              className={`p-2 rounded-md transition-all ${
                activeDevice === 'tablet'
                  ? 'bg-blue-100 text-blue-600'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Tablet view"
            >
              <Tablet className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDeviceChange('desktop')}
              className={`p-2 rounded-md transition-all ${
                activeDevice === 'desktop'
                  ? 'bg-blue-100 text-blue-600'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Desktop view"
            >
              <Monitor className="w-5 h-5" />
            </button>
          </div>
          
          {/* Additional Controls */}
          <div className="flex items-center gap-1">
            {showRefreshButton && onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 rounded-md hover:bg-gray-100 text-gray-600 border border-gray-200"
                title="Refresh preview"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            )}
            
            {showExportButton && onExport && (
              <button
                onClick={onExport}
                className="p-2 rounded-md hover:bg-gray-100 text-gray-600 border border-gray-200"
                title="Export template"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
            
            {showShareButton && onShare && (
              <button
                onClick={onShare}
                className="p-2 rounded-md hover:bg-gray-100 text-gray-600 border border-gray-200"
                title="Share template"
              >
                <Share2 className="w-5 h-5" />
              </button>
            )}
            
            <button
              onClick={onFullscreen}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600 border border-gray-200"
              title="Fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Preview Container */}
      <div className="flex justify-center bg-white rounded-lg border border-gray-200 p-8 overflow-x-auto">
        <div
          className={`transition-all duration-300 ${deviceStyles.className}`}
          style={{
            width: deviceStyles.width,
            height: deviceStyles.height,
            position: 'relative'
          }}
        >
          {/* Pass dimensions to children */}
          {React.Children.map(children, child =>
            React.isValidElement(child)
              ? React.cloneElement(child, {
                  width: deviceStyles.width,
                  height: deviceStyles.height
                })
              : child
          )}
          
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2" />
                <span className="text-sm text-gray-700">Loading preview...</span>
              </div>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="text-red-600 text-center p-4 max-w-md">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-semibold mb-2">Error loading preview</p>
                  <p className="text-sm">{error}</p>
                  {showRefreshButton && onRefresh && (
                    <button 
                      onClick={onRefresh}
                      className="mt-3 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md"
                    >
                      Try Again
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Device Specifications */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600">
          {activeDevice === 'mobile' && (
            <>
              <Smartphone className="w-3 h-3 mr-2" />
              <span>375 x 667px</span>
            </>
          )}
          {activeDevice === 'tablet' && (
            <>
              <Tablet className="w-3 h-3 mr-2" />
              <span>768 x 1024px</span>
            </>
          )}
          {activeDevice === 'desktop' && (
            <>
              <Monitor className="w-3 h-3 mr-2" />
              <span>Desktop View</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevicePreview;