import { useState } from 'react';
import { ChevronRight, Github, Linkedin, FileCode, Briefcase, MessageCircle, Cookie, Mail, DivideIcon as LucideIcon, X, ArrowUpRight, MapPin, Phone } from 'lucide-react';
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
    className="group relative flex items-center justify-center w-12 h-12 rounded-xl
      bg-primary/5 hover:bg-primary/10 transition-all duration-300
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
  >
    <Icon className="w-5 h-5 text-primary transition-transform duration-300 group-hover:scale-110" />
    <div className="absolute inset-0 rounded-xl bg-primary/5 group-hover:scale-110 transition-transform duration-300" />
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
    ? { onClick, href: '#', role: 'button', tabIndex: 0 }
    : { to: href };

  return (
    <Component
      {...props}
      className="group inline-flex items-center text-sm text-foreground-alt hover:text-foreground
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
        transition-colors duration-300 relative py-2"
    >
      <ChevronRight
        className="w-4 h-4 mr-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0
          transition-all duration-300"
        aria-hidden="true"
      />
      <span className="relative">
        {children}
        <span
          className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-primary to-primary-light
            transition-all duration-300 group-hover:w-full"
          aria-hidden="true"
        />
      </span>
    </Component>
  );
};

const ContactInfo = ({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) => (
  <div className="flex items-center gap-3 text-foreground-alt">
    <Icon className="w-5 h-5 text-primary" />
    <span>{children}</span>
  </div>
);

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  return (
    <>
      <footer
        className={`relative mt-auto border-t border-primary/10 bg-background/80 backdrop-blur-xl
          ${isDashboard ? 'pb-safe-bottom lg:pb-8' : 'pb-8'}`}
        aria-label="Footer"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
          {/* Main Footer Content */}
          <div className="grid gap-12 lg:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-12 pb-12">
            {/* Branding & Contact Section */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl font-light">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
                    Nordic Code
                  </span>
                  <span className="text-foreground">Works</span>
                </h3>
                <p className="text-foreground-alt max-w-md leading-relaxed">
                  Creating innovative digital solutions with Nordic precision and modern technology.
                  We transform complex ideas into elegant, secure, and scalable solutions.
                </p>
              </div>

              <div className="space-y-4">
                <ContactInfo icon={MapPin}>
                  Stockholm, Sweden
                </ContactInfo>
                <ContactInfo icon={Phone}>
                  +46 (0) 70 123 4567
                </ContactInfo>
                <ContactInfo icon={Mail}>
                  contact@nordiccodeworks.com
                </ContactInfo>
              </div>

              <div className="flex gap-4">
                <SocialLink href="#" icon={Github} label="GitHub" />
                <SocialLink href="#" icon={Linkedin} label="LinkedIn" />
                <SocialLink href="#" icon={X} label="X (formerly Twitter)" />
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-7 space-y-8">
              {/* Quick Links Section */}
              <div className="space-y-6">
                <h4 className="text-lg font-light text-foreground">
                  Quick Links
                </h4>
                <nav aria-label="Footer quick links">
                  <ul className="flex flex-wrap gap-x-8 gap-y-4">
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
                </nav>
              </div>

              {/* Resources Section */}
              <div className="space-y-6">
                <h4 className="text-lg font-light text-foreground">
                  Resources
                </h4>
                <nav aria-label="Footer resources">
                  <ul className="flex flex-wrap gap-x-8 gap-y-4">
                    <li>
                      <FooterLink href="/blog">
                        Blog
                        <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </FooterLink>
                    </li>
                    <li>
                      <FooterLink href="/documentation">
                        Documentation
                        <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </FooterLink>
                    </li>
                    <li>
                      <FooterLink href="/careers">
                        Careers
                        <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </FooterLink>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-primary/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-foreground-alt order-2 sm:order-1">
                © {currentYear} Nordic Code Works. All rights reserved.
              </p>
              <nav className="flex flex-wrap justify-center gap-6 order-1 sm:order-2" aria-label="Footer legal links">
                <FooterLink href="/privacy">Privacy Policy</FooterLink>
                <FooterLink href="/terms">Terms of Service</FooterLink>
                <FooterLink
                  onClick={() => setShowCookieSettings(true)}
                  external
                >
                  <span className="inline-flex items-center">
                    <Cookie className="w-4 h-4 mr-2" aria-hidden="true" />
                    Cookie Settings
                  </span>
                </FooterLink>
              </nav>
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