import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import ProjectFlowModal from './ProjectFlowModal';

const Home: React.FC = () => {
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
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      const heroTimeline = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 0.8 },
      });

      heroTimeline
        .from(logoRef.current, { y: 30, opacity: 0 })
        .from(buttonsRef.current?.children, { y: 20, opacity: 0, stagger: 0.15 }, '-=0.3');

      if (servicesButtonRef.current && servicesShineRef.current) {
        const servicesTl = gsap.timeline({ paused: true });
        servicesTl
          .to(servicesShineRef.current, {
            x: '200%',
            duration: 1,
            ease: 'power2.inOut',
          })
          .to(
            servicesButtonRef.current,
            {
              scale: 1.05,
              duration: 0.3,
              ease: 'back.out(1.7)',
            },
            0
          );

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
          .to(
            contactButtonRef.current,
            {
              scale: 1.05,
              duration: 0.3,
              ease: 'back.out(1.7)',
            },
            0
          );

        contactButtonRef.current.addEventListener('mouseenter', () => contactTl.play());
        contactButtonRef.current.addEventListener('mouseleave', () => contactTl.reverse());
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      <main className="relative min-h-[100dvh] w-full bg-gradient-to-b from-background via-background to-background/95 text-foreground">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/2 to-transparent pointer-events-none" />
        
        <article
          ref={heroRef}
          className="relative min-h-[calc(100dvh-5rem)] pt-20 flex flex-col items-center justify-center"
        >
          <div className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={logoRef} className="w-full transform-gpu">
              <Logo />
            </div>

            <nav
              ref={buttonsRef}
              className="mt-12 md:mt-16 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-6 sm:gap-8 max-w-lg mx-auto px-4 sm:px-0"
              aria-label="Primary navigation"
            >
              <button
                ref={servicesButtonRef}
                onClick={() => navigate('/services')}
                className="group relative px-8 py-4 bg-primary text-white text-base md:text-lg font-medium overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 hover:bg-primary-light transition-colors duration-300 sm:flex-1 rounded-[2rem] hover:rounded-xl transition-all"
                aria-label="View our services"
              >
                <div
                  ref={servicesShineRef}
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                  aria-hidden="true"
                />
                <div className="relative flex items-center justify-center gap-3">
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                  <span>View Our Services</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                </div>
              </button>

              <button
                ref={contactButtonRef}
                onClick={() => setIsModalOpen(true)}
                className="group relative px-8 py-4 text-base md:text-lg font-medium overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 sm:flex-1 [clip-path:polygon(0%_0%,100%_0%,95%_50%,100%_100%,0%_100%,5%_50%)]"
                aria-label="Start your project"
              >
                <div
                  ref={contactBorderRef}
                  className="absolute inset-0 bg-gradient-to-r from-primary via-primary-light to-primary"
                  aria-hidden="true"
                />
                <div className="absolute inset-[2px] bg-background [clip-path:polygon(0%_0%,100%_0%,95%_50%,100%_100%,0%_100%,5%_50%)]" />
                <div className="relative z-10 flex items-center justify-center gap-3 text-foreground group-hover:text-primary transition-colors duration-300">
                  <span>Start Your Project</span>
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </div>
              </button>
            </nav>
          </div>
        </article>
      </main>
      <ProjectFlowModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Home;