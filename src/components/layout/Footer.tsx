import { useState } from 'react';
import { Github, Linkedin, X, Mail, MapPin, Phone, ArrowUpRight, Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollTo } from '@/hooks/useScrollTo';
import CookieConsent from '@/components/common/CookieConsent';

interface SocialLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const SocialLink = ({ href, icon: Icon, label }: SocialLinkProps) => (
  <a
    href={href}
    className="group relative flex items-center justify-center w-10 h-10 rounded-xl
      bg-primary/5 hover:bg-primary/10 transition-all duration-300 hover:scale-110"
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
  >
    <Icon className="w-4 h-4 text-primary transition-transform duration-300" />
  </a>
);

const Footer = () => {
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const scrollTo = useScrollTo();
  const currentYear = new Date().getFullYear();

  const handleNavigation = (section: string) => {
    scrollTo(section);
  };

  return (
    <>
      <footer className="relative mt-auto border-t border-primary/10 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-12 lg:py-16">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Brand Section */}
              <div className="lg:col-span-4">
                <div className="space-y-8">
                  {/* Logo */}
                  <div>
                    <h3 className="text-2xl font-light">
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
                        Nordic Code
                      </span>
                      <span className="text-foreground">Works</span>
                    </h3>
                    <p className="mt-4 text-sm text-muted-foreground max-w-md">
                      Creating innovative digital solutions with Nordic precision and modern technology.
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    {[
                      { icon: MapPin, text: 'Stockholm, Sweden' },
                      { icon: Phone, text: '+46 (0) 70 123 4567' },
                      { icon: Mail, text: 'contact@nordiccodeworks.com' }
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Icon className="w-4 h-4 text-primary" />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-3">
                    <SocialLink href="#" icon={Github} label="GitHub" />
                    <SocialLink href="#" icon={Linkedin} label="LinkedIn" />
                    <SocialLink href="#" icon={X} label="X (Twitter)" />
                  </div>
                </div>
              </div>

              {/* Navigation & Links */}
              <div className="lg:col-span-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
                  {/* Quick Links */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-medium text-foreground">Navigation</h4>
                    <ul className="space-y-3">
                      {[
                        { label: 'Services', section: 'services' },
                        { label: 'Portfolio', section: 'portfolio' },
                        { label: 'Contact', section: 'contact' }
                      ].map(({ label, section }) => (
                        <li key={section}>
                          <button
                            onClick={() => handleNavigation(section)}
                            className="group text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-2"
                          >
                            <span>{label}</span>
                            <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Resources */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-medium text-foreground">Resources</h4>
                    <ul className="space-y-3">
                      {[
                        { label: 'Documentation', href: '/docs' },
                        { label: 'Blog', href: '/blog' },
                        { label: 'Careers', href: '/careers' }
                      ].map(({ label, href }) => (
                        <li key={href}>
                          <Link
                            to={href}
                            className="group text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-2"
                          >
                            <span>{label}</span>
                            <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Legal */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-medium text-foreground">Legal</h4>
                    <ul className="space-y-3">
                      <li>
                        <Link
                          to="/privacy"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                        >
                          Privacy Policy
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/terms"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                        >
                          Terms of Service
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => setShowCookieSettings(true)}
                          className="group text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-2"
                        >
                          <Cookie className="w-4 h-4" />
                          <span>Cookie Settings</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between py-6 border-t border-primary/10 gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Nordic Code Works. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Terms
              </Link>
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