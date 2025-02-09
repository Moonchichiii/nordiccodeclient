import { useLayoutEffect, useRef, DependencyList } from 'react';
import { gsap } from 'gsap';

export function useGSAP(callback: (ctx: GSAP.Context) => void, deps: DependencyList = []) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(callback, ref);
    return () => ctx.revert();
    }, deps);
  return ref;
}