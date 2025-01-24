// pages/billing/Billing.tsx
import { useState } from 'react';
import { CreditCard, Receipt, History } from 'lucide-react';

const Billing = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Billing & Payments</h1>
      
      {/* Payment Status */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 mb-6">
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Current Project</h2>
          <div className="flex justify-between">
            <span className="text-gray-400">Project Type</span>
            <span>Enterprise Solution</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Deposit Paid</span>
            <span className="text-green-500">€2,999</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Remaining Balance</span>
            <span>€7,000</span>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <h2 className="text-xl font-medium mb-4">Payment History</h2>
        <div className="space-y-4">
          {/* Transaction items */}
        </div>
      </div>
    </div>
  );
};

export default Billing;