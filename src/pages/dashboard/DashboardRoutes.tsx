import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingScreen from '@/components/ui/LoadingScreen';

// Eagerly loaded component (first seen by users)
import DashboardHome from '@/pages/dashboard/DashboardHome';

// Lazy loaded components
const ProjectSelection = lazy(() => 
  import('@/features/projects/pages/ProjectSelection').then(module => ({
    default: module.default
  }))
);

const PlannerPage = lazy(() => 
  import('@/features/planner/pages/PlannerPage').then(module => ({
    default: module.default
  }))
);

const SummaryPage = lazy(() => 
  import('@/features/summary/pages/SummaryPage').then(module => ({
    default: module.default
  }))
);

// Additional features - lazy loaded in separate chunk
const AdditionalFeatures = {
  BillingInst: lazy(() => import('@/features/billing/pages/BillingInst')),
  Billing: lazy(() => import('@/pages/billing/Billing')),
  Messages: lazy(() => import('@/pages/messages/messages')),
  Documents: lazy(() => import('@/pages/documents/documents')),
  Settings: lazy(() => import('@/features/settings/pages/Settings')),
};

// Developer tools - lazy loaded in separate chunk
const DeveloperWorksheetPage = lazy(() => 
  import('@/features/developer/pages/DeveloperWorksheetPage')
);

// Error page
const NotFound = lazy(() => import('@/pages/error/NotFound'));

const DashboardRoutes: React.FC = () => (
  <Routes>
    {/* Main Dashboard */}
    <Route index element={<DashboardHome />} />

    {/* Core Project Flow */}
    <Route
      path="project-selection"
      element={
        <Suspense fallback={<LoadingScreen />}>
          <ProjectSelection />
        </Suspense>
      }
    />
    <Route
      path="plannerpage"
      element={
        <Suspense fallback={<LoadingScreen />}>
          <PlannerPage />
        </Suspense>
      }
    />
    <Route
      path="summary"
      element={
        <Suspense fallback={<LoadingScreen />}>
          <SummaryPage />
        </Suspense>
      }
    />

    {/* Billing Routes */}
    <Route
      path="billing-inst"
      element={
        <Suspense fallback={<LoadingScreen />}>
          <AdditionalFeatures.BillingInst />
        </Suspense>
      }
    />
    <Route
      path="billing"
      element={
        <Suspense fallback={<LoadingScreen />}>
          <AdditionalFeatures.Billing />
        </Suspense>
      }
    />

    {/* Additional Features */}
    <Route
      path="messages"
      element={
        <Suspense fallback={<LoadingScreen />}>
          <AdditionalFeatures.Messages />
        </Suspense>
      }
    />
    <Route
      path="documents"
      element={
        <Suspense fallback={<LoadingScreen />}>
          <AdditionalFeatures.Documents />
        </Suspense>
      }
    />
    <Route
      path="settings/*"
      element={
        <Suspense fallback={<LoadingScreen />}>
          <AdditionalFeatures.Settings />
        </Suspense>
      }
    />

    {/* Developer Routes */}
    <Route
      path="developer-worksheet"
      element={
        <Suspense fallback={<LoadingScreen />}>
          <DeveloperWorksheetPage />
        </Suspense>
      }
    />
    <Route
      path="developer-worksheet/:projectId"
      element={
        <Suspense fallback={<LoadingScreen />}>
          <DeveloperWorksheetPage />
        </Suspense>
      }
    />

    {/* 404 Route */}
    <Route
      path="*"
      element={
        <Suspense fallback={<LoadingScreen />}>
          <NotFound />
        </Suspense>
      }
    />
  </Routes>
);

export default DashboardRoutes;