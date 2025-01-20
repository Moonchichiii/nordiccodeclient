import { useEffect, useRef } from 'react';
import { ArrowUpRight, ChevronRight, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

const ServiceTier = ({ title, price, features, recommended = false, onSelect }) => (
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
        <div className="mt-2 flex items-baseline">
          <span className="text-3xl font-light text-white">{price}</span>
          <span className="ml-2 text-sm text-gray-400">SEK</span>
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
  const servicesRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.services-content', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
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
            From concept to deployment, we deliver scalable and maintainable solutions.
          </p>
        </div>

        {/* Service Tiers */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceTier
              title="Static Frontend"
              price="6,300"
              features={[
                'React with Vite',
                'Modern responsive design',
                'Basic SEO optimization',
              ]}
              onSelect={() => navigate('/contact', { state: { selectedTier: 'static' }})}
            />
            <ServiceTier
              title="Full Stack"
              price="11,200"
              recommended={true}
              features={[
                'Everything in Static Frontend',
                'Backend API with Django',
                'Database integration',
              ]}
              onSelect={() => navigate('/contact', { state: { selectedTier: 'fullstack' }})}
            />
            <ServiceTier
              title="Enterprise"
              price="20,200"
              features={[
                'Everything in Full Stack',
                'Advanced security features',
                'Cloud infrastructure setup',
              ]}
              onSelect={() => navigate('/contact', { state: { selectedTier: 'enterprise' }})}
            />
          </div>
        </section>

        {/* Detailed Features */}
        <section ref={servicesRef} className="space-y-12">
          <h2 className="text-2xl font-light text-white">Enterprise Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-6 p-6 rounded-xl bg-gray-800/50">
              <h3 className="text-xl font-light text-yellow-500">Frontend</h3>
              <ul className="space-y-3 text-sm">
                {[
                  "Vite + React with TypeScript",
                  "Redux or Context API",
                  "Tailwind CSS",
                  "Comprehensive testing",
                  "SEO optimization"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-yellow-500 text-lg leading-none">•</span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6 p-6 rounded-xl bg-gray-800/50">
              <h3 className="text-xl font-light text-yellow-500">Backend</h3>
              <ul className="space-y-3 text-sm">
                {[
                  "Django REST Framework",
                  "JWT & OAuth integration",
                  "PostgreSQL with ORM",
                  "Redis caching",
                  "API documentation"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-yellow-500 text-lg leading-none">•</span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6 p-6 rounded-xl bg-gray-800/50">
              <h3 className="text-xl font-light text-yellow-500">DevOps</h3>
              <ul className="space-y-3 text-sm">
                {[
                  "Cloud deployment",
                  "Infrastructure as Code",
                  "CI/CD pipeline",
                  "Advanced monitoring",
                  "Security protocols"
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