// SummaryDetails.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { FileText, Package, Gift, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface SummaryData {
  package: { id: string; title: string; price_eur: number; features: string[] };
  addons: Array<{ id: string; title: string; price_eur: number }>;
  planner: { client_summary: string; developer_worksheet: string };
  total_price_eur: number;
}

interface SummaryDetailsProps {
  projectId: number;
  onConfirm: () => void;
  className?: string;
}

const SectionHeader: React.FC<{ icon: any; title: string }> = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <h2 className="text-lg font-medium text-foreground">{title}</h2>
  </div>
);

/**
 * SummaryDetails component displays a project summary with package, addons, and pricing information.
 * This is a modern replacement for the ProjectSummary component.
 */
const SummaryDetails: React.FC<SummaryDetailsProps> = ({ projectId, onConfirm, className = '' }) => {
  const { data, isLoading, error } = useQuery<SummaryData>(
    ['project-summary', projectId], 
    async () => {
      try {
        const res = await axios.get(`/api/projects/${projectId}/summary/`);
        return res.data;
      } catch (err) {
        console.error('Failed to fetch project summary:', err);
        throw err;
      }
    },
    {
      staleTime: 60000, // Consider data fresh for 1 minute
      retry: 2,
      onError: (err) => {
        toast.error('Failed to load project summary. Please try again.');
      }
    }
  );

  const handleConfirm = () => {
    if (!data) {
      toast.error('Cannot proceed without project data');
      return;
    }
    onConfirm();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-lg text-gray-600">Loading project summary...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Summary</h3>
        <p className="text-red-600 mb-4">We couldn't load your project summary. Please try again.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Project Summary Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <SectionHeader icon={FileText} title="Project Summary" />
        <div className="prose prose-sm max-w-none">
          {data.planner.client_summary}
        </div>
      </div>
      
      {/* Package Details Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <SectionHeader icon={Package} title="Package Details" />
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="font-medium text-lg">{data.package.title}</span>
            <span className="text-blue-600 font-medium">
              €{data.package.price_eur.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          {data.package.features && data.package.features.length > 0 && (
            <div>
              <h4 className="text-sm text-gray-500 mb-2">Included Features</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {data.package.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="mt-1 h-4 w-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Add-ons Section */}
      {data.addons && data.addons.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <SectionHeader icon={Gift} title="Selected Add-ons" />
          <ul className="space-y-3">
            {data.addons.map((addon) => (
              <li key={addon.id} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-700">{addon.title}</span>
                <span className="text-blue-600 font-medium">
                  €{addon.price_eur.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Payment Summary & Confirmation */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <SectionHeader icon={CreditCard} title="Payment Summary" />
        
        <div className="space-y-4">
          <div className="flex justify-between items-center pt-2 pb-4 border-b border-gray-200">
            <span className="text-gray-600">Package Price</span>
            <span className="font-medium">
              €{data.package.price_eur.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          {data.addons && data.addons.length > 0 && (
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Add-ons</span>
              <span className="font-medium">
                €{data.addons.reduce((sum, addon) => sum + addon.price_eur, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="text-gray-900 font-semibold">Total</span>
            <span className="text-lg text-blue-600 font-bold">
              €{data.total_price_eur.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="pt-4">
            <button
              onClick={handleConfirm}
              className="relative overflow-hidden w-full px-6 py-3 rounded-lg bg-primary text-white flex items-center justify-center gap-2 transition-transform duration-300 hover:scale-[1.02]"
            >
              <span className="font-medium">Confirm & Proceed to Payment</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              By clicking confirm, you agree to our terms and payment conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryDetails;