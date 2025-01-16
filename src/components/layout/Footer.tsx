import React, { useEffect, useRef } from 'react';
import {
    Globe,
    Mail,
    ChevronRight,
    Twitter,
    Linkedin,
    Github,
    MessageCircle,
    FileCode,
    Users,
    ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

interface SocialLinkProps {
    href: string;
    icon: React.ElementType;
    label: string;
}

interface FooterLinkProps {
    href: string;
    children: React.ReactNode;
    external?: boolean;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon: Icon, label }) => (
    <a
        href={href}
        className="p-2 rounded-lg border border-gray-800 hover:border-yellow-500/30 
        transition-all duration-300 group focus:outline-none focus:ring-2 
        focus:ring-yellow-500/30 focus:ring-offset-2 focus:ring-offset-gray-900"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
    >
        <Icon className="w-4 h-4 text-gray-400 group-hover:text-yellow-500 
        transition-colors duration-300" />
    </a>
);

const FooterLink: React.FC<FooterLinkProps> = ({ href, children, external = false }) => {
    const Component = external ? 'a' : Link;
    const props = external ? { href, target: "_blank", rel: "noopener noreferrer" } : { to: href };

    return (
        <Component
            {...props}
            className="group inline-flex items-center text-sm text-gray-400 hover:text-yellow-500 
            transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 
            rounded-lg px-2 py-1 -ml-2"
        >
            <span className="flex items-center">
                <ChevronRight
                    className="w-4 h-4 mr-1 transform -translate-x-4 opacity-0 
                    group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"
                />
                {children}
            </span>
            {external && (
                <ExternalLink className="w-3 h-3 ml-1 opacity-50 group-hover:opacity-100 
                transition-opacity duration-300" />
            )}
        </Component>
    );
};

const Footer: React.FC = () => {
    const footerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.footer-content > div', {
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: 'top bottom-=100',
                    toggleActions: 'play none none reverse'
                },
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out'
            });
        }, footerRef);

        return () => ctx.revert();
    }, []);

    const currentYear: number = new Date().getFullYear();

    return (
        <footer ref={footerRef} className="relative bg-gray-900 border-t border-gray-800" role="contentinfo">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/0 to-gray-900/50 pointer-events-none" />

            <div className="relative section-container py-16">
                <div className="footer-content grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                    {/* Company Info */}
                    <div className="space-y-4 md:col-span-2">
                        <Link
                            to="/"
                            className="inline-block focus:outline-none focus:ring-2 focus:ring-yellow-500/30 
                            rounded-lg p-1 -ml-1"
                        >
                            <h3 className="gradient-text text-xl font-bold">
                                Nordic Code Works
                            </h3>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Crafting extraordinary digital experiences with Nordic precision. 
                            We specialize in creating modern, high-performance solutions for forward-thinking businesses.
                        </p>
                        <div className="flex items-center space-x-3 pt-2">
                            <SocialLink href="#" icon={Twitter} label="Follow us on Twitter" />
                            <SocialLink href="#" icon={Linkedin} label="Connect with us on LinkedIn" />
                            <SocialLink href="#" icon={Github} label="View our projects on GitHub" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <nav className="space-y-4" aria-label="Footer navigation">
                        <h4 className="text-white text-sm font-medium">Navigation</h4>
                        <ul className="space-y-2" role="list">
                            <li>
                                <FooterLink href="/services">
                                    <FileCode className="w-4 h-4 mr-2" aria-hidden="true" />
                                    Services
                                </FooterLink>
                            </li>
                            <li>
                                <FooterLink href="/portfolio">
                                    <Globe className="w-4 h-4 mr-2" aria-hidden="true" />
                                    Portfolio
                                </FooterLink>
                            </li>
                            <li>
                                <FooterLink href="/team">
                                    <Users className="w-4 h-4 mr-2" aria-hidden="true" />
                                    Our Team
                                </FooterLink>
                            </li>
                            <li>
                                <FooterLink href="/contact">
                                    <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                                    Contact
                                </FooterLink>
                            </li>
                        </ul>
                    </nav>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-white text-sm font-medium">Contact</h4>
                        <ul className="space-y-2" role="list">
                            <li>
                                <FooterLink
                                    href="https://nordiccodeworks.com"
                                    external
                                >
                                    <Globe className="w-4 h-4 mr-2" aria-hidden="true" />
                                    nordiccodeworks.com
                                </FooterLink>
                            </li>
                            <li>
                                <FooterLink
                                    href="mailto:contact@nordiccodeworks.com"
                                    external
                                >
                                    <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
                                    contact@nordiccodeworks.com
                                </FooterLink>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="relative mt-12 pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-sm text-gray-500">
                            &copy; {currentYear} Nordic Code Works. All rights reserved.
                        </p>
                        <nav className="flex items-center space-x-6" aria-label="Legal">
                            <FooterLink href="/privacy">
                                Privacy Policy
                            </FooterLink>
                            <FooterLink href="/terms">
                                Terms of Service
                            </FooterLink>
                        </nav>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
