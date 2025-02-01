// src/pages/planner/Planner.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const Planner: React.FC = () => {
  const location = useLocation();
  // read state if needed
  const { selectedPackage, selectedAddons, totalPrice } = location.state || {};

  return (
    <main className="p-6">
      <h2 className="text-3xl font-light text-white mb-6">AI Planner</h2>
      <p className="text-gray-400 mb-4">
        Let's gather your requirements and generate a detailed plan...
      </p>
      {/* Your form or wizard or AI chat or whatever you have in mind */}
    </main>
  );
};

export default Planner;
