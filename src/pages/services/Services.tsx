import { useEffect, useRef } from 'react';
import { ArrowUpRight, ChevronRight, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';

const AnimatedBackground = () => {
    const backgroundRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const blobs = backgroundRef.current?.children[0].children;
            if (blobs) {
                gsap.fromTo(
                    blobs,
                    { scale: 0, opacity: 0 },
                    {
                        scale: 1,
                        opacity: 0.15,
                        duration: 2,
                        stagger: 0.1,
                        ease: 'power3.out',
                    }
                );
            }
        }, backgroundRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={backgroundRef} className="absolute inset-0 overflow-hidden opacity-5">
            <div className="absolute w-full h-full">
                {Array.from({ length: 12 }).map((_, i) => (
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
                            opacity: 0,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

const FeatureList = ({ features, className = "" }) => (
    <ul className={`space-y-3 text-sm ${className}`} role="list">
        {features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
                <span className="text-yellow-500 text-lg leading-none" aria-hidden="true">•</span>
                <span className="text-gray-300">{feature}</span>
            </li>
        ))}
    </ul>
);

const ServiceSection = ({ title, children, className = "" }) => (
    <div className={`space-y-6 ${className}`}>
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        {children}
    </div>
);

const Services = () => {
    const servicesRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.services-content', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });

            // Services section scroll animations
            gsap.from('.service-section', {
                scrollTrigger: {
                    trigger: servicesRef.current,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: 1,
                },
                y: 50,
                opacity: 0,
                stagger: 0.2
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
            <AnimatedBackground />
            
            <div className="relative z-10">
                {/* Hero Section */}
                <section className="pt-24 px-4">
                    <div className="max-w-6xl mx-auto text-center space-y-8">
                        <div className="inline-block">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                <Sparkles className="w-3 h-3 mr-1.5" />
                                Our Services
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            <span className="gradient-text">Enterprise-Grade Solutions</span>
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            From concept to deployment, we deliver scalable and maintainable solutions tailored to your needs.
                        </p>
                    </div>
                </section>

                {/* Main Content */}
                <div ref={servicesRef} className="services-content max-w-6xl mx-auto px-4 py-16 space-y-16">
                    {/* Client Workflow Section */}
                    <ServiceSection title="Client Workflow" className="service-section">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6 p-6 rounded-xl bg-gray-800/50">
                                <h3 className="text-xl font-semibold text-yellow-500">Projects App</h3>
                                <FeatureList features={[
                                    "Browse and select from our service packages",
                                    "Upload project specifications and requirements",
                                    "Seamless redirect to secure payment processing"
                                ]} />
                            </div>
                            <div className="space-y-6 p-6 rounded-xl bg-gray-800/50">
                                <h3 className="text-xl font-semibold text-yellow-500">Orders App</h3>
                                <FeatureList features={[
                                    "Secure payment confirmation and processing",
                                    "Automated milestone initialization",
                                    "Real-time tracking of deliverables and progress"
                                ]} />
                            </div>
                        </div>
                    </ServiceSection>

                    {/* Enterprise Solution Section */}
                    <ServiceSection title="Enterprise Full-Stack Solution" className="service-section">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="space-y-6 p-6 rounded-xl bg-gray-800/50">
                                <h3 className="text-xl font-semibold text-yellow-500">Frontend</h3>
                                <FeatureList features={[
                                    "Vite + React with TypeScript",
                                    "Redux or Context API for state management",
                                    "Tailwind CSS for responsive design",
                                    "Comprehensive testing suite",
                                    "Performance optimizations and SEO"
                                ]} />
                            </div>
                            <div className="space-y-6 p-6 rounded-xl bg-gray-800/50">
                                <h3 className="text-xl font-semibold text-yellow-500">Backend</h3>
                                <FeatureList features={[
                                    "Django with REST Framework",
                                    "JWT and OAuth integration",
                                    "PostgreSQL with Django ORM",
                                    "Redis caching implementation",
                                    "Comprehensive API documentation"
                                ]} />
                            </div>
                            <div className="space-y-6 p-6 rounded-xl bg-gray-800/50">
                                <h3 className="text-xl font-semibold text-yellow-500">DevOps</h3>
                                <FeatureList features={[
                                    "Cloud service deployment (AWS/Azure/GCP)",
                                    "Infrastructure as Code (IaC)",
                                    "Automated CI/CD pipeline",
                                    "Advanced monitoring and logging"
                                ]} />
                            </div>
                        </div>
                    </ServiceSection>

                    {/* Call to Action */}
                    <div className="text-center space-y-6 service-section">
                        <h2 className="text-2xl font-semibold text-white">Ready to Get Started?</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Let's transform your vision into reality with our enterprise-grade solutions.
                        </p>
                        <button className="group px-6 py-2.5 rounded-lg bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-all duration-300 text-sm font-medium inline-flex items-center focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:ring-offset-2 focus:ring-offset-gray-900">
                            <span>Contact Us</span>
                            <ArrowUpRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;