import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '@/features/auth/components/AuthProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useTheme } from '@/components/layout/ThemeContext';
import {
  FolderCog,
  LayoutGrid,
  MessageSquare,
  FileText,
  Settings as SettingsIcon,
  CreditCard,
  Bell,
  Menu,
  UserCircle,
  Home,
  Mail,
  ChevronRight,
  LogOut,
  Sun,
  Moon,
  X
} from 'lucide-react';
import clsx from 'clsx';
import DashboardRoutes from '@/pages/dashboard/DashboardRoutes';
import logo from '@assets/images/applogo.webp';

function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuthContext();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasActiveProject, setHasActiveProject] = useState(false); // You'll need to implement this based on your project state
  const sidebarRef = useRef<HTMLElement>(null);

  // Close sidebar when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout.mutate();
  };

  function NavButton({
    icon: Icon,
    children,
    path,
    onClick,
  }: {
    icon: any;
    children: React.ReactNode;
    path?: string;
    onClick?: () => void;
  }) {
    const isActive = path ? location.pathname === path || location.pathname.startsWith(`${path}/`) : false;

    return (
      <button
        className={clsx(
          'flex items-center w-full p-3 space-x-3 rounded-xl transition-all duration-300 group relative',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'hover:bg-background-alt/50 text-foreground-alt hover:text-foreground'
        )}
        onClick={onClick || (path ? () => handleNavigation(path) : undefined)}
      >
        <Icon
          className={clsx(
            'h-5 w-5 transition-colors duration-300',
            isActive ? 'text-primary' : 'text-foreground-alt group-hover:text-foreground'
          )}
        />
        <span className="font-medium">{children}</span>
        {isActive && <ChevronRight className="h-4 w-4 ml-auto text-primary" />}
      </button>
    );
  }

  return (
    <div className="flex min-h-screen bg-background" data-theme={theme}>
      <aside
        ref={sidebarRef}
        className={clsx(
          'fixed top-16 bottom-0 right-0 z-30 w-72 transform bg-background/95 backdrop-blur-md',
          'overflow-y-auto transition-all duration-300 ease-out border-l border-border/50',
          'lg:top-0 lg:left-0 lg:border-r lg:border-l-0',
          {
            'translate-x-full lg:translate-x-0 pointer-events-none': !isSidebarOpen,
            'translate-x-0': isSidebarOpen,
          },
          'lg:static lg:translate-x-0 lg:pointer-events-auto'
        )}
      >
        {/* Sidebar content stays the same */}
        <div className="hidden lg:flex items-center space-x-4 px-6 py-8">
          <div className="h-30 w-30  flex items-center justify-center">
            {/* Logo */}
            <img
              src={logo}
              alt="Logo"
              width={88}
              height={88}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Nordic Code Works</h1>
            <p className="text-sm text-foreground-alt">Project Management</p>
          </div>
        </div>

        <div className="px-4 py-6">
          <div className="space-y-1.5">
            <NavButton icon={FolderCog} path="/dashboard/project-selection">
              Start Project
            </NavButton>
            <NavButton icon={LayoutGrid} path="/dashboard">
              Overview
            </NavButton>
            <NavButton icon={MessageSquare} path="/dashboard/messages">
              Messages
            </NavButton>
            <NavButton icon={FileText} path="/dashboard/documents">
              Documents
            </NavButton>
          </div>

          <div className="my-6 h-px bg-border/50"></div>

          <div className="space-y-1.5">
            <NavButton icon={CreditCard} path="/dashboard/billing">
              Billing
            </NavButton>
            <NavButton icon={SettingsIcon} path="/dashboard/settings">
              Settings
            </NavButton>
            {user && (user.is_staff || user.is_superuser) && (
              <NavButton icon={FolderCog} path="/dashboard/developer-worksheet">
                Dev WorkSheet
              </NavButton>
            )}
          </div>
        </div>

        <div className="mt-auto px-4 py-6 space-y-4">
          <div className="p-4 rounded-xl bg-card border border-border/50">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{user?.fullName}</p>
                <p className="text-sm text-foreground-alt">{user?.email}</p>
              </div>
            </div>
          </div>

          <NavButton icon={LogOut} onClick={handleLogout}>
            Sign Out
          </NavButton>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="fixed top-0 right-0 left-0 lg:left-72 z-20 flex items-center px-4 py-4 bg-background/95 backdrop-blur-md border-b border-border/50 h-16">
          <div className="flex items-center space-x-2 lg:hidden">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center">
              <img src="/src/assets/images/applogo.webp" alt="Nordic Code Works" className="h-6 w-6" />
            </div>
            <span className="text-base font-medium text-foreground">Dashboard</span>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-primary" aria-hidden="true" />
              ) : (
                <Moon className="w-5 h-5 text-primary" aria-hidden="true" />
              )}
            </button>

            {/* Notification Button - Only show in desktop */}
            <div className="hidden lg:block">
              <button className="relative p-2 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 group">
                <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 mt-16 bg-background pb-24 lg:pb-6">
          <DashboardRoutes />
        </main>

        {/* Mobile Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden z-50">
          <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
            {[
              { icon: Menu, label: 'Menu', onClick: () => setIsSidebarOpen(true) },
              { icon: Mail, label: 'Messages', path: '/dashboard/messages' },
              hasActiveProject
                ? { icon: FileText, label: 'Documents', path: '/dashboard/documents' }
                : { icon: FolderCog, label: 'Start Project', path: '/dashboard/project-selection' },
              { icon: Home, label: 'Overview', path: '/dashboard' }
            ].map((item, index) => (
              <button
                key={index}
                onClick={item.onClick || (() => navigate(item.path!))}
                className={clsx(
                  'flex flex-col items-center justify-center w-16 p-2 rounded-lg transition-colors relative',
                  item.path && location.pathname === item.path
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Close Sidebar Button - Only visible when sidebar is open on mobile */}
          {isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors text-muted-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}

export default Dashboard;
