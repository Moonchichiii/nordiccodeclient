import { useState, useEffect, useRef } from 'react';
import { throttle } from '@/utils/throttle';

export function useScrollDirection(): 'up' | 'down' {
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
    const lastScroll = useRef<number>(0);

    useEffect(() => {
        const SCROLL_THRESHOLD = 10;

        const updateScrollDirection = () => {
            const scrollY = window.scrollY;

            if (Math.abs(scrollY - lastScroll.current) < SCROLL_THRESHOLD) {
                return;
            }

            const direction = scrollY > lastScroll.current ? 'down' : 'up';
            if (direction !== scrollDirection) {
                setScrollDirection(direction);
            }

            lastScroll.current = scrollY > 0 ? scrollY : 0;
        };

        const throttledUpdate = throttle(updateScrollDirection, 100);

        window.addEventListener('scroll', throttledUpdate, { passive: true });
        return () => window.removeEventListener('scroll', throttledUpdate);
    }, [scrollDirection]);

    return scrollDirection;
}