import { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Menu, LogIn, X, ChevronRight } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import AuthModal from '@/features/auth/components/AuthModal';
import { gsap } from 'gsap';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isScrollingUp: boolean;
  isHomeVisible: boolean;
  showHamburger: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick, className }) => (
  <RouterLink
    to={href}
    onClick={onClick}
    className={`group relative px-6 py-2 text-lg font-light text-foreground-alt hover:text-foreground 
      transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${className}`}
  >
    <span className="relative">
      {children}
      <span
        className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-primary to-primary-light
          transition-all duration-300 group-hover:w-full"
        aria-hidden="true"
      />
    </span>
  </RouterLink>
);

const Header = ({ theme, toggleTheme, isScrollingUp, isHomeVisible, showHamburger }: HeaderProps) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const hamburgerFillRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (!hamburgerRef.current || !hamburgerFillRef.current) return;

    const hamburgerTimeline = gsap.timeline({ paused: true });
    hamburgerTimeline
      .to(hamburgerFillRef.current, {
        height: '100%',
        duration: 0.4,
        ease: 'power2.out',
      })
      .to(hamburgerRef.current.querySelector('.hamburger-icon'), {
        scale: 1.1,
        rotate: '10deg',
        duration: 0.3,
        ease: 'back.out(2)',
      }, 0);

    const enterHandler = () => hamburgerTimeline.play();
    const leaveHandler = () => hamburgerTimeline.reverse();

    hamburgerRef.current.addEventListener('mouseenter', enterHandler);
    hamburgerRef.current.addEventListener('mouseleave', leaveHandler);

    return () => {
      if (hamburgerRef.current) {
        hamburgerRef.current.removeEventListener('mouseenter', enterHandler);
        hamburgerRef.current.removeEventListener('mouseleave', leaveHandler);
      }
    };
  }, []);

  useEffect(() => {
    if (!menuRef.current || !isMobileMenuOpen) return;

    const ctx = gsap.context(() => {
      // Slide in animation for the sidebar
      gsap.fromTo(menuRef.current,
        {
          x: '100%',
          opacity: 0,
        },
        {
          x: '0%',
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
        }
      );

      // Stagger animation for menu items
      gsap.fromTo('.menu-item',
        {
          x: 50,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.4,
          ease: 'power2.out',
        }
      );
    });

    return () => ctx.revert();
  }, [isMobileMenuOpen]);

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500
          ${isScrollingUp ? 'translate-y-0' : '-translate-y-full'}
          ${isHomeVisible ? 'bg-transparent' : 'bg-background/80 backdrop-blur-md'}
          ${showHamburger ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}
      >
        <div className="mx-auto max-w-[1920px] px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <RouterLink to="/" className="flex items-center gap-3 group">
              <svg
                width="48"
                height="48"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 group-hover:scale-110"
              >
                <path
                  d="
                    M 50,150
                    C 40,110  60,70   50,50
                    L 150,150              
                    C 140,110  160,70   150,50
                  "
                  fill="none"
                  stroke="currentColor"
                  className="text-background"
                  strokeWidth="32"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="
                    M 50,150
                    C 40,110  60,70   50,50
                    L 150,150
                    C 140,110  160,70  150,50
                  "
                  fill="none"
                  stroke="currentColor"
                  className="text-primary"
                  strokeWidth="28"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </RouterLink>

            

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <NavLink href="/services">Services</NavLink>
              <NavLink href="/portfolio">Portfolio</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </nav>

            {/* Desktop Auth & Theme */}
            <div className="hidden lg:flex items-center gap-6">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full bg-foreground/5 hover:bg-foreground/10 
                  transition-colors duration-300 focus:outline-none focus-visible:ring-2 
                  focus-visible:ring-primary/50"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-primary" />
                ) : (
                  <Moon className="w-5 h-5 text-primary" />
                )}
              </button>

              {user ? (
                <button
                  onClick={() => logout.mutate()}
                  className="px-6 py-2 rounded-full text-foreground-alt hover:text-foreground 
                    hover:bg-primary/10 transition-colors font-medium"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-6 py-2 rounded-full text-foreground-alt hover:text-foreground 
                      hover:bg-primary/10 transition-colors font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="px-6 py-2 rounded-full bg-primary text-white hover:bg-primary-light 
                      transition-colors font-medium flex items-center gap-2"
                  >
                    <LogIn className="w-5 h-5" />
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hamburger Menu Button */}
      <button
        ref={hamburgerRef}
        onClick={() => setIsMobileMenuOpen(true)}
        className={`fixed right-8 top-8 z-50 w-20 h-20 rounded-full bg-background/80 
          backdrop-blur-md border border-primary/10 shadow-lg transition-all duration-300
          hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
          overflow-hidden transform hover:scale-105
          ${showHamburger ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
        aria-label="Open menu"
      >
        <div
          ref={hamburgerFillRef}
          className="absolute inset-0 bg-gradient-to-t from-primary/20 to-primary/5"
          style={{ height: '0%' }}
          aria-hidden="true"
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center gap-2 hamburger-icon">
          <Menu className="w-8 h-8 text-primary" aria-hidden="true" />
        </div>
      </button>

      {/* Sidebar Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-md">
          <div
            ref={menuRef}
            className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-background shadow-2xl 
              border-l border-primary/10 overflow-y-auto dark:bg-background-alt"
          >
            <div className="h-full flex flex-col">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-primary/10">
                <h2 className="text-2xl font-light">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
                    Menu
                  </span>
                </h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-primary/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 text-primary" />
                </button>
              </div>

              {/* Menu Content */}
              <div className="flex-1 p-6">
                <nav className="space-y-6">
                  {/* Theme Toggle */}
                  <div className="menu-item p-4 rounded-full bg-primary/5 flex items-center justify-between">
                    <span className="text-lg font-light text-foreground">Theme</span>
                    <button
                      onClick={toggleTheme}
                      className="p-3 rounded-full bg-background hover:bg-primary/10 
                        transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                    >
                      {theme === 'dark' ? (
                        <Sun className="w-5 h-5 text-primary" />
                      ) : (
                        <Moon className="w-5 h-5 text-primary" />
                      )}
                    </button>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-2">
                    {[
                      { href: '/services', label: 'Services' },
                      { href: '/portfolio', label: 'Portfolio' },
                      { href: '/contact', label: 'Contact' }
                    ].map((item) => (
                      <RouterLink
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="menu-item group flex items-center w-full p-4 rounded-full text-lg 
                          font-light text-foreground-alt hover:text-foreground hover:bg-primary/5 
                          transition-all duration-300"
                      >
                        <span>{item.label}</span>
                        <ChevronRight className="w-5 h-5 ml-auto opacity-0 -translate-x-2 
                          group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </RouterLink>
                    ))}
                  </div>

                  {/* Auth Section */}
                  <div className="menu-item pt-6 mt-6 border-t border-primary/10">
                    {user ? (
                      <button
                        onClick={() => {
                          logout.mutate();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full p-4 rounded-full bg-primary text-white hover:bg-primary-light 
                          transition-colors font-medium"
                      >
                        Sign Out
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            openAuthModal('login');
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full p-4 rounded-full bg-primary/10 text-foreground 
                            hover:bg-primary/20 transition-colors font-medium"
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => {
                            openAuthModal('register');
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full p-4 rounded-full bg-primary text-white 
                            hover:bg-primary-light transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          <LogIn className="w-5 h-5" />
                          Sign Up
                        </button>
                      </div>
                    )}
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Header;
