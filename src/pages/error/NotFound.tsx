import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Home, ArrowRight, Coffee, Code } from 'lucide-react';

const NotFound = (): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main content animation
      gsap.from(titleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Code lines animation
      gsap.from(codeRef.current?.children, {
        x: -20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.4,
      });

      // Coffee steam animation
      gsap.to('.coffee-steam', {
        y: -10,
        opacity: 0.6,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });

      // Code typing effect
      const typingTimeline = gsap.timeline({ repeat: -1 });
      typingTimeline
        .to('.typing-cursor', {
          opacity: 0,
          duration: 0.5,
          repeat: 3,
          yoyo: true,
          ease: 'power2.inOut',
        })
        .to('.typing-cursor', {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.inOut',
        });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-[calc(100dvh-5rem)] bg-background text-foreground">
      <div 
        ref={containerRef}
        className="container mx-auto px-4 py-20"
      >
        <div className="max-w-2xl mx-auto text-center">
          {/* Title Section */}
          <div ref={titleRef} className="mb-12">
            <h1 className="text-6xl sm:text-7xl font-light mb-6">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
                404
              </span>
              <span className="block text-3xl sm:text-4xl mt-4">
                Page Not Found
              </span>
            </h1>
            <p className="text-xl text-foreground-alt">
              Looks like you've ventured into uncharted territory!
            </p>
          </div>

          {/* Code Section */}
          <div 
            ref={codeRef}
            className="mb-12 p-6 rounded-2xl bg-background-alt border border-primary/10
              text-left font-mono text-sm space-y-2"
          >
            <div className="text-foreground-alt">
              <span className="text-primary-light">const</span>{" "}
              <span className="text-primary">findPage</span> = () =>{" "}
              <span className="text-primary-light">{"{"}</span>
            </div>
            <div className="pl-4">
              <span className="text-primary">if</span> (page === <span className="text-primary-light">'404'</span>) {"{"}
            </div>
            <div className="pl-8 flex items-center gap-2">
              <span>return</span>{" "}
              <Coffee className="w-4 h-4 text-primary inline-block" />
              <span className="coffee-steam text-xs opacity-40">~</span>
              <span className="typing-cursor">|</span>
            </div>
            <div className="pl-4">{"}"}</div>
            <div className="text-primary-light">{"}"}</div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="group relative px-8 py-4 text-base font-medium overflow-hidden
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                focus-visible:ring-offset-2 rounded-[2rem] hover:rounded-xl transition-all
                bg-primary text-white hover:bg-primary-light inline-flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              <span>Return Home</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link
              to="/contact"
              className="group px-8 py-4 rounded-[2rem] hover:rounded-xl border border-primary/20 
                hover:border-primary text-foreground-alt hover:text-primary transition-all duration-300
                inline-flex items-center gap-2"
            >
              <Code className="w-5 h-5" />
              <span>Report Issue</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;