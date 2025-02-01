// src/pages/dashboard/DashboardRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardHome from '@/pages/dashboard/DashboardHome';
import ProjectSelection from '@/pages/projects/ProjectSelection';  // <--- We'll use this
import BillingInst from '@/pages/billing/BillingInst';
import Billing from '@/pages/billing/Billing';
import Messages from '@/pages/messages/messages';
import Documents from '@/pages/documents/Documents';
import Settings from '@/pages/settings/Settings';
import NotFound from '@/pages/error/NotFound';

const DashboardRoutes: React.FC = () => (
  <Routes>
    <Route index element={<DashboardHome />} />
  <Route path="project-selection" element={<ProjectSelection />} />
  <Route path="billing-inst" element={<BillingInst />} />
      
    <Route path="billing" element={<Billing />} />
    <Route path="messages" element={<Messages />} />
    <Route path="documents" element={<Documents />} />
    <Route path="settings/*" element={<Settings />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default DashboardRoutes;
