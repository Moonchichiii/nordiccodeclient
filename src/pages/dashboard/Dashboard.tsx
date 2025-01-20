import React, { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '@/features/auth/components/AuthProvider';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutGrid,
    MessageSquare,
    FileText,
    Settings,
    CreditCard,
    Bell,
    Menu,
    X,
    UserCircle,
    ChevronRight,
    PanelLeftOpen,
    Home,
    Mail,
    File
} from 'lucide-react';
import clsx from 'clsx';

function Dashboard() {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedProject, setSelectedProject] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [hoveredProject, setHoveredProject] = useState(null);
    const sidebarRef = useRef<HTMLElement>(null);

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isSidebarOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node)
            ) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isSidebarOpen]);

    const projects = [
        {
            id: '1',
            title: 'E-commerce Website',
            status: 'active',
            type: 'enterprise',
            progress: 75,
            lastUpdate: '2024-01-15',
        },
        {
            id: '2',
            title: 'Portfolio Site',
            status: 'completed',
            type: 'static',
            progress: 100,
            lastUpdate: '2024-01-12',
        },
        {
            id: '3',
            title: 'Social Media App',
            status: 'pending',
            type: 'mid-tier',
            progress: 50,
            lastUpdate: '2024-01-10',
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-500';
            case 'pending':
                return 'bg-yellow-500';
            case 'completed':
                return 'bg-blue-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'static':
                return 'Static Frontend';
            case 'mid-tier':
                return 'Mid-Tier Solution';
            case 'enterprise':
                return 'Enterprise Full-Stack';
            default:
                return '';
        }
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsSidebarOpen(false);
    };

    function NavButton({ icon: Icon, children, path }) {
        return (
            <button 
                className="flex items-center w-full p-3 space-x-3 rounded-xl hover:bg-gray-700/50 transition-all duration-200 group"
                onClick={() => handleNavigation(path)}
            >
                <Icon className="h-5 w-5 text-gray-400 group-hover:text-yellow-500 transition-colors" />
                <span className="group-hover:text-yellow-500 transition-colors">{children}</span>
            </button>
        );
    }

    const isSettingsActive = location.pathname.includes('/dashboard/settings');

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            {/* Sidebar - Adjusted for mobile to start below header */}
            <aside
                ref={sidebarRef}
                className={clsx(
                    'fixed top-16 bottom-0 right-0 z-30 w-72 transform bg-gray-800/95 backdrop-blur-md overflow-y-auto transition-all duration-300 ease-out border-l border-gray-700/50 lg:top-0 lg:left-0 lg:border-r lg:border-l-0',
                    {
                        'translate-x-full lg:-translate-x-0 pointer-events-none': !isSidebarOpen,
                        'translate-x-0': isSidebarOpen,
                    },
                    'lg:static lg:translate-x-0 lg:pointer-events-auto'
                )}
            >
                <div className="flex items-center justify-between px-6 py-6">
                    <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg"></div>
                        <span className="text-xl font-bold">Dashboard</span>
                    </div>
                    <button
                        className="lg:hidden text-gray-400 hover:text-white focus:outline-none"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="mt-8 px-4 space-y-2">
                    <NavButton icon={LayoutGrid} path="/dashboard">Overview</NavButton>
                    <NavButton icon={MessageSquare} path="/dashboard/messages">Messages</NavButton>
                    <NavButton icon={FileText} path="/dashboard/documents">Documents</NavButton>
                    <NavButton icon={CreditCard} path="/dashboard/billing">Billing</NavButton>
                </nav>

                <div className="mt-auto px-4 py-6">
                    <NavButton 
                        icon={Settings} 
                        path="/dashboard/settings"
                    >
                        Settings
                    </NavButton>
                    <div className="mt-6 p-4 rounded-xl bg-gray-700/50 backdrop-blur-sm">
                        <div className="flex items-center space-x-3">
                            <UserCircle className="h-10 w-10 text-yellow-500" />
                            <div>
                                <p className="font-medium">{user?.fullName}</p>
                                <p className="text-sm text-gray-400">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col">
                                {/* Header */}
