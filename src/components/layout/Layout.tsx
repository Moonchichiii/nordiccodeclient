import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "./useTheme";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { throttle } from "@/utils/throttle";

gsap.registerPlugin(ScrollTrigger);

const Home = lazy(() => import('@/pages/home/home'));
const Services = lazy(() => import('@/pages/services/Services'));
const Portfolio = lazy(() => import('@/pages/portfolio/Portfolio'));
const Contact = lazy(() => import('@/pages/Contact/Contact'));

const Layout = () => {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const layoutRef = useRef<HTMLDivElement>(null);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [isHomeVisible, setIsHomeVisible] = useState(true);
  const [showHamburger, setShowHamburger] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;
      setIsScrollingUp(currentScrollY < lastScrollY.current);
      lastScrollY.current = currentScrollY;
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDashboard = pathname.includes('/dashboard');

  useEffect(() => {
    if (isDashboard || !layoutRef.current) return;
    
    const ctx = gsap.context(() => {
      // Create ScrollTrigger for header transformation
      ScrollTrigger.create({
        trigger: ".home-section",
        start: "top top",
        end: "30% top",
        onLeave: () => {
          setIsHomeVisible(false);
          setShowHamburger(true);
        },
        onEnterBack: () => {
          setIsHomeVisible(true);
          setShowHamburger(false);
        }
      });

      // Animate sections with improved performance
      const sections = gsap.utils.toArray<HTMLElement>('.section');
      sections.forEach((section) => {
        const content = section.querySelector('.section-content');
        if (!content) return;

        gsap.set(content, { opacity: 0, y: 50 });
        
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "center center",
          onEnter: () => {
            gsap.to(content, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              overwrite: true,
              force3D: true
            });
          },
          onLeaveBack: () => {
            gsap.to(content, {
              opacity: 0,
              y: 50,
              duration: 1,
              ease: "power3.out",
              overwrite: true,
              force3D: true
            });
          }
        });
      });
    });

    return () => ctx.revert();
  }, [isDashboard]);

  return (
    <div 
      ref={layoutRef} 
      className="min-h-screen flex flex-col bg-background text-foreground overflow-hidden section-transition"
    >
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme}
        isScrollingUp={isScrollingUp}
        isHomeVisible={isHomeVisible}
        showHamburger={showHamburger}
      />

      <main className="flex-1">
        {isDashboard ? (
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        ) : (
          <Suspense fallback={<LoadingScreen />}>
            <section className="section home-section">
              <div className="section-gradient" aria-hidden="true" />
              <div className="section-content">
                <Home />
              </div>
            </section>
            <section className="section min-h-screen bg-background-alt section-transition">
              <div className="section-content">
                <Services />
              </div>
            </section>
            <section className="section min-h-screen bg-background section-transition">
              <div className="section-content">
                <Portfolio />
              </div>
            </section>
            <section className="section min-h-screen bg-background-alt section-transition">
              <div className="section-content">
                <Contact />
              </div>
            </section>
          </Suspense>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;