import React, { useState } from 'react';
import {
    ChevronRight,
    Twitter,
    Linkedin,
    Github,
    FileCode,
    Users,
    MessageCircle,
    Cookie
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import CookieConsent from '@/components/common/CookieConsent';

const SocialLink = ({ href, icon: Icon, label }) => (
    <a
        href={href}
        className="p-3 rounded-lg bg-gray-700/20 hover:bg-yellow-500/20 hover:text-yellow-500
        transition-all duration-300 group"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
    >
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-yellow-500 
        transition-colors duration-300" />
    </a>
);

const FooterLink = ({ href, children, external = false, onClick = undefined }) => {
    const Component = external ? 'a' : Link;
    const props = external 
        ? { href, target: "_blank", rel: "noopener noreferrer" } 
        : onClick 
            ? { onClick, href: "#", role: "button" } 
            : { to: href };

    return (
        <Component
            {...props}
            className="group inline-flex items-center text-sm text-gray-400 hover:text-yellow-500 
            transition-colors duration-300"
        >
            <ChevronRight className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 
            transition-all duration-300" />
            {children}
        </Component>
    );
};

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [showCookieSettings, setShowCookieSettings] = useState(false);
    const location = useLocation();
    const isDashboard = location.pathname.includes('/dashboard');

    return (
        <>
            <footer className={`relative mt-auto bg-gray-800/30 border-t border-gray-700/30
                ${isDashboard ? 'pb-24 lg:pb-12' : 'pb-12'}`}
            >
                <div className="max-w-6xl mx-auto px-4 pt-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        {/* Branding - Full width on mobile */}
                        <div className="sm:col-span-2 space-y-4">
                            <h3 className="text-xl sm:text-2xl font-bold gradient-text text-center sm:text-left">
                                Nordic Code Works
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-md text-center sm:text-left mx-auto sm:mx-0">
                                Creating innovative digital solutions with Nordic precision and modern technology.
                            </p>
                            <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
                                <SocialLink href="#" icon={Twitter} label="Twitter" />
                                <SocialLink href="#" icon={Linkedin} label="LinkedIn" />
                                <SocialLink href="#" icon={Github} label="GitHub" />
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-4 text-center sm:text-left">
                            <h4 className="text-white font-medium">Quick Links</h4>
                            <ul className="space-y-3">
                                <li><FooterLink href="/services">
                                    <FileCode className="w-4 h-4 mr-2" />Services
                                </FooterLink></li>
                                <li><FooterLink href="/team">
                                    <Users className="w-4 h-4 mr-2" />Team
                                </FooterLink></li>
                                <li><FooterLink href="/contact">
                                    <MessageCircle className="w-4 h-4 mr-2" />Contact
                                </FooterLink></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="space-y-4 text-center sm:text-left">
                            <h4 className="text-white font-medium">Contact</h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li>Stockholm, Sweden</li>
                                <li className="break-all">contact@nordiccodeworks.com</li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar - Stack on mobile */}
                    <div className="pt-8 border-t border-gray-700/30 flex flex-col sm:flex-row 
                    justify-between items-center gap-4">
                        <p className="text-sm text-gray-500 text-center sm:text-left order-2 sm:order-1">
                            © {currentYear} Nordic Code Works. All rights reserved.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 order-1 sm:order-2">
                            <FooterLink href="/privacy">Privacy Policy</FooterLink>
                            <FooterLink href="/terms">Terms of Service</FooterLink>
                            <FooterLink onClick={() => setShowCookieSettings(true)}>
                                <Cookie className="w-4 h-4 mr-2" />
                                Cookie Settings
                            </FooterLink>
                        </div>
                    </div>
                </div>
            </footer>

            {showCookieSettings && (
                <CookieConsent 
                    onClose={() => setShowCookieSettings(false)} 
                    showInitially={false}
                />
            )}
        </>
    );
};

export default Footer;