// SummaryPage.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSummary } from '@/features/summary/hooks/useSummary';
import CogLoader from '@/components/ui/CogLoader';
import { toast } from 'react-toastify';
import gsap from 'gsap';

// Import modern components
import ModernPreviewSandbox from '@/features/summary/components/ModernPreviewSandbox';
import DevicePreview from '@/features/summary/components/DevicePreview';

interface LocationState {
  projectId: number;
  selectedPackage: {
    id?: string;
    title: string;
    price_eur: number;
    features: string[];
  };
  selectedAddons: Array<{
    id: string;
    title: string;
    price_eur: number;
  }>;
  totalPrice: number;
  clientSummary?: string;
  websiteTemplate?: string;
  developerWorksheet?: string;
}

const SummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  
  // Local state
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [previewLoading, setPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Refs
  const summaryRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Fetch data using the useSummary hook
  const { data: persistentData, isLoading: isPersistentLoading, refetch } = useSummary(
    state?.projectId ?? 0,
    {
      enabled: !!state?.projectId,
      refetchInterval: !state?.clientSummary ? 10000 : false,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 30000)
    }
  );

  // Prepare display data
  const displayData = {
    clientSummary: state?.clientSummary ?? persistentData?.planner?.client_summary ?? '',
    websiteTemplate: state?.websiteTemplate ?? persistentData?.planner?.website_template ?? '',
    package: state?.selectedPackage ?? {
      id: persistentData?.project?.package?.id,
      title: persistentData?.project?.package?.name,
      price_eur: persistentData?.project?.package?.price_eur ?? 0,
      features: persistentData?.project?.package?.features ?? []
    },
    addons: state?.selectedAddons ?? persistentData?.project?.addons?.map(addon => ({
      id: addon.id,
      title: addon.name ?? addon.title,
      price_eur: addon.price_eur
    })) ?? [],
    totalPrice: state?.totalPrice ?? persistentData?.project?.total_price_eur ?? 0
  };

  // Callbacks
  const handlePreviewLoad = useCallback(() => {
    setPreviewLoading(false);
    setPreviewError(null);
  }, []);

  const handlePreviewError = useCallback((error: Error) => {
    setPreviewError(error.message || "Failed to load preview");
    setPreviewLoading(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!previewContainerRef.current) return;
    if (!isFullscreen) {
      previewContainerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  // Finalize handler
  const handleFinalize = useCallback(() => {
    if (!displayData.package || !displayData.totalPrice) {
      toast.error('Invalid package or price data');
      return;
    }
    navigate('/dashboard/billing-inst', {
      state: {
        projectId: state?.projectId,
        selectedPackage: displayData.package,
        selectedAddons: displayData.addons,
        totalPrice: displayData.totalPrice,
      },
    });
  }, [displayData, navigate, state?.projectId]);

  // Effects
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (summaryRef.current && displayData.clientSummary) {
      gsap.fromTo(
        summaryRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 }
      );
    }
  }, [displayData.clientSummary]);

  // No project data fallback
  if (!state?.projectId && !persistentData) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">No Project Data</h3>
          <p className="text-red-600">No project data found. Please start a new project or check your project ID.</p>
        </div>
      </div>
    );
  }

  // Determine loading state
  const showLoading = isPersistentLoading || previewLoading;

  // Format price safely with fallback
  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return '0.00';
    return price.toLocaleString('en-US', { minimumFractionDigits: 2 });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto p-4 lg:p-6 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Planner
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Summary & Details */}
          <div ref={summaryRef} className="space-y-6">
            {/* Project Summary */}
            {isPersistentLoading && !displayData.clientSummary ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            ) : displayData.clientSummary && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Project Summary</h2>
                <div className="prose prose-sm max-w-none">
                  {displayData.clientSummary}
                </div>
              </div>
            )}

            {/* Package Details */}
            {displayData.package && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Package Details</h3>
                <div className="space-y-4">
                  <div>
                    <span className="font-medium">{displayData.package.title}</span>
                    <span className="text-gray-600 ml-2">
                      (€{formatPrice(displayData.package.price_eur)})
                    </span>
                  </div>
                  {displayData.package.features && (
                    <ul className="list-disc list-inside space-y-1">
                      {displayData.package.features.map((feature, idx) => (
                        <li key={idx} className="text-gray-600">{feature}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* Finalize Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-center sm:text-right">
                  <p className="text-sm text-gray-500">Total Project Value</p>
                  <p className="text-2xl font-bold text-blue-600">
                    €{formatPrice(displayData.totalPrice)}
                  </p>
                </div>
                <button
                  onClick={handleFinalize}
                  disabled={!displayData.package || !displayData.totalPrice}
                  className="relative group bg-blue-600 hover:bg-blue-700 text-white min-w-[200px] h-14 rounded-xl shadow-lg transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed px-6"
                >
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-200" />
                  <div className="relative flex items-center justify-center gap-2 w-full">
                    <span className="text-lg font-medium">Finalize & Proceed</span>
                    <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </button>
              </div>
            </div>

            {/* Selected Add-ons */}
            {displayData.addons && displayData.addons.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Selected Add-ons</h3>
                <ul className="space-y-3">
                  {displayData.addons.map((addon) => (
                    <li key={addon.id} className="flex justify-between items-center">
                      <span>{addon.title}</span>
                      <span className="text-blue-600">
                        €{formatPrice(addon.price_eur)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Website Preview */}
          <div ref={previewContainerRef} className="rounded-xl border border-gray-200 bg-gray-50 shadow-sm relative min-h-[600px]">
            <DevicePreview
              onFullscreen={toggleFullscreen}
              isLoading={showLoading}
              error={previewError}
              activeDevice={deviceMode}
              onDeviceChange={setDeviceMode}
              onRefresh={() => refetch()}
              showRefreshButton={true}
              title="Website Preview"
            >
              {displayData.websiteTemplate ? (
                <ModernPreviewSandbox
                  template={displayData.websiteTemplate}
                  projectId={state?.projectId || 0}
                  height={isFullscreen ? '100vh' : '500px'}
                  onLoad={handlePreviewLoad}
                  onError={handlePreviewError}
                  deviceMode={deviceMode}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  {isPersistentLoading ? <CogLoader /> : "Website preview not available"}
                </div>
              )}
            </DevicePreview>
            
            {/* Loading overlay for backward compatibility */}
            {showLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50/75 backdrop-blur-sm z-50 pointer-events-none">
                <CogLoader />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;