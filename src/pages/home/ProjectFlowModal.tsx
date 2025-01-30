import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import Logo from '@pages/home/Logo';

import ProjectFlowModal from '@/pages/home/ProjectFlowModal';

const Home = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const heroRef = useRef<HTMLElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const servicesButtonRef = useRef<HTMLButtonElement>(null);
    const contactButtonRef = useRef<HTMLButtonElement>(null);
    const servicesShineRef = useRef<HTMLDivElement>(null);
    const contactBorderRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      // Only run animations on desktop/tablet
      if (window.matchMedia('(min-width: 768px)').matches) {
        const ctx = gsap.context(() => {
          const heroTimeline = gsap.timeline({
            defaults: {
              ease: 'power3.out',
              duration: 0.8,
            },
          });
  
          // Entry animations
          heroTimeline
            .from(logoRef.current, {
              y: 30,
              opacity: 0,
            })
            .from(buttonsRef.current?.children, {
              y: 20,
              opacity: 0,
              stagger: 0.15,
            }, '-=0.3');
  
          // Button hover animations
          if (servicesButtonRef.current && servicesShineRef.current) {
            const servicesTl = gsap.timeline({ paused: true });
            servicesTl
              .to(servicesShineRef.current, {
                x: '200%',
                duration: 1,
                ease: 'power2.inOut',
              })
              .to(servicesButtonRef.current, {
                scale: 1.05,
                duration: 0.3,
                ease: 'back.out(1.7)',
              }, 0);
  
            servicesButtonRef.current.addEventListener('mouseenter', () => servicesTl.play());
            servicesButtonRef.current.addEventListener('mouseleave', () => servicesTl.reverse());
          }
  
          if (contactButtonRef.current && contactBorderRef.current) {
            const contactTl = gsap.timeline({ paused: true });
            contactTl
              .to(contactBorderRef.current, {
                rotation: 180,
                duration: 0.8,
                ease: 'power2.inOut',
              })
              .to(contactButtonRef.current, {
                scale: 1.05,
                duration: 0.3,
                ease: 'back.out(1.7)',
              }, 0);
  
            contactButtonRef.current.addEventListener('mouseenter', () => contactTl.play());
            contactButtonRef.current.addEventListener('mouseleave', () => contactTl.reverse());
          }
        }, heroRef);
  
        return () => ctx.revert();
      }
    }, []);
  
    return (
      <>
        <main className="relative min-h-screen w-full bg-gray-900 text-white overflow-hidden">
          <article
            ref={heroRef}
            className="relative min-h-screen flex flex-col items-center justify-center 
                       px-4 sm:px-6 lg:px-8 py-8 md:py-0"
          >
            <div className="w-full max-w-6xl mx-auto">
              <div
                ref={logoRef}
                className="w-full transform-gpu"
              >
                <Logo />
              </div>
  
              <nav
                ref={buttonsRef}
                className="mt-12 md:mt-16 flex flex-col sm:flex-row items-stretch sm:items-center 
                         justify-center gap-6 sm:gap-8 max-w-lg mx-auto px-4 sm:px-0"
                aria-label="Primary navigation"
              >
                <button
                  ref={servicesButtonRef}
                  onClick={() => navigate('/services')}
                  className="group relative px-6 py-4 md:px-6 md:py-4
                           bg-gradient-to-r from-yellow-400 to-yellow-600
                           text-gray-900 text-base md:text-lg font-medium
                           rounded-xl overflow-hidden
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
                           focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900
                           sm:flex-1"
                  aria-label="View our services"
                >
                  <div 
                    ref={servicesShineRef}
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent 
                              via-white/30 to-transparent -translate-x-full"
                    aria-hidden="true"
                  />
                  <div className="relative flex items-center justify-center gap-3">
                    <Sparkles className="w-5 h-5" aria-hidden="true" />
                    <span>View Our Services</span>
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </div>
                </button>
  
                <button
                  ref={contactButtonRef}
                  onClick={() => setIsModalOpen(true)}
                  className="group relative px-6 py-4 md:px-6 md:py-4
                           text-white text-base md:text-lg font-medium
                           rounded-xl overflow-hidden
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
                           focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900
                           sm:flex-1"
                  aria-label="Start your project"
                >
                  <div
                    ref={contactBorderRef} 
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 
                              rounded-xl"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-[2px] bg-gray-900 rounded-lg" />
                  <span className="relative z-10">Start Your Project</span>
                </button>
              </nav>
            </div>
          </article>
        </main>
        <ProjectFlowModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </>
    );
  };
  
  export default Home;