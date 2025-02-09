import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const nordicRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const worksRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      const mainTl = gsap.timeline({
        defaults: { ease: 'power4.out', duration: 1.2 },
      });

      mainTl
        .from(logoWrapperRef.current, { opacity: 0, duration: 0.1 })
        .from(nordicRef.current, { yPercent: -100, opacity: 0, rotateZ: 10 })
        .from(codeRef.current, { scale: 2, opacity: 0, rotationX: -45 }, '-=0.8')
        .from(worksRef.current, { yPercent: 100, opacity: 0, rotateZ: -10 }, '-=0.8');

      const hoverTl = gsap.timeline({ paused: true });
      hoverTl
        .to([nordicRef.current, worksRef.current], { scale: 1.1, duration: 0.3 })
        .to(codeRef.current, { scale: 1.15, duration: 0.3, color: 'rgb(var(--primary))', ease: 'power2.out' }, 0);

      const container = logoContainerRef.current;
      if (container && window.matchMedia('(hover: hover)').matches) {
        container.addEventListener('mouseenter', () => hoverTl.play());
        container.addEventListener('mouseleave', () => hoverTl.reverse());
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      className={`relative w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
      aria-label="Hero section"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
      <div
  ref={logoContainerRef}
  className="relative cursor-pointer transform-gpu mx-auto lg:mx-0 order-2 lg:order-1 perspective-1000"
>
          <div
            ref={logoWrapperRef}
            className="relative grid place-items-center gap-3 select-none"
            aria-label="Nordic Code Works Logo"
          >
            <div ref={nordicRef} className="writing-mode-vertical">
              <span
                className="inline-block font-light tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary-light transform -rotate-180"
                style={{ writingMode: 'vertical-rl', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
              >
                Nordic
              </span>
            </div>
            <div ref={codeRef} className="relative">
              <span
                className="block font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light px-2"
                style={{ fontSize: 'clamp(4rem, 8vw, 6rem)', letterSpacing: '-0.05em' }}
              >
                Code
              </span>
            </div>
            <div ref={worksRef} className="writing-mode-vertical">
              <span
                className="inline-block font-light tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-primary-light to-primary"
                style={{ writingMode: 'vertical-rl', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
              >
                Works
              </span>
            </div>
          </div>
        </div>

        <div ref={contentRef} className="space-y-8 order-1 lg:order-2">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-medium">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
                Crafting Digital
              </span>
              <span className="block">Excellence</span>
            </h1>
            <p className="text-xl text-foreground-alt leading-relaxed max-w-2xl">
              We transform complex ideas into elegant solutions while maintaining robust security standards.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-primary">Security-First Development</h2>
              <p className="text-foreground-alt leading-relaxed">
                In an era where AI powers development, we prioritize human oversight and security-first practices.
              </p>
            </div>

            <div className="space-y-6">
              <ul className="space-y-4 text-foreground-alt">
                {[
                  'Modern TypeScript front end',
                  'Secure Django back end',
                  'Global CDN optimization',
                  'GSAP animations',
                  'Manual code review',
                  'Regular security updates'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 group">
                    <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Logo;
