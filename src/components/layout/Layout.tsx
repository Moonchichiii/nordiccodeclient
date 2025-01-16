import { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { gsap } from 'gsap';
import Header from './Header';
import Footer from './Footer';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { throttle } from '@/utils/throttle';

type Theme = 'night' | 'dawn' | 'day' | 'dusk';

const Layout: React.FC = () => {
  const [timeTheme, setTimeTheme] = useState<Theme>('night');
  const mainRef = useRef<HTMLDivElement>(null);
  const scrollDirection = useScrollDirection();

  // Throttled theme update function
  const updateTheme = throttle(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) setTimeTheme('dawn');
    else if (hour >= 12 && hour < 18) setTimeTheme('day');
    else if (hour >= 18 && hour < 21) setTimeTheme('dusk');
    else setTimeTheme('night');
  }, 1000);

  // Theme update interval
  useEffect(() => {
    updateTheme();
    const interval = setInterval(updateTheme, 60000);
    return () => clearInterval(interval);
  }, []);

  // Page transition animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        paused: true,
        defaults: {
          duration: 0.6,
          ease: 'power2.out',
        },
      });

      timeline
        .fromTo(
          mainRef.current,
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            clearProps: 'all',
            onComplete: () => gsap.set(mainRef.current, { clearProps: 'all' }),
          }
        )
        .play();
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      <Header 
        timeTheme={timeTheme} 
        setTimeTheme={setTimeTheme}
        isScrollingUp={scrollDirection === 'up'} 
      />
      
      <main 
        ref={mainRef}
        className="relative flex-grow pt-16 z-10"
        style={{ 
          willChange: 'opacity, transform',
          isolation: 'isolate' 
        }}
      >
        <div 
          className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black opacity-50 pointer-events-none"
          style={{ willChange: 'opacity' }}
        />
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;