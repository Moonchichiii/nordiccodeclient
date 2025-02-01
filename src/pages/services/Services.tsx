import { useEffect, useRef } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
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
}: ServiceTierProps) => (
  <div 
    className="relative p-6 rounded-xl bg-gray-800/50 hover:bg-gray-800 
    transition-all duration-300"
  >
    {recommended && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <span className="bg-yellow-500 text-gray-900 px-3 py-px rounded-full text-xs font-medium
        flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          Most Popular
        </span>
      </div>
    )}
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-light text-white">{title}</h3>
        <div className="mt-2">
          <div className="flex items-baseline">
            <span className="text-3xl font-light text-white">{priceEUR}</span>
            <span className="ml-2 text-sm text-gray-400">EUR</span>
          </div>
          <div className="flex items-baseline mt-1">
            <span className="text-lg font-light text-gray-400">{priceSEK}</span>
            <span className="ml-2 text-xs text-gray-500">SEK</span>
          </div>
        </div>
      </div>
      <ul className="space-y-3 text-sm border-t border-gray-700/30 pt-6" role="list">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-3">
            <span className="text-yellow-500 text-lg leading-none">•</span>
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <button 
        onClick={onSelect}
        className="group w-full py-3 px-4 rounded-lg text-sm font-medium 
        transition-all duration-300 flex items-center justify-center gap-2
        bg-yellow-500 text-gray-900 hover:bg-yellow-400"
      >
        <span>Get Started</span>
        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 
        group-hover:-translate-y-0.5" />
      </button>
    </div>
  </div>
);

const Services = () => {
  const navigate = useNavigate();
  const servicesRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.services-content', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="container mx-auto px-4 py-20">
      <div className="services-content">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-5xl sm:text-6xl font-light mb-6 text-white">
            <span className="block">Our</span>
            <span className="block">Services</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            From concept to deployment, we deliver scalable and maintainable 
            solutions using a modern TypeScript front end, Django back end, 
            and cloud-based CDN for top performance. All animations powered by GSAP.
          </p>
        </div>

        {/* Service Tiers */}
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

        {/* Recommended Setup for Full Stack */}
        <section className="mb-24">
          <h2 className="text-2xl font-light text-yellow-500 mb-4">Recommended Setup</h2>
          <div className="bg-gray-800/50 rounded-xl p-6">
            <p className="text-gray-300 mb-4 leading-relaxed">
              Our Full Stack package includes Django’s 
              <strong className="text-gray-100"> standard session-based authentication</strong>, 
              covering basic logins, password resets, and the user flows most businesses expect.
            </p>
            <p className="text-gray-300 mb-4 leading-relaxed">
              For more advanced security or custom auth features, we offer the following add-ons:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>Social/OAuth Logins (Google, Facebook, etc.)</li>
              <li>JWT-Based Authentication (ideal for SPAs or mobile apps)</li>
              <li>Role-Based Access Control (RBAC) for multiple user groups</li>
              <li>Multi-Factor Authentication (2FA) for higher security</li>
            </ul>
            <p className="text-gray-300 mt-4 leading-relaxed">
              This keeps our Full Stack package approachable and cost-effective, 
              while still allowing for powerful extensions as your business grows.
            </p>
          </div>
        </section>

        {/* Detailed Features */}
        <section ref={servicesRef} className="space-y-12">
          <h2 className="text-2xl font-light text-white">Enterprise-Level Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Frontend Features */}
            <div className="space-y-6 p-6 rounded-xl bg-gray-800/50">
              <h3 className="text-xl font-light text-yellow-500">Frontend</h3>
              <ul className="space-y-3 text-sm">
                {[
                  "TypeScript-based SPA",
                  "Tailwind CSS for rapid UI",
                  "Full GSAP animation support",
                  "SEO best practices",
                  "Responsive testing across devices"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-yellow-500 text-lg leading-none">•</span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Backend Features */}
            <div className="space-y-6 p-6 rounded-xl bg-gray-800/50">
              <h3 className="text-xl font-light text-yellow-500">Backend</h3>
              <ul className="space-y-3 text-sm">
                {[
                  "Django & Django REST Framework",
                  "JWT / OAuth authentication",
                  "PostgreSQL & ORM integration",
                  "Redis caching for performance",
                  "Extensive API documentation"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-yellow-500 text-lg leading-none">•</span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DevOps Features */}
            <div className="space-y-6 p-6 rounded-xl bg-gray-800/50">
              <h3 className="text-xl font-light text-yellow-500">DevOps</h3>
              <ul className="space-y-3 text-sm">
                {[
                  "Cloud deployment & CDN",
                  "Infrastructure as Code (IaC)",
                  "CI/CD pipelines",
                  "Advanced monitoring & logging",
                  "Security protocols & audits"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-yellow-500 text-lg leading-none">•</span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Services;
