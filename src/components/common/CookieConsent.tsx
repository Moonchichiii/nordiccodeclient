import { useState, useEffect, useRef } from 'react';
import { gsap } from "gsap";
import { X, Cookie, Settings, Shield, ChevronDown, ChevronUp } from 'lucide-react';

interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentProps {
  onClose?: () => void;
  showInitially?: boolean;
}

export const checkCookieConsent = (type: keyof CookieSettings) => {
  const consent = localStorage.getItem('cookie-consent');
  if (!consent) return false;
  
  try {
    const preferences = JSON.parse(consent);
    return preferences[type] || false;
  } catch {
    return false;
  }
};

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

  // Handle initial animation
  useEffect(() => {
    const shouldShow = showInitially ? !localStorage.getItem('cookie-consent') : true;
    
    if (shouldShow) {
      const timer = setTimeout(() => {
        setShow(true);
      }, showInitially ? 1000 : 0);

      return () => clearTimeout(timer);
    }
  }, [showInitially]);

  // Handle container animation when show state changes
  useEffect(() => {
    if (show && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { 
          y: 100,
          opacity: 0,
        },
        { 
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
        }
      );
    }
  }, [show]);

  // Handle details animation when showDetails changes
  useEffect(() => {
    if (detailsRef.current) {
      gsap.to(detailsRef.current, {
        height: showDetails ? 'auto' : 0,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    }
  }, [showDetails]);

  const handleClose = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => {
          setShow(false);
          onClose?.();
        },
      });
    }
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
      <div className="rounded-xl border border-border/50 bg-card shadow-lg backdrop-blur-sm">
        <div className="p-4 sm:p-6 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-light">Cookie Settings</h3>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          <p className="text-muted-foreground">
            We use cookies to enhance your browsing experience and provide personalized content.
          </p>

          {/* Settings */}
          <div ref={detailsRef} className="overflow-hidden">
            <div className="space-y-3 pt-2">
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
                <div key={id} className="p-3 rounded-lg bg-accent/50 border border-border/50 flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/50">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{title}</h4>
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
                        <div className="w-9 h-5 rounded-full bg-muted peer-checked:bg-primary 
                                    peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
                                    after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                    after:bg-white after:rounded-full after:h-4 after:w-4
                                    after:transition-all peer-checked:after:translate-x-4">
                        </div>
                      </label>
                    </div>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => handleSave(true)}
              className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground 
                       hover:bg-primary/90 transition-colors font-medium text-sm"
            >
              Accept All
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1 px-4 py-2.5 rounded-lg border border-border hover:bg-accent 
                       transition-colors font-medium text-sm inline-flex items-center justify-center gap-2"
            >
              {showDetails ? 'Hide Details' : 'Cookie Settings'}
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showDetails && (
              <button
                onClick={() => handleSave(false)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground 
                         hover:bg-primary/90 transition-colors font-medium text-sm"
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