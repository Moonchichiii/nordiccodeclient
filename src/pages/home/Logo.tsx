// src/components/home/Logo.tsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Logo = () => {
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const nordicRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const worksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animation timeline
      const tl = gsap.timeline({
        defaults: {
          ease: "power4.out",
          duration: 1.2
        }
      });

      tl.from(nordicRef.current, {
        yPercent: -100,
        opacity: 0,
        rotateZ: 10,
      })
      .from(codeRef.current, {
        scale: 2,
        opacity: 0,
        rotationX: -45,
      }, "-=0.8")
      .from(worksRef.current, {
        yPercent: 100,
        opacity: 0,
        rotateZ: -10,
      }, "-=0.8");

      // Hover animations
      const hoverTl = gsap.timeline({ paused: true });
      
      hoverTl
        .to([nordicRef.current, worksRef.current], {
          scale: 1.1,
          duration: 0.3
        })
        .to(codeRef.current, {
          scale: 1.15,
          duration: 0.3,
          color: "#fbbf24",
          ease: "power2.out"
        }, 0);

      // Add hover event listeners
      const container = logoContainerRef.current;
      
      if (container) {
        container.addEventListener('mouseenter', () => hoverTl.play());
        container.addEventListener('mouseleave', () => hoverTl.reverse());
      }

      return () => {
        if (container) {
          container.removeEventListener('mouseenter', () => hoverTl.play());
          container.removeEventListener('mouseleave', () => hoverTl.reverse());
        }
      };
    }, logoContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={logoContainerRef}
      className="relative p-4 cursor-pointer"
      style={{ perspective: "1000px" }}
    >
      <div className="relative grid place-items-center gap-2 select-none">
        <div ref={nordicRef} className="writing-mode-vertical">
          <span className="inline-block text-4xl md:text-5xl lg:text-6xl xl:text-7xl 
            font-light tracking-tight text-transparent bg-clip-text 
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
          <span className="block text-5xl md:text-6xl lg:text-7xl xl:text-8xl 
            font-black uppercase tracking-tighter text-transparent bg-clip-text 
            bg-gradient-to-r from-yellow-500 to-yellow-200 px-2"
            style={{
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              letterSpacing: '-0.05em'
            }}
          >
            Code
          </span>
        </div>
        
        <div ref={worksRef} className="writing-mode-vertical">
          <span className="inline-block text-4xl md:text-5xl lg:text-6xl xl:text-7xl 
            font-light tracking-tight text-transparent bg-clip-text 
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
  );
};

export default Logo;