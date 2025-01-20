import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, Cookie, Settings, Shield, ChevronDown, ChevronUp } from 'lucide-react';

interface CookieConsentProps {
    onClose?: () => void;
    showInitially?: boolean;
}

const CookieConsent = ({ onClose, showInitially = true }: CookieConsentProps) => {
    const [show, setShow] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [settings, setSettings] = useState({
        necessary: true,
        analytics: false,
        marketing: false,
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const detailsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (showInitially && !localStorage.getItem('cookie-consent')) {
            // Show automatically if no preference is saved
            setTimeout(() => {
                setShow(true);
                gsap.fromTo(containerRef.current,
                    { y: 100, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
                );
            }, 1000);
        } else if (!showInitially) {
            // Show immediately if opened from footer
            setShow(true);
            gsap.fromTo(containerRef.current,
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
            );
        }
    }, [showInitially]);

    const handleClose = () => {
        setShow(false);
        onClose?.();
    };

    const handleSave = (acceptAll = false) => {
        const newSettings = acceptAll ? 
            { necessary: true, analytics: true, marketing: true } : 
            settings;
        localStorage.setItem('cookie-consent', JSON.stringify(newSettings));
        handleClose();
    };

    if (!show) return null;

    return (
        <div
            ref={containerRef}
            className="fixed bottom-4 left-4 right-4 z-50 max-w-2xl mx-auto"
        >
            <div className="bg-gray-900 rounded-xl border border-gray-800">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <Cookie className="w-6 h-6 text-yellow-500" />
                            <h3 className="text-xl font-light text-white">Cookie Settings</h3>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-lg">
                        We use cookies to enhance your browsing experience and provide personalized content.
                    </p>

                    {/* Settings */}
                    <div ref={detailsRef} style={{ height: showDetails ? 'auto' : 0, overflow: 'hidden' }}>
                        <div className="space-y-4">
                            {[
                                {
                                    id: 'necessary',
                                    title: 'Essential',
                                    description: 'Required for core functionality',
                                    icon: Shield,
                                    required: true
                                },
                                {
                                    id: 'analytics',
                                    title: 'Analytics',
                                    description: 'Help us improve our website',
                                    icon: Settings
                                },
                                {
                                    id: 'marketing',
                                    title: 'Marketing',
                                    description: 'Personalized content delivery',
                                    icon: Cookie
                                }
                            ].map(({ id, title, description, icon: Icon, required }) => (
                                <div key={id} className="p-4 bg-gray-800/50 rounded-lg flex items-center gap-4">
                                    <Icon className="w-5 h-5 text-yellow-500" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-light text-white">{title}</h4>
                                            <label className="relative inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={settings[id as keyof typeof settings]}
                                                    onChange={e => !required && setSettings(prev => ({
                                                        ...prev,
                                                        [id]: e.target.checked
                                                    }))}
                                                    disabled={required}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-700 rounded-full peer 
                                                    peer-checked:bg-yellow-500 peer-disabled:bg-gray-600
                                                    after:content-[''] after:absolute after:top-0.5 after:left-0.5
                                                    after:bg-white after:rounded-full after:h-5 after:w-5
                                                    after:transition-all peer-checked:after:translate-x-full">
                                                </div>
                                            </label>
                                        </div>
                                        <p className="text-sm text-gray-400">{description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => handleSave(true)}
                            className="flex-1 px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg 
                                hover:bg-yellow-400 transition-colors font-medium"
                        >
                            Accept All
                        </button>
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="flex-1 px-6 py-3 border border-gray-800 text-white rounded-lg
                                hover:border-yellow-500/30 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            {showDetails ? 'Hide Details' : 'Cookie Settings'}
                            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {showDetails && (
                            <button
                                onClick={() => handleSave(false)}
                                className="flex-1 px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg
                                    hover:bg-yellow-400 transition-colors font-medium"
                            >
                                Save Settings
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;