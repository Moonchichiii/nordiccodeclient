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
  ArrowRight,
  Sparkles
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
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';

      const ctx = gsap.context(() => {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.98 },
          { opacity: 1, scale: 1, duration: 0.3, ease: 'power3.out' }
        );

        gsap.fromTo(
          '.step-item',
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.4,
            stagger: 0.1,
            ease: 'power3.out'
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
    <>
      {/* Inline CSS to hide steps grid on mobile portrait */}
      <style>{`
        @media (max-width: 768px) and (orientation: portrait) {
          .hide-mobile-portrait {
            display: none;
          }
        }
      `}</style>
      <div 
        className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto 
                   bg-background/95 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-flow-modal-title"
      >
        <div className="min-h-full w-full p-2 sm:p-4 flex items-start sm:items-center justify-center">
          <div 
            ref={modalRef}
            className="relative w-full max-w-[90rem] bg-background rounded-2xl sm:rounded-3xl border 
                       border-primary/10 shadow-2xl shadow-primary/5 max-h-[calc(100vh-1rem)] 
                       sm:max-h-[85vh] overflow-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="fixed sm:absolute right-3 top-3 sm:right-4 sm:top-4 p-2 rounded-full 
                       bg-background/80 sm:bg-transparent hover:bg-primary/5 text-foreground-alt 
                       hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 
                       focus-visible:ring-primary/50 z-10 shadow-lg sm:shadow-none"
              aria-label="Close modal"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </button>

            {/* Updated grid: In mobile the columns stack vertically */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,2fr] h-full" ref={contentRef}>
              {/* Left Column - Header */}
              <div className="p-4 sm:p-6 md:p-8 lg:p-10 lg:border-r border-primary/10">
                <div className="lg:sticky lg:top-10 max-w-xl mx-auto lg:mx-0">
                  <h2 
                    id="project-flow-modal-title" 
                    className="text-2xl xs:text-3xl sm:text-4xl font-light tracking-tight"
                  >
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
                      How We Build
                    </span>
                    <span className="block text-foreground mt-1 sm:mt-2">
                      Your Project
                    </span>
                  </h2>
                  <p className="mt-3 sm:mt-4 text-sm xs:text-base sm:text-lg text-foreground-alt leading-relaxed 
                            max-w-[90%] sm:max-w-none">
                    A structured approach to bringing your vision to life, ensuring quality 
                    and transparency at every step of the development process.
                  </p>

                  {/* Mobile Summary */}
                  <div className="mt-6 space-y-6">
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Brain className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-sm font-medium text-foreground">Our Process</h3>
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground leading-relaxed break-words">
                            From package selection to launch, we guide you through:
                          </p>
                          <ul className="space-y-1.5">
                            {steps.map((step) => (
                              <li key={step.id} className="flex items-center gap-2 justify-center">
                                <div className="w-1 h-1 rounded-full bg-primary/50" />
                                <span className="text-xs text-muted-foreground">{step.title}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-sm font-medium text-foreground">Key Benefits</h3>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2 justify-center">
                            <div className="w-1 h-1 rounded-full bg-primary/50" />
                            <span className="text-xs text-muted-foreground">
                              AI-powered project planning and requirements analysis
                            </span>
                          </li>
                          <li className="flex items-center gap-2 justify-center">
                            <div className="w-1 h-1 rounded-full bg-primary/50" />
                            <span className="text-xs text-muted-foreground">
                              Direct communication with your development team
                            </span>
                          </li>
                          <li className="flex items-center gap-2 justify-center">
                            <div className="w-1 h-1 rounded-full bg-primary/50" />
                            <span className="text-xs text-muted-foreground">
                              Transparent development process with regular updates
                            </span>
                          </li>
                          <li className="flex items-center gap-2 justify-center">
                            <div className="w-1 h-1 rounded-full bg-primary/50" />
                            <span className="text-xs text-muted-foreground">
                              Clear milestone tracking and progress monitoring
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      openAuthModal?.('register');
                    }}
                    className="mt-4 sm:mt-6 lg:mt-8 group relative px-4 sm:px-6 py-2 sm:py-3 text-[13px] 
                             sm:text-sm font-medium overflow-hidden focus-visible:outline-none 
                             focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 
                             rounded-full hover:rounded-xl transition-all bg-primary text-white 
                             hover:bg-primary-light inline-flex items-center gap-2 w-full sm:w-auto 
                             justify-center sm:justify-start shadow-lg hover:shadow-xl"
                  >
                    <span>Start Your Journey</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* Right Column - Steps & Additional Info */}
              <div className="p-4 sm:p-6 md:p-8 lg:p-10 bg-background-alt/50">
                {/* Steps Grid - hidden on mobile portrait */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8 hide-mobile-portrait">
                  {steps.map((step) => (
                    <div 
                      key={step.id}
                      className="step-item group p-5 rounded-xl bg-background border border-primary/10 
                               hover:border-primary/20 transition-all duration-300 hover:shadow-md"
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 
                                     flex items-center justify-center group-hover:scale-110 
                                     transition-transform duration-300">
                          {step.icon}
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-foreground">
                            {step.title}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Info */}
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-background border border-primary/10 
                               hover:border-primary/20 transition-all duration-300 hover:shadow-md">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 
                                   flex items-center justify-center">
                        <PencilRuler className="w-5 h-5 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-foreground">
                          Flexible Development Process
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                          Our process adapts to your needs. We work together during the planning phase to ensure 
                          every detail is right, and continue to stay flexible during development.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-background border border-primary/10 
                               hover:border-primary/20 transition-all duration-300 hover:shadow-md">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 
                                   flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-foreground">
                          Our Commitment to You
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
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
    </>
  );
};

export default ProjectFlowModal;