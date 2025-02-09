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
  ArrowRight,
  Sparkles
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
    icon: <PackageSearch className="w-6 h-6 text-yellow-400" aria-hidden="true" />,
    title: "Select Project Package",
    description: "Browse through our tailored packages to find the perfect match for your project needs."
  },
  {
    id: 'ai-planner',
    icon: <Brain className="w-6 h-6 text-blue-400" aria-hidden="true" />,
    title: "AI Project Planner",
    description: "Our AI planner will guide you through detailed project requirements and generate a comprehensive plan."
  },
  {
    id: 'review-approve',
    icon: <CheckCircle2 className="w-6 h-6 text-purple-400" aria-hidden="true" />,
    title: "Review & Approve",
    description: "Review the generated plan, timeline, and budget. Approve or request adjustments until it's perfect."
  },
  {
    id: 'initial-commitment',
    icon: <CircleDollarSign className="w-6 h-6 text-green-400" aria-hidden="true" />,
    title: "Initial Commitment",
    description: "Once satisfied with the plan, secure your project slot with an initial payment to begin development."
  },
  {
    id: 'direct-communication',
    icon: <MessageSquareMore className="w-6 h-6 text-pink-400" aria-hidden="true" />,
    title: "Direct Communication",
    description: "Get exclusive access to instant chat for real-time communication with your project team."
  },
  {
    id: 'project-timeline',
    icon: <ClockIcon className="w-6 h-6 text-orange-400" aria-hidden="true" />,
    title: "Project Timeline",
    description: "Track your project's progress with our detailed timeline and milestone tracking system."
  }
];

const DashboardHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-16 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Welcome to Nordic Code Works
        </div>
        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          Transform Your Vision Into Reality
        </h1>
        <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
          Our streamlined process guides you from concept to completion with expert support at every step
        </p>
      </div>

      <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mb-16 max-w-[1400px] mx-auto">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className="group relative flex flex-col h-full p-6 lg:p-8 rounded-2xl bg-gradient-to-b from-card/50 to-card border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-background/80 to-background shadow-lg ring-1 ring-border/50">
                  {step.icon}
                </div>
                <span className="text-sm font-medium text-muted-foreground">Step {index + 1}</span>
              </div>
              
              <h3 className="text-lg lg:text-xl font-medium text-foreground mb-3">
                {step.title}
              </h3>
              
              <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:gap-8 md:grid-cols-2 mb-16 max-w-[1400px] mx-auto">
        <div className="p-6 lg:p-8 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start gap-4 lg:gap-6">
            <PencilRuler className="w-6 h-6 lg:w-8 lg:h-8 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-blue-400 text-lg lg:text-xl mb-3">
                Flexible Development Process
              </h3>
              <p className="text-blue-300/90 text-sm lg:text-base leading-relaxed">
                Our process adapts to your needs. We work together during the planning phase to ensure every detail 
                is right, and continue to stay flexible during development with our real-time communication channel.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start gap-4 lg:gap-6">
            <AlertCircle className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-yellow-400 text-lg lg:text-xl mb-3">
                Our Commitment to You
              </h3>
              <p className="text-yellow-300/90 text-sm lg:text-base leading-relaxed">
                We believe in earning your trust first. That's why we help you plan your entire project and show you 
                exactly what you'll get before any payment is made. This ensures complete transparency and alignment 
                with your vision before moving forward.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/dashboard/project-selection')}
          className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 
                   text-gray-900 font-medium rounded-xl overflow-hidden w-full sm:w-auto
                   transition-all duration-300 transform hover:scale-[1.02]
                   focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 
                   focus:ring-offset-background shadow-xl hover:shadow-2xl
                   before:absolute before:inset-0 before:bg-gradient-to-r before:from-yellow-400 
                   before:via-yellow-300 before:to-yellow-400 before:opacity-0 
                   before:transition-opacity before:duration-300 hover:before:opacity-100
                   active:scale-[0.98]"
        >
          <span className="relative flex items-center justify-center gap-2 text-lg">
            Get Started
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHome;