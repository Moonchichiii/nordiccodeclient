import { Suspense, lazy, ReactElement } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { queryClient } from '@/lib/react-query';
import { AuthProvider } from '@/features/auth/components/AuthProvider';
import Layout from '@/components/layout/Layout';
import LoadingScreen from '@/components/ui/LoadingScreen';

// Lazy loading utility with TypeScript support
const lazyWithPrefetch = <T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> & { preload: () => Promise<{ default: T }> } => {
  const Component = lazy(factory);
  (Component as any).preload = factory;
  return Component as React.LazyExoticComponent<T> & { preload: () => Promise<{ default: T }> };
};

// Lazy loaded pages with explicit typing
const Services = lazyWithPrefetch(() => import('@/pages/services/Services'));
const Portfolio = lazyWithPrefetch(() => import('@/pages/portfolio/Portfolio'));
const Contact = lazyWithPrefetch(() => import('@/pages/contact/Contact'));
const NotFound = lazyWithPrefetch(() => import('@/pages/error/NotFound'));

// Static import for frequently accessed page
import Home from '@/pages/home/Home';

const App = (): ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div id="smooth-wrapper" className="relative">
            <div id="smooth-content">
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="services" element={<Services />} />
                    <Route path="portfolio" element={<Portfolio />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </div>
          </div>
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
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;