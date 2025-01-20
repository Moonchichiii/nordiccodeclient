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
import Home from '@/pages/home/Home';

// Lazy loading utility
const lazyWithPrefetch = <T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> & { preload: () => Promise<{ default: T }> } => {
  const Component = lazy(factory);
  (Component as any).preload = factory;
  return Component as React.LazyExoticComponent<T> & { preload: () => Promise<{ default: T }> };
};

// Lazy loaded pages
const Services = lazyWithPrefetch(() => import('@/pages/services/Services'));
const Portfolio = lazyWithPrefetch(() => import('@/pages/portfolio/Portfolio'));
const Contact = lazyWithPrefetch(() => import('@/pages/contact/Contact'));
const NotFound = lazyWithPrefetch(() => import('@/pages/error/NotFound'));
const EmailConfirmationModal = lazyWithPrefetch(() => import('@/features/auth/components/EmailConfirmationModal'));
const Dashboard = lazyWithPrefetch(() => import('@/pages/dashboard/Dashboard'));
const Settings = lazyWithPrefetch(() => import('@/pages/settings/Settings'));

const App = (): ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="relative">
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="services" element={<Services />} />
                  <Route path="portfolio" element={<Portfolio />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="confirm-email/:confirmation_key" element={<EmailConfirmationModal />} />
                  <Route
                    path="dashboard/*"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  >
                    {/* Nested routes for dashboard */}
                    <Route path="settings" element={<Settings />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
            
            {/* Global Components */}
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