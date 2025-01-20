import { useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import Logo from '@pages/home/Logo';

const Home = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroTimeline = gsap.timeline({
        defaults: {
          ease: 'power3.out',
          duration: 0.8
        }
      });
      
      heroTimeline
        .from(logoRef.current, {
          y: 30,
          opacity: 0,
        })
        .from(descriptionRef.current, {
          y: 20,
          opacity: 0,
        }, '-=0.4')
        .from(buttonsRef.current, {
          y: 20,
          opacity: 0,
        }, '-=0.3');
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-4"
      >
        <div className="max-w-5xl mx-auto text-center space-y-12">
          {/* Logo Section */}
          <div 
            ref={logoRef}
            className="transform transition-transform duration-500 py-8"
          >
            <Logo className="w-full max-w-2xl mx-auto h-auto" />
          </div>
          
          <p 
            ref={descriptionRef}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Crafting high-performance digital experiences with Nordic precision.
          </p>

          <div 
            ref={buttonsRef}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              onClick={() => navigate('/services')}
              className="group px-8 py-3 rounded-lg bg-yellow-500 text-gray-900 hover:bg-yellow-400 
              transition-all duration-300 text-base font-medium inline-flex items-center
              focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:ring-offset-2 
              focus:ring-offset-gray-900"
            >
              <span>Explore Services</span>
              <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="px-8 py-3 rounded-lg border border-yellow-500/10 hover:border-yellow-500/30 
              transition-all duration-300 text-base font-medium text-white
              focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:ring-offset-2 
              focus:ring-offset-gray-900"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;