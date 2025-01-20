import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { throttle } from '@/utils/throttle';

type Theme = 'night' | 'dawn' | 'day' | 'dusk';

const Layout: React.FC = () => {
  const [timeTheme, setTimeTheme] = useState<Theme>('night');
  const scrollDirection = useScrollDirection();

  const updateTheme = throttle(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) setTimeTheme('dawn');
    else if (hour >= 12 && hour < 18) setTimeTheme('day');
    else if (hour >= 18 && hour < 21) setTimeTheme('dusk');
    else setTimeTheme('night');
  }, 1000);

  useEffect(() => {
    updateTheme();
    const interval = setInterval(updateTheme, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <Header
        timeTheme={timeTheme}
        setTimeTheme={setTimeTheme}
        isScrollingUp={scrollDirection === 'up'}
      />
      <main className="relative flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;