<header className="flex items-center px-6 py-4 bg-gray-800/95 backdrop-blur-md border-b border-gray-700/50 h-16">
<div className="flex items-center space-x-3">
    <img 
        src="/src/assets/images/applogo.png" 
        alt="Nordic Code Works" 
        className="h-8 w-8 rounded-lg"
    />
    <span className="text-lg font-semibold">Dashboard</span>
</div>
{/* Bell notification only for desktop */}
<div className="ml-auto hidden lg:block">
    <button className="p-3 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors duration-200 focus:outline-none relative group">
        <Bell className="h-6 w-6 text-gray-400 group-hover:text-yellow-500 transition-colors" />
        <span className="absolute top-2 right-2 h-2 w-2 bg-yellow-500 rounded-full"></span>
    </button>
</div>
</header>

                {/* Main content and bottom nav remain the same */}
                <main className="flex-1 p-6 bg-gray-900/95 backdrop-blur-md pb-24 lg:pb-6">
                    {!isSettingsActive && (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className={clsx(
                                        'bg-gray-800/90 rounded-2xl p-6 backdrop-blur-md border border-gray-700/50',
                                        'transition-all duration-300 ease-out transform hover:scale-102',
                                        'hover:shadow-xl hover:shadow-yellow-500/5',
                                        'group'
                                    )}
                                    onMouseEnter={() => setHoveredProject(project.id)}
                                    onMouseLeave={() => setHoveredProject(null)}
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium group-hover:text-yellow-500 transition-colors">
                                            {project.title}
                                        </h3>
                                        <span
                                            className={clsx(
                                                'px-4 py-1.5 text-xs font-medium rounded-full transition-colors',
                                                getStatusColor(project.status)
                                            )}
                                        >
                                            {project.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-4">{getTypeLabel(project.type)}</p>
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                                            <span>Progress</span>
                                            <span>{project.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-full rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${project.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400">
                                            Last updated: {new Date(project.lastUpdate).toLocaleDateString()}
                                        </span>
                                        <button
                                            onClick={() => {
                                                setSelectedProject(project);
                                                setShowChat(true);
                                            }}
                                            className="flex items-center space-x-2 text-sm text-yellow-500 hover:text-yellow-400 focus:outline-none group"
                                        >
                                            <span>Open Chat</span>
                                            <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <Outlet />
                </main>

                {/* Bottom Navigation - Updated z-index */}
<nav className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-md border-t border-gray-700/50 lg:hidden z-50">
<div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
    <button
        onClick={() => navigate('/dashboard')}
        className={clsx(
            'flex flex-col items-center justify-center w-16 p-2 rounded-lg transition-colors',
            location.pathname === '/dashboard' 
                ? 'text-yellow-500' 
                : 'text-gray-400 hover:text-yellow-500'
        )}
    >
        <Home className="h-6 w-6" />
        <span className="text-xs mt-1">Overview</span>
    </button>
    <button
        onClick={() => navigate('/dashboard/messages')}
        className={clsx(
            'flex flex-col items-center justify-center w-16 p-2 rounded-lg transition-colors',
            location.pathname.includes('/messages') 
                ? 'text-yellow-500' 
                : 'text-gray-400 hover:text-yellow-500'
        )}
    >
        <Mail className="h-6 w-6" />
        <span className="text-xs mt-1">Messages</span>
    </button>
    {/* Notifications */}
    <button className="flex flex-col items-center justify-center w-16 p-2 rounded-lg text-gray-400 hover:text-yellow-500 transition-colors relative">
        <Bell className="h-6 w-6" />
        <span className="text-xs mt-1">Alerts</span>
        <span className="absolute top-1 right-3 h-2 w-2 bg-yellow-500 rounded-full"></span>
    </button>
    <button
        onClick={() => setIsSidebarOpen(true)}
        className="flex flex-col items-center justify-center w-16 p-2 rounded-lg text-gray-400 hover:text-yellow-500 transition-colors"
    >
        <Menu className="h-6 w-6" />
        <span className="text-xs mt-1">More</span>
    </button>
</div>
</nav>

            </div>
        </div>
    );
}

export default Dashboard;