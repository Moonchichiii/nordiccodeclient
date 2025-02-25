import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CircleDollarSign, 
  PackageSearch, 
  Brain, 
  CheckCircle2, 
  MessageSquareMore,
  ClockIcon,
  PencilRuler,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface Step {
  id: string;
  icon: JSX.Element;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    id: 'select-package',
    icon: <PackageSearch className="w-6 h-6 text-primary" aria-hidden="true" />,
    title: "Select Package",
    description: "Choose from our tailored development packages."
  },
  {
    id: 'ai-planner',
    icon: <Brain className="w-6 h-6 text-primary" aria-hidden="true" />,
    title: "AI Planning",
    description: "Let our AI guide you through project requirements."
  },
  {
    id: 'review-approve',
    icon: <CheckCircle2 className="w-6 h-6 text-primary" aria-hidden="true" />,
    title: "Review & Approve",
    description: "Review the plan and make adjustments as needed."
  },
  {
    id: 'initial-commitment',
    icon: <CircleDollarSign className="w-6 h-6 text-primary" aria-hidden="true" />,
    title: "Get Started",
    description: "Secure your project slot with initial payment."
  },
  {
    id: 'direct-communication',
    icon: <MessageSquareMore className="w-6 h-6 text-primary" aria-hidden="true" />,
    title: "Direct Chat",
    description: "Real-time communication with your project team."
  },
  {
    id: 'project-timeline',
    icon: <ClockIcon className="w-6 h-6 text-primary" aria-hidden="true" />,
    title: "Timeline",
    description: "Track progress with milestone tracking system."
  }
];

const DashboardHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-light mb-2 text-foreground">
          Transform Your Vision Into Reality
        </h1>
        <p className="text-base text-muted-foreground">
          From concept to completion with expert support at every step
        </p>
      </div>

      <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mb-8">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className="group relative flex flex-col h-full p-4 rounded-xl bg-card
                     border border-border hover:border-primary/50 transition-all duration-300 
                     hover:shadow-lg"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg 
                             bg-primary/10 
                             ring-1 ring-border group-hover:ring-primary/50
                             transition-all duration-300">
                  {step.icon}
                </div>
                <span className="text-sm font-medium text-primary/80">Step {index + 1}</span>
              </div>
              
              <h3 className="text-base font-medium text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                {step.title}
              </h3>
              
              <p className="text-muted-foreground text-sm">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <div className="p-4 rounded-xl bg-card border border-border hover:border-primary/50
                     hover:shadow-lg transition-all duration-300">
          <div className="flex items-start gap-3">
            <PencilRuler className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-foreground text-base mb-1">
                Flexible Development
              </h3>
              <p className="text-muted-foreground text-sm">
                Our process adapts to your needs with real-time communication and collaborative planning.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border hover:border-primary/50
                     hover:shadow-lg transition-all duration-300">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-foreground text-base mb-1">
                Our Commitment
              </h3>
              <p className="text-muted-foreground text-sm">
                Complete transparency with detailed planning before any payment is made.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => navigate('/dashboard/project-selection')}
          className="group relative overflow-hidden px-8 py-4 rounded-xl 
                   bg-primary text-primary-foreground font-medium 
                   transition-all duration-300 hover:scale-[1.02]
                   focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 
                   focus:ring-offset-background active:scale-[0.98]
                   shadow-lg hover:shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0
                       translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
          <span className="relative flex items-center justify-center gap-2 text-base">
            Start Your Project
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHome;