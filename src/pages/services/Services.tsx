import { useEffect, useRef } from 'react';
import { ArrowUpRight, Sparkles, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

interface ServiceTierProps {
  title: string;
  priceEUR: string;
  priceSEK: string;
  features: string[];
  recommended?: boolean;
  onSelect: () => void;
}

const ServiceTier = ({
  title,
  priceEUR,
  priceSEK,
  features,
  recommended = false,
  onSelect,
}: ServiceTierProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current && buttonRef.current && shineRef.current) {
      const tl = gsap.timeline({ paused: true });
      tl.to(cardRef.current, {
        y: -5,
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out',
      });

      const buttonTl = gsap.timeline({ paused: true });
      buttonTl
        .to(shineRef.current, {
          x: '200%',
          duration: 1,
          ease: 'power2.inOut',
        })
        .to(buttonRef.current, {
          scale: 1.05,
          duration: 0.3,
          ease: 'back.out(1.7)',
        }, 0);

      cardRef.current.addEventListener('mouseenter', () => tl.play());
      cardRef.current.addEventListener('mouseleave', () => tl.reverse());
      buttonRef.current.addEventListener('mouseenter', () => buttonTl.play());
      buttonRef.current.addEventListener('mouseleave', () => buttonTl.reverse());
    }
  }, []);

  return (
    <div 
      ref={cardRef}
      className="relative p-6 rounded-2xl bg-background border border-primary/10 hover:border-primary/20
      transition-colors duration-300 transform-gpu"
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-white px-4 py-1 rounded-full text-xs font-medium
          flex items-center gap-1.5 shadow-lg shadow-primary/20">
            <Sparkles className="w-3 h-3" />
            Most Popular
          </span>
        </div>
      )}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-light text-foreground">{title}</h3>
          <div className="mt-2">
            <div className="flex items-baseline">
              <span className="text-3xl font-light text-foreground">{priceEUR}</span>
              <span className="ml-2 text-sm text-foreground-alt">EUR</span>
            </div>
            <div className="flex items-baseline mt-1">
              <span className="text-lg font-light text-foreground-alt">{priceSEK}</span>
              <span className="ml-2 text-xs text-foreground-alt/70">SEK</span>
            </div>
          </div>
        </div>
        <ul className="space-y-3 text-sm border-t border-primary/10 pt-6" role="list">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 group">
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
              <span className="text-foreground-alt">{feature}</span>
            </li>
          ))}
        </ul>
        <button 
          ref={buttonRef}
          onClick={onSelect}
          className="group relative w-full py-3 px-4 text-sm font-medium overflow-hidden
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
          focus-visible:ring-offset-2 rounded-[2rem] hover:rounded-xl transition-all
          bg-primary text-white hover:bg-primary-light"
        >
          <div
            ref={shineRef}
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
            aria-hidden="true"
          />
          <div className="relative flex items-center justify-center gap-2">
            <span>Get Started</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </button>
      </div>
    </div>
  );
};

const Services = () => {
  const navigate = useNavigate();
  const servicesRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      tl.from(titleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
      }).from(contentRef.current?.children, {
        y: 20,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
      }, '-=0.4');

      // Scroll-triggered animations for features sections
      gsap.from('.feature-card', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.feature-section',
          start: 'top center+=100',
          toggleActions: 'play none none reverse',
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="container mx-auto px-4 py-20">
      <div className="services-content">
        {/* Hero Section */}
        <div className="mb-16" ref={titleRef}>
          <h1 className="text-5xl sm:text-6xl font-light mb-6">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
              Our Services
            </span>
          </h1>
          <p className="text-xl text-foreground-alt max-w-2xl">
            From concept to deployment, we deliver scalable and maintainable 
            solutions using a modern TypeScript front end, Django back end, 
            and cloud-based CDN for top performance. All animations powered by GSAP.
          </p>
        </div>

        {/* Service Tiers */}
        <div ref={contentRef}>
          <section className="mb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ServiceTier
                title="Static Frontend"
                priceEUR="600"
                priceSEK="6,300"
                features={[
                  'Modern TypeScript-based front end',
                  'Responsive & mobile-friendly design',
                  'Basic on-page SEO optimization',
                ]}
                onSelect={() => navigate('/contact', { state: { selectedTier: 'static' }})}
              />
              <ServiceTier
                title="Full Stack"
                priceEUR="1,100"
                priceSEK="11,200"
                recommended
                features={[
                  'Everything in Static Frontend',
                  'Django-based back end',
                  'Database integration & API endpoints',
                ]}
                onSelect={() => navigate('/contact', { state: { selectedTier: 'fullstack' }})}
              />
              <ServiceTier
                title="Enterprise"
                priceEUR="2,000"
                priceSEK="20,200"
                features={[
                  'Everything in Full Stack',
                  'Advanced security & authentication',
                  'Cloud infrastructure & deployment',
                ]}
                onSelect={() => navigate('/contact', { state: { selectedTier: 'enterprise' }})}
              />
            </div>
          </section>

          {/* Recommended Setup */}
          <section className="mb-24">
            <h2 className="text-2xl font-light text-primary mb-4">Recommended Setup</h2>
            <div className="bg-background border border-primary/10 rounded-2xl p-8">
              <p className="text-foreground mb-4 leading-relaxed">
                Our Full Stack package includes Django's 
                <strong className="text-foreground"> standard session-based authentication</strong>, 
                covering basic logins, password resets, and the user flows most businesses expect.
              </p>
              <p className="text-foreground-alt mb-4 leading-relaxed">
                For more advanced security or custom auth features, we offer the following add-ons:
              </p>
              <ul className="space-y-2 ml-4">
                {[
                  'Social/OAuth Logins (Google, Facebook, etc.)',
                  'JWT-Based Authentication (ideal for SPAs or mobile apps)',
                  'Role-Based Access Control (RBAC) for multiple user groups',
                  'Multi-Factor Authentication (2FA) for higher security'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 group">
                    <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                    <span className="text-foreground-alt">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Features Grid */}
          <section ref={servicesRef} className="feature-section space-y-12">
            <h2 className="text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
              Enterprise-Level Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Frontend',
                  features: [
                    "TypeScript-based SPA",
                    "Tailwind CSS for rapid UI",
                    "Full GSAP animation support",
                    "SEO best practices",
                    "Responsive testing across devices"
                  ]
                },
                {
                  title: 'Backend',
                  features: [
                    "Django & Django REST Framework",
                    "JWT / OAuth authentication",
                    "PostgreSQL & ORM integration",
                    "Redis caching for performance",
                    "Extensive API documentation"
                  ]
                },
                {
                  title: 'DevOps',
                  features: [
                    "Cloud deployment & CDN",
                    "Infrastructure as Code (IaC)",
                    "CI/CD pipelines",
                    "Advanced monitoring & logging",
                    "Security protocols & audits"
                  ]
                }
              ].map((section, idx) => (
                <div key={idx} className="feature-card space-y-6 p-8 rounded-2xl bg-background border border-primary/10 hover:border-primary/20 transition-colors duration-300">
                  <h3 className="text-xl font-light text-primary">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 group">
                        <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                        <span className="text-foreground-alt">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Services;