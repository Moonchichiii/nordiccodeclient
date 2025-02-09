import { useEffect, useRef, FC } from 'react';
import { 
  CircleDollarSign, 
  PackageSearch, 
  Brain, 
  CheckCircle2, 
  MessageSquareMore,
  ClockIcon,
  PencilRuler,
  AlertCircle,
  X,
  ArrowRight
} from 'lucide-react';
import { gsap } from 'gsap';

interface Step {
  icon: JSX.Element;
  title: string;
  description: string;
  id: string;
}

interface ProjectFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  openAuthModal?: (mode: 'login' | 'register') => void;
}

const steps: Step[] = [
  {
    id: 'select-package',
    icon: <PackageSearch className="w-5 h-5 text-primary" aria-hidden="true" />,
    title: "Select Project Package",
    description: "Browse through our tailored packages to find the perfect match for your project needs."
  },
  {
    id: 'ai-planner',
    icon: <Brain className="w-5 h-5 text-primary" aria-hidden="true" />,
    title: "AI Project Planner",
    description: "Our AI planner will guide you through detailed project requirements and generate a comprehensive plan."
  },
  {
    id: 'review-approve',
    icon: <CheckCircle2 className="w-5 h-5 text-primary" aria-hidden="true" />,
    title: "Review & Approve",
    description: "Review the generated plan, timeline, and budget. Approve or request adjustments until it's perfect."
  },
  {
    id: 'initial-commitment',
    icon: <CircleDollarSign className="w-5 h-5 text-primary" aria-hidden="true" />,
    title: "Initial Commitment",
    description: "Once satisfied with the plan, secure your project slot with an initial payment to begin development."
  },
  {
    id: 'direct-communication',
    icon: <MessageSquareMore className="w-5 h-5 text-primary" aria-hidden="true" />,
    title: "Direct Communication",
    description: "Get exclusive access to instant chat for real-time communication with your project team."
  },
  {
    id: 'project-timeline',
    icon: <ClockIcon className="w-5 h-5 text-primary" aria-hidden="true" />,
    title: "Project Timeline",
    description: "Track your project's progress with our detailed timeline and milestone tracking system."
  }
];

const ProjectFlowModal: FC<ProjectFlowModalProps> = ({ isOpen, onClose, openAuthModal }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';

      const ctx = gsap.context(() => {
        gsap.fromTo(
          modalRef.current,
          { 
            opacity: 0,
            scale: 0.98,
          },
          { 
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: 'power3.out',
          }
        );

        gsap.fromTo(
          '.step-card',
          { 
            opacity: 0,
            y: 10,
          },
          { 
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power3.out',
          }
        );
      });

      return () => ctx.revert();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-background/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-flow-modal-title"
    >
      <div className="min-h-full w-full p-4 flex items-center justify-center">
        <div 
          ref={modalRef}
          className="relative w-full max-w-[90rem] bg-background rounded-3xl border border-primary/10 
            shadow-2xl shadow-primary/5"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-2 top-3 p-2 rounded-full hover:bg-primary/5 text-foreground-alt 
              hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 
              focus-visible:ring-primary/50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="grid lg:grid-cols-[1fr,2fr] h-full" ref={contentRef}>
            {/* Left Column - Header */}
            <div className="p-10 lg:border-r border-primary/10">
              <div className="sticky top-10">
                <h2 
                  id="project-flow-modal-title" 
                  className="text-4xl font-light"
                >
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
                    How We Build
                  </span>
                  <span className="block text-foreground mt-2">
                    Your Project
                  </span>
                </h2>
                <p className="mt-4 text-lg text-foreground-alt leading-relaxed">
                  A structured approach to bringing your vision to life, ensuring quality 
                  and transparency at every step of the development process.
                </p>

                <button
                  onClick={() => {
                    onClose();
                    openAuthModal?.('register');
                  }}
                  className="mt-8 group relative px-6 py-3 text-sm font-medium overflow-hidden
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                    focus-visible:ring-offset-2 rounded-full hover:rounded-xl transition-all
                    bg-primary text-white hover:bg-primary-light inline-flex items-center gap-2"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="p-10 bg-background-alt/50">
              {/* Steps Grid */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {steps.map((step, index) => (
                  <div 
                    key={step.id}
                    className="step-card group p-5 rounded-xl bg-background border border-primary/10 
                      hover:border-primary/20 transition-all duration-300 focus-within:ring-2 
                      focus-within:ring-primary/50"
                    tabIndex={0}
                    role="region"
                    aria-label={`Step ${index + 1}: ${step.title}`}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center 
                        justify-center group-hover:scale-110 transition-transform duration-300">
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-foreground">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-sm text-foreground-alt leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-background border border-primary/10 hover:border-primary/20 
                  transition-all duration-300">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <PencilRuler className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-foreground">
                        Flexible Development Process
                      </h3>
                      <p className="mt-1 text-sm text-foreground-alt leading-relaxed">
                        Our process adapts to your needs. We work together during the planning phase to ensure 
                        every detail is right, and continue to stay flexible during development.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-background border border-primary/10 hover:border-primary/20 
                  transition-all duration-300">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-foreground">
                        Our Commitment to You
                      </h3>
                      <p className="mt-1 text-sm text-foreground-alt leading-relaxed">
                        We believe in earning your trust first. That's why we help you plan your entire project 
                        and show you exactly what you'll get before any payment is made.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectFlowModal;