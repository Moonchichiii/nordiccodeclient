import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Menu, LogIn, X } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import AuthModal from '@/features/auth/components/AuthModal';
import { gsap } from 'gsap';
import { NavLink as RouterLink } from 'react-router-dom';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
}

interface HeaderProps {
    timeTheme: string;
    setTimeTheme: React.Dispatch<React.SetStateAction<string>>;
    isScrollingUp: boolean;
}

interface AuthButtonProps {
    onClick: () => void;
    variant?: 'ghost' | 'solid';
    children: React.ReactNode;
}

const NavLink = ({ href, children, onClick }: NavLinkProps) => (
    <RouterLink
        to={href}
        onClick={onClick}
        className="group relative px-3 py-2 text-sm font-medium text-gray-300 hover:text-white 
        transition-colors duration-300 rounded-md focus:outline-none focus-visible:ring-2 
        focus-visible:ring-yellow-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
    >
        <span className="relative z-10">{children}</span>
        <span className="absolute inset-0 transform scale-x-0 h-full bg-yellow-500/10 
        rounded-md transition-transform duration-300 ease-out origin-left group-hover:scale-x-100" />
        <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-yellow-500 
        transition-all duration-300 group-hover:w-full" />
    </RouterLink>
);

const AuthButton: React.FC<AuthButtonProps> = ({
    onClick,
    variant = 'ghost',
    children,
}) => (
    <button
        onClick={onClick}
        className={`
            px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300
            focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50
            ${
                variant === 'ghost'
                    ? 'text-gray-300 hover:text-white hover:bg-white/5'
                    : 'bg-yellow-500 text-gray-900 hover:bg-yellow-400 flex items-center gap-2'
            }
        `}
    >
        {children}
    </button>
);

const Header: React.FC<HeaderProps> = ({ timeTheme, setTimeTheme, isScrollingUp }) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null);
    const { user, logout } = useAuth();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                headerRef.current,
                { yPercent: -100 },
                {
                    yPercent: 0,
                    duration: 0.6,
                    ease: 'power3.out',
                    clearProps: 'transform',
                }
            );
        }, headerRef);

        return () => ctx.revert();
    }, []);

    const toggleTheme = () => {
        setTimeTheme((prevTheme) =>
            prevTheme === 'day' || prevTheme === 'dawn' ? 'night' : 'day'
        );
    };

    return (
        <>
            <header
                ref={headerRef}
                className={`fixed top-0 left-0 right-0 transition-all duration-500 z-nav
                    ${isScrollingUp ? 'translate-y-0' : '-translate-y-full'}
                `}
                role="banner"
            >
                <div className="absolute inset-0 nav-blur" />
                <nav
                    className="relative section-container"
                    role="navigation"
                    aria-label="Main navigation"
                >
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <RouterLink
                            to="/"
                            className="group relative focus:outline-none 
                            focus-visible:ring-2 focus-visible:ring-yellow-500/50 rounded-lg"
                            aria-label="Nordic Code Works - Home"
                        >
                            <span className="text-xl font-bold gradient-text">
                                Nordic Code Works
                            </span>
                        </RouterLink>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-lg border border-gray-700 
                            hover:border-yellow-500/30 transition-colors duration-300
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-menu"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5 text-gray-400" />
                            ) : (
                                <Menu className="w-5 h-5 text-gray-400" />
                            )}
                        </button>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <nav className="flex items-center space-x-6" role="navigation">
                                <NavLink href="/services">Services</NavLink>
                                <NavLink href="/portfolio">Portfolio</NavLink>
                                <NavLink href="/contact">Contact</NavLink>
                            </nav>

                            {/* Theme Toggle */}
                            <button
                                className="p-2 rounded-lg border border-gray-700 hover:border-yellow-500/30 
                                transition-all duration-300 group focus:outline-none 
                                focus-visible:ring-2 focus-visible:ring-yellow-500/50"
                                onClick={toggleTheme}
                                aria-label={`Switch to ${timeTheme === 'night' ? 'light' : 'dark'} theme`}
                            >
                                {timeTheme === 'night' ? (
                                    <Sun className="w-4 h-4 text-gray-400 group-hover:text-yellow-500 
                                    transition-colors duration-300" />
                                ) : (
                                    <Moon className="w-4 h-4 text-gray-400 group-hover:text-yellow-500 
                                    transition-colors duration-300" />
                                )}
                            </button>

                            {/* Auth Section */}
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-300 truncate max-w-[150px]">
                                        {user.email}
                                    </span>
                                    <AuthButton onClick={logout}>
                                        Sign Out
                                    </AuthButton>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <AuthButton onClick={() => setIsAuthModalOpen(true)} variant="ghost">
                                        Sign In
                                    </AuthButton>
                                    <AuthButton onClick={() => setIsAuthModalOpen(true)} variant="solid">
                                        <LogIn className="w-4 h-4" />
                                        Sign Up
                                    </AuthButton>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div
                        id="mobile-menu"
                        className={`md:hidden absolute top-full left-0 right-0 
                        bg-gray-900/95 backdrop-blur-md transition-all duration-300 
                        border-t border-gray-800 ${isMobileMenuOpen ? 'opacity-100 visible' : 
                        'opacity-0 invisible'}`}
                    >
                        <div className="px-4 py-6 space-y-4">
                            <nav className="flex flex-col space-y-4">
                                <NavLink href="/services" onClick={() => setIsMobileMenuOpen(false)}>
                                    Services
                                </NavLink>
                                <NavLink href="/portfolio" onClick={() => setIsMobileMenuOpen(false)}>
                                    Portfolio
                                </NavLink>
                                <NavLink href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                                    Contact
                                </NavLink>
                            </nav>
                            
                            <div className="pt-4 border-t border-gray-800">
                                {user ? (
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-300 truncate">{user.email}</p>
                                        <AuthButton onClick={logout} variant="ghost">
                                            Sign Out
                                        </AuthButton>
                                    </div>
                                ) : (
                                    <div className="flex flex-col space-y-3">
                                        <AuthButton onClick={() => setIsAuthModalOpen(true)} variant="ghost">
                                            Sign In
                                        </AuthButton>
                                        <AuthButton onClick={() => setIsAuthModalOpen(true)} variant="solid">
                                            <LogIn className="w-4 h-4" />
                                            Sign Up
                                        </AuthButton>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={() => setIsAuthModalOpen(false)}
            />
        </>
    );
};

export default Header;