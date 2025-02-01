import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

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
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    // Only run animations on desktop/tablet
    if (window.matchMedia('(min-width: 768px)').matches) {
      const ctx = gsap.context(() => {
        const mainTl = gsap.timeline({
          defaults: {
            ease: 'power4.out',
            duration: 1.2,
          },
        });

        // Initial logo animation
        mainTl
          .from(logoWrapperRef.current, {
            opacity: 0,
            duration: 0.1,
          })
          .from(nordicRef.current, {
            yPercent: -100,
            opacity: 0,
            rotateZ: 10,
          })
          .from(
            codeRef.current,
            {
              scale: 2,
              opacity: 0,
              rotationX: -45,
            },
            '-=0.8'
          )
          .from(
            worksRef.current,
            {
              yPercent: 100,
              opacity: 0,
              rotateZ: -10,
            },
            '-=0.8'
          );

        // Content animation
        mainTl
          .to(
            logoContainerRef.current,
            {
              x: () => {
                if (window.innerWidth >= 1280) return '-1vw';
                if (window.innerWidth >= 1024) return '-8vw';
                if (window.innerWidth >= 768) return '-4vw';
                return '0';
              },
              scale: () => {
                if (window.innerWidth >= 1024) return 0.95;
                if (window.innerWidth >= 768) return 0.95;
                return 1;
              },
              duration: 1,
              ease: 'power4.inOut',
            },
            '+=0.2'
          )
          .from(
            contentRef.current,
            {
              x: 50,
              opacity: 0,
              duration: 1,
              ease: 'power4.out',
            },
            '-=0.5'
          )
          .from(
            imageContainerRef.current,
            {
              x: 50,
              opacity: 0,
              duration: 1,
              ease: 'power4.out',
            },
            '-=0.8'
          );

        // Hover animation
        const hoverTl = gsap.timeline({ paused: true });
        hoverTl
          .to([nordicRef.current, worksRef.current], {
            scale: 1.1,
            duration: 0.3,
          })
          .to(
            codeRef.current,
            {
              scale: 1.15,
              duration: 0.3,
              color: '#fbbf24',
              ease: 'power2.out',
            },
            0
          );

        // Hover listeners
        const container = logoContainerRef.current;
        if (container && window.matchMedia('(hover: hover)').matches) {
          const playHover = () => hoverTl.play();
          const reverseHover = () => hoverTl.reverse();
          container.addEventListener('mouseenter', playHover);
          container.addEventListener('mouseleave', reverseHover);
          return () => {
            container.removeEventListener('mouseenter', playHover);
            container.removeEventListener('mouseleave', reverseHover);
          };
        }

        // Image mask animation
        gsap.to(maskRef.current, {
          attr: { d: "M0,0 A200,200 0 0,1 200,200 L0,200 Z" },
          duration: 10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }, logoContainerRef);

      return () => ctx.revert();
    }
  }, []);

  return (
    <section 
      className={`relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
      aria-label="Hero section"
    >
      {/* Desktop/Tablet Version */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Logo Section */}
        <div 
          ref={logoContainerRef}
          className="lg:col-span-4 relative cursor-pointer transform-gpu mx-auto lg:mx-0"
          style={{ perspective: '500px' }}
        >
          {/* Keep existing logo animation markup */}
          <div 
            ref={logoWrapperRef}
            className="relative grid place-items-center gap-3 select-none"
            aria-label="Nordic Code Works Logo"
          >
            {/* Keep Nordic CODE Works logo content */}
            <div ref={nordicRef} className="writing-mode-vertical">
              <span
                className="inline-block font-light tracking-tight text-transparent bg-clip-text 
                         bg-gradient-to-br from-yellow-500 to-yellow-200 transform -rotate-180"
                style={{
                  writingMode: 'vertical-rl',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                }}
              >
                Nordic
              </span>
            </div>
            <div ref={codeRef} className="relative">
              <span
                className="block font-black uppercase tracking-tighter text-transparent bg-clip-text 
                         bg-gradient-to-r from-yellow-500 to-yellow-200 px-2"
                style={{
                  fontSize: 'clamp(3rem, 6vw, 5rem)',
                  letterSpacing: '-0.05em',
                }}
              >
                Code
              </span>
            </div>
            <div ref={worksRef} className="writing-mode-vertical">
              <span
                className="inline-block font-light tracking-tight text-transparent bg-clip-text 
                         bg-gradient-to-br from-yellow-200 to-yellow-500"
                style={{
                  writingMode: 'vertical-rl',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                }}
              >
                Works
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div 
          className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
          ref={contentRef}
        >
          {/* Header spans full width */}
          <div className="md:col-span-2 space-y-4">
            <h1 className="text-3xl lg:text-4xl font-medium bg-clip-text text-transparent 
                       bg-gradient-to-r from-yellow-300 to-yellow-100">
              Crafting Digital Excellence
            </h1>
            <p className="text-lg text-gray-300/90 leading-relaxed">
              We transform complex ideas into elegant solutions while 
              maintaining robust security standards.
            </p>
          </div>
          
          {/* Left Column */}
          <div className="space-y-4">
            <h2 className="text-xl text-yellow-300/90 font-medium">
              Security-First Development
            </h2>
            <p className="text-base text-gray-300/90 leading-relaxed">
              In an era where AI powers development, we prioritize 
              human oversight and security-first practices.
            </p>
            
            {/* Masked Image - Moved inside left column */}
            <div 
              ref={imageContainerRef} 
              className="relative w-full aspect-square mt-6"
              aria-hidden="true"
            >
              <svg 
                width="100%" 
                height="100%" 
                viewBox="0 0 200 200" 
                preserveAspectRatio="xMidYMid slice"
                className="transform-gpu"
              >
                <defs>
                  <mask id="imageMask">
                    <path
                      ref={maskRef}
                      d="M0,0 A200,200 0 0,1 200,200 L0,200 Z"
                      fill="white"
                    />
                  </mask>
                </defs>

                <image
                  href="https://res.cloudinary.com/drl5k67we/image/upload/v1738282011/erasebg-transformed_1_rx6xqs.webp"
                  width="200"
                  height="200"
                  mask="url(#imageMask)"
                  preserveAspectRatio="xMidYMid slice"
                  loading="eager"
                />
              </svg>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ul className="space-y-4 text-base text-gray-300/90">
              {/* NEW: Emphasize your TypeScript+Django + CDN+GSAP */}
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 mt-1">→</span>
                <span>Modern <strong>TypeScript front end</strong> + secure <strong>Django back end</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 mt-1">→</span>
                <span>Optimized with a global <strong>CDN</strong> and snappy <strong>GSAP animations</strong></span>
              </li>

              {/* Existing bullet points */}
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 mt-1">→</span>
                <span>Manual code review and security audits ensure robust solutions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 mt-1">→</span>
                <span>AI-assisted development with human verification</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 mt-1">→</span>
                <span>Regular security assessments and updates</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 mt-1">→</span>
                <span>Continuous monitoring and improvement</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden flex flex-col items-center text-center pt-2">
        <div className="space-y-5 max-w-md mx-auto px-4">
          <h2 className="text-2xl font-medium text-yellow-300">
            Crafting Digital Excellence
          </h2>
          <p className="text-base text-gray-300/90 leading-relaxed">
            We transform complex ideas into secure, elegant solutions 
            that drive business growth.
          </p>
          <div className="py-2"> 
            <h3 className="text-lg font-medium text-yellow-300 mb-3">Our Security Promise:</h3>
            <ul className="text-base text-gray-300/90 space-y-3">
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">✓</span>
                Manual code review & security audits
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">✓</span>
                AI-assisted with human verification
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">✓</span>
                Regular security updates
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">✓</span>
                Continuous monitoring
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Logo;
