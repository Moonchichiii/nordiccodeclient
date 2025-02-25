import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { Shield, Sparkles, Code2, Users, Coins, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, Draggable);

const sellingPoints = [
  {
    icon: Shield,
    title: 'Security-First',
    description: 'Enhanced security focus with human verification',
  },
  {
    icon: Coins,
    title: 'One-Time Cost',
    description: 'No recurring fees - own your website completely',
  },
  {
    icon: Sparkles,
    title: 'AI-Assisted',
    description: 'AI-powered planning with human expertise',
  },
  {
    icon: Code2,
    title: 'Custom Development',
    description: 'Professional development, not templates',
  },
  {
    icon: Users,
    title: 'Direct Access',
    description: 'Direct developer interaction',
  },
  {
    icon: Clock,
    title: 'Long-Term Value',
    description: 'More cost-effective over time',
  },
];

const InfiniteScroller = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollerContentRef = useRef<HTMLDivElement>(null);
  const scrollTweenRef = useRef<gsap.core.Tween>();
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const scrollerContent = scrollerContentRef.current;
    
    if (!scroller || !scrollerContent) return;

    // Clone content for seamless loop
    scrollerContent.innerHTML += scrollerContent.innerHTML;

    // Create the scrolling animation
    const createScrollTween = () => {
      if (scrollTweenRef.current) scrollTweenRef.current.kill();
      
      const contentWidth = scrollerContent.querySelector('.scroller-item')!.offsetWidth * 
                          (sellingPoints.length);
      
      scrollTweenRef.current = gsap.to(scrollerContent, {
        x: -contentWidth,
        duration: 20,
        ease: 'none',
        repeat: -1,
        paused: isDraggingRef.current,
      });
    };

    createScrollTween();

    // Make it draggable
    const draggable = Draggable.create(scrollerContent, {
      type: 'x',
      inertia: true,
      onDragStart: () => {
        isDraggingRef.current = true;
        if (scrollTweenRef.current) scrollTweenRef.current.pause();
      },
      onDragEnd: () => {
        isDraggingRef.current = false;
        if (scrollTweenRef.current) scrollTweenRef.current.play();
      },
      onDrag: function() {
        // Check bounds and wrap around
        const contentWidth = scrollerContent.querySelector('.scroller-item')!.offsetWidth * 
                           sellingPoints.length;
        
        if (this.x < -contentWidth) {
          this.x += contentWidth;
        } else if (this.x > 0) {
          this.x -= contentWidth;
        }
      }
    })[0];

    // Pause on hover
    scroller.addEventListener('mouseenter', () => {
      if (scrollTweenRef.current && !isDraggingRef.current) {
        scrollTweenRef.current.pause();
      }
    });

    scroller.addEventListener('mouseleave', () => {
      if (scrollTweenRef.current && !isDraggingRef.current) {
        scrollTweenRef.current.play();
      }
    });

    // Handle resize
    const handleResize = () => {
      createScrollTween();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (scrollTweenRef.current) scrollTweenRef.current.kill();
      draggable.kill();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden py-8 select-none">
      {/* Gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      
      {/* Scroller */}
      <div ref={scrollerRef} className="relative cursor-grab active:cursor-grabbing">
        <div ref={scrollerContentRef} className="flex">
          {sellingPoints.map((point, index) => (
            <div
              key={index}
              className="scroller-item flex-shrink-0 px-8"
            >
              <div className="flex items-center gap-4 group">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <point.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="absolute -inset-2 rounded-[20px] bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                    {point.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {point.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteScroller;