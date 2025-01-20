import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Menu, LogIn, X } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import AuthModal from '@/features/auth/components/AuthModal';
import { gsap } from 'gsap';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';

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

const NavLink = ({ href, children, onClick }: NavLinkProps) => (
    <RouterLink
        to={href}
        onClick={onClick}
        className="group relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white 
        transition-all duration-300 rounded-lg focus:outline-none focus-visible:ring-2 
        focus-visible:ring-yellow-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
    >
        <span className="relative z-10">{children}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0 
        rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-500 
        rounded-full opacity-0 group-hover:opacity-100 group-hover:w-full 
        transition-all duration-300 ease-out" />
    </RouterLink>
);

const AuthButton = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        variant?: 'ghost' | 'solid';
    }
>(({ onClick, variant = 'ghost', children, ...props }, ref) => (
    <button
        ref={ref}
        onClick={onClick}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
            focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50
            ${variant === 'ghost' 
                ? 'text-gray-300 hover:text-white hover:bg-white/10 active:bg-white/5' 
                : 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 hover:brightness-110 active:brightness-90 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 flex items-center gap-2'
            }`}
        {...props}
    >
        {children}
    </button>
));

AuthButton.displayName = 'AuthButton';

const Header: React.FC<HeaderProps> = ({ timeTheme, setTimeTheme, isScrollingUp }) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isMobileMenuOpen &&
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target as Node) &&
                !headerRef.current?.contains(event.target as Node)
            ) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                headerRef.current,
                { 
                    yPercent: -100,
                    opacity: 0
                },
                {
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'expo.out',
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
                className={`fixed top-0 left-0 right-0 transition-all duration-500 z-50
                    ${isScrollingUp ? 'translate-y-0' : '-translate-y-full'}
                    backdrop-blur-md bg-gray-900/80 border-b border-gray-800/50`}
            >
                <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <RouterLink
                            to="/"
                            className="relative group focus:outline-none 
                            focus-visible:ring-2 focus-visible:ring-yellow-500/50 rounded-lg"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 
                            bg-clip-text text-transparent transition-all duration-300
                            group-hover:from-yellow-400 group-hover:to-yellow-500">
                                Nordic Code Works
                            </span>
                        </RouterLink>

                        <div className="flex md:hidden">
                            <button
                                className="p-2 rounded-lg border border-gray-700/50 
                                hover:border-yellow-500/30 transition-all duration-300
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50
                                active:bg-gray-800"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? (
                                    <X className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <Menu className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                        </div>

                        <div className="hidden md:flex items-center justify-between flex-1 pl-8">
    <nav className="flex items-center gap-4">
        {user && (
            <NavLink href="/dashboard">Dashboard</NavLink>
        )}
        <NavLink href="/services">Services</NavLink>
        <NavLink href="/portfolio">Portfolio</NavLink>
        <NavLink href="/contact">Contact</NavLink>
    </nav>

    <div className="flex items-center gap-4">
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-gray-700/50 
            hover:border-yellow-500/30 transition-all duration-300 
            focus:outline-none focus-visible:ring-2 
            focus-visible:ring-yellow-500/50 active:bg-gray-800"
        >
            {timeTheme === 'night' ? (
                <Sun className="w-4 h-4 text-gray-400" />
            ) : (
                <Moon className="w-4 h-4 text-gray-400" />
            )}
        </button>

        {user ? (
            <AuthButton onClick={() => logout.mutate()}>
                Sign Out
            </AuthButton>
        ) : (
            <div className="flex items-center gap-3">
                <AuthButton onClick={() => setIsAuthModalOpen(true)}>
                    Sign In
                </AuthButton>
                <AuthButton
                    onClick={() => setIsAuthModalOpen(true)}
                    variant="solid"
                >
                    <LogIn className="w-4 h-4" />
                    Sign Up
                </AuthButton>
            </div>
        )}
    </div>
</div>
                    </div>

                    {/* Mobile Menu */}
                    <div
                        ref={mobileMenuRef}
                        className={`md:hidden absolute top-full left-0 right-0 
                        border-t border-gray-800/50 bg-gray-900/95 backdrop-blur-md
                        transition-all duration-300 transform ${
                            isMobileMenuOpen
                                ? 'translate-y-0 opacity-100'
                                : '-translate-y-4 opacity-0 pointer-events-none'
                        }`}
                    >
                    <div className="p-4 space-y-6">
                    <nav className="flex flex-col gap-2">
                        {user && (
                            <NavLink href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                Dashboard
                            </NavLink>
                        )}
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

                    <div className="pt-4 border-t border-gray-800/50 space-y-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg border border-gray-700/50 
                            hover:border-yellow-500/30 transition-all duration-300"
                        >
                            {timeTheme === 'night' ? (
                                <Sun className="w-4 h-4 text-gray-400" />
                            ) : (
                                <Moon className="w-4 h-4 text-gray-400" />
                            )}
                        </button>
                    </div>
            
                    {user ? (
                        <AuthButton
                            onClick={() => {
                                logout.mutate();
                                setIsMobileMenuOpen(false);
                            }}
                            className="w-full"
                        >
                            Sign Out
                        </AuthButton>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <AuthButton
                                onClick={() => {
                                    setIsAuthModalOpen(true);
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full"
                            >
                                Sign In
                            </AuthButton>
                            <AuthButton
                                onClick={() => {
                                    setIsAuthModalOpen(true);
                                    setIsMobileMenuOpen(false);
                                }}
                                variant="solid"
                                className="w-full"
                            >
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