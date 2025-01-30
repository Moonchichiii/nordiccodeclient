import { useState } from 'react';
import {
  ChevronRight,
  Github,
  Linkedin,
  FileCode,
  Briefcase,
  MessageCircle,
  Cookie,
  Mail,
  LucideIcon,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import CookieConsent from '@/components/common/CookieConsent';

interface SocialLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon: Icon, label }) => (
  <a
    href={href}
    className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full group
      text-gray-300 hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 
      focus-visible:ring-offset-2 focus-visible:ring-yellow-400 transition-all duration-300"
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
  >
    <Icon className="w-5 h-5 text-current transition-colors duration-300" />
  </a>
);

interface FooterLinkProps {
  href?: string;
  children: React.ReactNode;
  external?: boolean;
  onClick?: () => void;
}

const FooterLink: React.FC<FooterLinkProps> = ({
  href,
  children,
  external = false,
  onClick
}) => {
  const Component = external ? 'a' : Link;
  const props = external
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : onClick
    ? { onClick, href: '#', role: 'button' }
    : { to: href };

  return (
    <Component
      {...props}
      className="group inline-flex items-center text-sm text-gray-300 hover:text-yellow-400 
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
        focus-visible:ring-yellow-400 transition-colors duration-300 relative py-1"
    >
      <ChevronRight
        className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-all duration-300"
        aria-hidden="true"
      />
      <span className="relative">
        {children}
        <span
          className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-yellow-400 
            to-yellow-200 transition-all duration-300 group-hover:w-full"
          aria-hidden="true"
        />
      </span>
    </Component>
  );
};

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  return (
    <>
      <footer
        className={`relative mt-auto bg-gray-800/30 border-t border-gray-700/30 
          backdrop-blur-lg ${isDashboard ? 'pb-24 lg:pb-12' : 'pb-12'}`}
        aria-label="Footer"
      >
        <div className="max-w-6xl mx-auto px-4 pt-8 sm:pt-12">
          {/* Main Footer Content */}
          <div className="grid gap-8 mb-8 grid-cols-1 lg:grid-cols-12">
            {/* Branding Section - Takes 5 columns on desktop */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-500 
                to-yellow-200 bg-clip-text text-transparent text-center lg:text-left">
                Nordic Code Works
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                Creating innovative digital solutions with Nordic precision and modern technology.
              </p>
              {/* Contact Link - Hidden on mobile, visible on desktop */}
              <div className="hidden lg:flex items-center space-x-2 text-gray-300">
                <Mail className="w-5 h-5" />
                <a href="mailto:contact@nordiccodeworks.com" 
                   className="text-sm hover:text-yellow-400 transition-colors duration-300">
                  contact@nordiccodeworks.com
                </a>
              </div>
            </div>

            {/* Quick Links Section - Takes 4 columns on desktop */}
            <div className="lg:col-span-4 space-y-4">
              <h4 className="text-white font-medium text-base text-center lg:text-left">
                Quick Links
              </h4>
              <ul className="space-y-2 flex flex-col items-center lg:items-start">
                <li>
                  <FooterLink href="/services">
                    <FileCode className="w-4 h-4 mr-2" aria-hidden="true" />
                    Services
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/portfolio">
                    <Briefcase className="w-4 h-4 mr-2" aria-hidden="true" />
                    Portfolio
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/contact">
                    <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                    Contact
                  </FooterLink>
                </li>
              </ul>
            </div>

            {/* Social Links Section - Takes 3 columns on desktop */}
            <div className="lg:col-span-3 flex flex-col items-center lg:items-start space-y-4">
              <h4 className="text-white font-medium text-base hidden lg:block">
              Follow us on

              </h4>
              {/* Social Links - Horizontal on mobile, vertical on desktop */}
              <div className="flex lg:flex-col justify-center gap-4 lg:gap-3">
                <SocialLink href="#" icon={Github} label="GitHub" />
                <SocialLink href="#" icon={Linkedin} label="LinkedIn" />
                <SocialLink href="#" icon={X} label="X (formerly Twitter)" />
                {/* Email icon only shows on mobile */}
                <a
                  href="mailto:contact@nordiccodeworks.com"
                  className="lg:hidden inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 
                    rounded-full group text-gray-300 hover:text-yellow-400 focus-visible:outline-none 
                    focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400 
                    transition-all duration-300"
                  aria-label="Email us"
                >
                  <Mail className="w-5 h-5 text-current transition-colors duration-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 sm:pt-8 border-t border-gray-700/30">
            {/* Legal Links */}
            <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between 
              gap-4 lg:gap-6 mb-4 lg:mb-0">
              <p className="text-sm text-gray-400 order-2 lg:order-1">
                © {currentYear} Nordic Code Works. All rights reserved.
              </p>
              <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 order-1 lg:order-2">
                <FooterLink href="/privacy">Privacy Policy</FooterLink>
                <FooterLink href="/terms">Terms of Service</FooterLink>
                <FooterLink onClick={() => setShowCookieSettings(true)} external>
                  <span className="inline-flex items-center">
                    <Cookie className="w-4 h-4 mr-2" aria-hidden="true" />
                    Cookie Settings
                  </span>
                </FooterLink>
              </div>
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