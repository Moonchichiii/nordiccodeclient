import { useEffect, useRef } from 'react';
import { ArrowUpRight, ChevronRight, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

interface ServiceTierProps {
  title: string;
  price: string;
  features: string[];
  recommended?: boolean;
  onSelect: () => void;
}

const AnimatedBackground = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const blobs = backgroundRef.current?.children[0].children;
      if (blobs) {
        gsap.fromTo(blobs, 
          { scale: 0, opacity: 0 },
          { 
            scale: 1, 
            opacity: 0.15, 
            duration: 2,
            stagger: 0.1,
            ease: "power3.out"
          }
        );
      }
    }, backgroundRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={backgroundRef} className="absolute inset-0 overflow-hidden opacity-5">
      <div className="absolute w-full h-full">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-yellow-400 blur-3xl animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 400 + 100}px`,
              height: `${Math.random() * 400 + 100}px`,
              animationDelay: `${Math.random() * 10}s`,
              transform: 'scale(0)',
              opacity: 0
            }}
          />
        ))}
      </div>
    </div>
  );
};

const ServiceTier = ({ title, price, features, recommended = false, onSelect }: ServiceTierProps) => (
  <div 
    className={`relative p-px rounded-xl overflow-hidden transition-transform duration-300 hover:scale-[1.02] 
    ${recommended ? 'bg-gradient-to-br from-yellow-500/50 to-yellow-600/50' : 'bg-gray-800'}`}
  >
    <div className={`h-full p-6 rounded-xl ${recommended ? 'bg-gray-900/95' : 'bg-gray-900/95'}`}>
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 animate-float">
          <span className="bg-yellow-500 text-gray-900 px-3 py-px rounded-full text-xs font-semibold
          flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            Most Popular
          </span>
        </div>
      )}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-white">{price}</span>
          <span className="ml-2 text-sm text-gray-400">SEK</span>
        </div>
        <ul className="space-y-3 text-sm" role="list">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              <span className="text-yellow-500 text-lg leading-none" aria-hidden="true">•</span>
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
        <button 
          onClick={onSelect}
          className={`group w-full py-2.5 px-4 rounded-lg text-sm font-medium 
          transition-all duration-300 flex items-center justify-center space-x-2 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
          ${recommended 
            ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400 focus:ring-yellow-500/50' 
            : 'bg-gray-800 text-white border border-yellow-500/10 hover:border-yellow-500/30 focus:ring-yellow-500/30'
          }`}
        >
          <span>Get Started</span>
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 
          group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      const heroTimeline = gsap.timeline();
      
      heroTimeline
        .from('.hero-badge', {
          y: -20,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out'
        })
        .from('.hero-title', {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, '-=0.3')
        .from('.hero-description', {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out'
        }, '-=0.4')
        .from('.hero-buttons', {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out'
        }, '-=0.3');

      // Services section scroll animation
      gsap.from(servicesRef.current, {
        scrollTrigger: {
          trigger: servicesRef.current,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1
        },
        y: 50,
        opacity: 0
      });
    });

    return () => ctx.revert();
  }, []);

  const handleServiceSelect = (tier: string) => {
    // Handle service selection
    navigate('/contact', { state: { selectedTier: tier } });
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      <AnimatedBackground />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-4 z-10"
      >
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="hero-badge inline-block">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
            bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
              <Sparkles className="w-3 h-3 mr-1.5" />
              Shaping 2025
            </span>
          </div>
          <h1 className="hero-title text-5xl md:text-7xl font-bold leading-tight">
            <span className="gradient-text">
              Nordic Code Works
            </span>
          </h1>
          <p className="hero-description text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Crafting high-performance digital experiences with Nordic precision.
          </p>
          <div className="hero-buttons flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => navigate('/services')}
              className="group px-6 py-2.5 rounded-lg bg-yellow-500 text-gray-900 hover:bg-yellow-400 
              transition-all duration-300 text-sm font-medium inline-flex items-center
              focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:ring-offset-2 
              focus:ring-offset-gray-900"
            >
              <span>Explore Services</span>
              <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="px-6 py-2.5 rounded-lg border border-yellow-500/10 hover:border-yellow-500/30 
              transition-all duration-300 text-sm font-medium text-white
              focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:ring-offset-2 
              focus:ring-offset-gray-900"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">Choose Your Package</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Select the perfect solution for your digital needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ServiceTier
              title="Static Frontend Solution"
              price="6,300"
              features={[
                'React with Vite',
                'Modern responsive design',
                'Basic SEO optimization',
              ]}
              onSelect={() => handleServiceSelect('static')}
            />
            <ServiceTier
              title="Mid-Tier Solution"
              price="11,200"
              recommended={true}
              features={[
                'Everything in Static Frontend',
                'Backend API with Django',
                'Database integration',
              ]}
              onSelect={() => handleServiceSelect('mid-tier')}
            />
            <ServiceTier
              title="Enterprise Full-Stack"
              price="20,200"
              features={[
                'Everything in Mid-Tier',
                'Advanced security features',
                'Cloud infrastructure setup',
              ]}
              onSelect={() => handleServiceSelect('enterprise')}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;