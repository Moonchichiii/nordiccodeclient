// DashboardRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Local components
import DashboardHome from '@/pages/dashboard/DashboardHome';
import ProjectSelection from '@/pages/projects/ProjectSelection';
import PlannerPage from '../planner/PlannerPage';
import SummaryPage from '@/pages/summary/SummaryPage'; 
import DeveloperWorksheetPage from '@/pages/developer/DeveloperWorksheetPage';
import BillingInst from '@/pages/billing/BillingInst';
import Billing from '@/pages/billing/Billing';
import Messages from '@/pages/messages/Messages';
import Documents from '@/pages/documents/Documents';
import Settings from '@/pages/settings/Settings';
import NotFound from '@/pages/error/NotFound';

const DashboardRoutes: React.FC = () => (
    <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="project-selection" element={<ProjectSelection />} />
        <Route path="plannerpage" element={<PlannerPage />} />
        <Route path="summary" element={<SummaryPage />} />
        <Route path="billing-inst" element={<BillingInst />} />
        <Route path="billing" element={<Billing />} />
        <Route path="messages" element={<Messages />} />
        <Route path="documents" element={<Documents />} />
        <Route path="settings/*" element={<Settings />} />
        {/* Developer-only route */}
        <Route path="developer-worksheet/:projectId" element={<DeveloperWorksheetPage />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
);

export default DashboardRoutes;
