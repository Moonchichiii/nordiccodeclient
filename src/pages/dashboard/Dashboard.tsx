import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '@/features/auth/components/AuthProvider';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import {
    LayoutGrid, MessageSquare, FileText, Settings as SettingsIcon,
    CreditCard, Bell, Menu, X, UserCircle, ChevronRight,
    Home, Mail, FolderCog
} from 'lucide-react';
import clsx from 'clsx';
import OrderFlow from '@/pages/orders/OrderFlow';
import ChatInterface from '@/pages/chat/Chat';
import Settings from '@/pages/settings/Settings';
import NotFound from '@/pages/error/NotFound';
import ProjectSelection from '@/pages/projects/ProjectSelection';
import PlannerView from '@/pages/planner/PlannerView';
import Documents from '@/pages/documents/Documents';
import Messages from '@/pages/messages/messages';
import Billing from '@/pages/billing/billing';

function Dashboard() {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef<HTMLElement>(null);

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

    function NavButton({ icon: Icon, children, path }: { icon: any, children: React.ReactNode, path: string }) {
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

    const DashboardHome = () => (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Welcome to Nordic Code Works</h1>
            
            <div className="space-y-8">
                <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                    <h2 className="text-xl font-semibold mb-4">How It Works</h2>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">1</div>
                            <div>
                                <h3 className="font-medium">Select Your Package</h3>
                                <p className="text-gray-400">Choose from our curated solutions tailored to your needs</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">2</div>
                            <div>
                                <h3 className="font-medium">Project Planning with AI</h3>
                                <p className="text-gray-400">Our AI assistant helps define your project requirements</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">3</div>
                            <div>
                                <h3 className="font-medium">Development & Communication</h3>
                                <p className="text-gray-400">Track progress and communicate with your development team</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="text-center">
                    <button
                        onClick={() => navigate('/dashboard/new-project')}
                        className="bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg hover:bg-yellow-400 
                                 transition-all duration-300"
                    >
                        Start New Project
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            <aside
                ref={sidebarRef}
                className={clsx(
                    'fixed top-16 bottom-0 right-0 z-30 w-72 transform bg-gray-800/95 backdrop-blur-md overflow-y-auto transition-all duration-300 ease-out border-l border-gray-700/50 lg:top-16 lg:left-0 lg:border-r lg:border-l-0',
                    {
                        'translate-x-full lg:-translate-x-0 pointer-events-none': !isSidebarOpen,
                        'translate-x-0': isSidebarOpen,
                    },
                    'lg:static lg:translate-x-0 lg:pointer-events-auto'
                )}
            >
                <div className="hidden lg:flex items-center space-x-4 px-6 py-8">
                    <img src="/src/assets/images/applogo.png" alt="Nordic Code Works" className="h-10 w-10 rounded-lg"/>
                    <div>
                        <h1 className="text-xl font-bold">Nordic Code Works</h1>
                        <p className="text-sm text-gray-400">Project Management</p>
                    </div>
                </div>

                <div className="px-4 py-6">
                    <div className="space-y-1">
                        <NavButton icon={FolderCog} path="/dashboard/new-project">
                            <div className="flex items-center justify-between w-full">
                                <span>Start Project</span>
                                <span className="px-2 py-0.5 text-xs bg-yellow-500 text-gray-900 rounded-full">
                                    New
                                </span>
                            </div>
                        </NavButton>
                        <NavButton icon={LayoutGrid} path="/dashboard">Overview</NavButton>
                        <NavButton icon={MessageSquare} path="/dashboard/messages">Messages</NavButton>
                        <NavButton icon={FileText} path="/dashboard/documents">Documents</NavButton>
                    </div>

                    <div className="my-6 h-px bg-gray-700/50"></div>

                    <div className="space-y-1">
                        <NavButton icon={CreditCard} path="/dashboard/billing">Billing</NavButton>
                        <NavButton icon={SettingsIcon} path="/dashboard/settings">Settings</NavButton>
                    </div>
                </div>

                <div className="mt-auto px-4 py-6">
                    <div className="p-4 rounded-xl bg-gray-700/50 backdrop-blur-sm">
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
                <header className="fixed top-0 right-0 left-0 lg:left-72 z-20 flex items-center px-6 py-4 bg-gray-800/95 backdrop-blur-md border-b border-gray-700/50 h-16">
                    <div className="flex items-center space-x-3 lg:hidden">
                        <img src="/src/assets/images/applogo.png" alt="Nordic Code Works" className="h-8 w-8 rounded-lg"/>
                        <span className="text-lg font-semibold">Dashboard</span>
                    </div>
                    <div className="ml-auto flex items-center">
                        <button className="p-3 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors duration-200 focus:outline-none relative group">
                            <Bell className="h-6 w-6 text-gray-400 group-hover:text-yellow-500 transition-colors" />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-yellow-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-6 mt-16 bg-gray-900/95 backdrop-blur-md pb-24 lg:pb-6">
                    <Routes>
                        <Route index element={<DashboardHome />} />
                        <Route path="new-project" element={<ProjectSelection />} />
                        <Route path="planner/:projectId" element={<PlannerView />} />
                        <Route path="payment/:projectId" element={<OrderFlow />} />
                        <Route path="chat/:projectId" element={<ChatInterface />} />
                        <Route path="documents" element={<Documents />} />
                        <Route path="messages" element={<Messages />} />
                        <Route path="billing/*" element={<Billing />} />
                        <Route path="settings/*" element={<Settings />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>

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