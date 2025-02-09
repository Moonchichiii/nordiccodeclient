import { Suspense, lazy, ReactElement } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { queryClient } from '@/lib/react-query';
import { AuthProvider } from '@/features/auth/components/AuthProvider';
import Layout from '@/components/layout/Layout';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ProtectedRoute from '@/features/auth/ProtectedRoute';
import CookieConsent from '@/components/common/CookieConsent';

interface LazyComponent<T> extends React.LazyExoticComponent<T> {
  preload: () => Promise<{ default: T }>;
}

const lazyWithPrefetch = <T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): LazyComponent<T> => {
  const Component = lazy(factory) as LazyComponent<T>;
  Component.preload = factory;
  return Component;
};



// Lazy load components
const EmailConfirmationModal = lazyWithPrefetch(() => import('@/features/auth/components/EmailConfirmationModal'));
const Dashboard = lazyWithPrefetch(() => import('@/pages/dashboard/Dashboard'));
const Settings = lazyWithPrefetch(() => import('@/pages/settings/Settings'));
const NotFound = lazyWithPrefetch(() => import('@/pages/error/NotFound'));

const App = (): ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="relative">
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                {/* Main landing page with scroll sections */}
                <Route path="/" element={<Layout />} />
                
                {/* Auth routes */}
                <Route path="/verify-email/:key" element={<EmailConfirmationModal />} />
                
                {/* Protected routes */}
                <Route
                  path="/dashboard/*"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                >
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>

            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              limit={3}
              toastClassName="backdrop-blur-md"
            />
            <CookieConsent />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};


export default App;