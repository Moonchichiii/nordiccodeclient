import { useEffect,useState,useRef } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      className={`fixed right-8 bottom-8 z-[100] w-14 h-14 rounded-full bg-primary/90 
        text-white shadow-lg transition-all duration-300 backdrop-blur-sm
        hover:bg-primary hover:scale-110 focus:outline-none focus-visible:ring-2 
        focus-visible:ring-primary/50 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
      aria-label="Back to top"
    >
      <ChevronUp className="w-6 h-6 mx-auto" />
    </button>
  );
};

export default BackToTop;