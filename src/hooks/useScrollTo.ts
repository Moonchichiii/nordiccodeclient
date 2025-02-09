import { useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export const useScrollTo = () => {
  return useCallback((sectionClass: string) => {
    gsap.to(window, {
      duration: 1,
      scrollTo: {
        y: `#${sectionClass}`,
        offsetY: 80,
        autoKill: false
      },
      ease: 'power3.inOut'
    });
  }, []);
};