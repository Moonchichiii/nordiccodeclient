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
  AlertCircle
} from 'lucide-react';

const steps = [
  {
    id: 'select-package',
    icon: <PackageSearch className="w-6 h-6 text-yellow-400" aria-hidden="true" />,
    title: "Select Project Package",
    description: "Browse through our tailored packages to find the perfect match for your project needs."
  },
  {
    id: 'initial-commitment',
    icon: <CircleDollarSign className="w-6 h-6 text-green-400" aria-hidden="true" />,
    title: "Initial Commitment",
    description: "Secure your project slot with a small starting fee that confirms your commitment."
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
    description: "Review the generated plan and layout. Approve or request adjustments until it's perfect."
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
    <div className="max-w-12xl mx-auto p-4 pt-1">  
        <div className="mt-2">
        <h2 className="text-lg font-semibold text-center mb-6">
          How We Build Your Project
        </h2>
        
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div 
              key={step.id}
              className="flex flex-col items-start p-6 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition"
            >
              <div className="flex items-center justify-center p-2 bg-gray-900 rounded-full shadow-md ring-1 ring-gray-700 mb-3">
                {step.icon}
              </div>
              <h3 className="font-semibold text-base text-gray-200">
                {step.title}
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 rounded-lg bg-gray-800/30 border border-gray-700">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <PencilRuler className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-blue-300">
                Ongoing Project Modifications
              </h3>
              <p className="mt-1 text-blue-200/80">
                Need changes during development? No problem! Use the instant chat to request modifications to your ongoing project. Our flexible approach ensures your project evolves with your needs.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-6 rounded-lg bg-gray-800/30 border border-gray-700">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-yellow-300">
                Important Note
              </h3>
              <p className="mt-1 text-yellow-200/80">
                The initial planning fee helps us dedicate resources to your project and ensures commitment from both parties. This amount will be credited towards your final project cost.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/dashboard/project-selection')}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 
                     text-gray-900 font-medium rounded-lg 
                     hover:from-yellow-400 hover:to-yellow-500
                     transition transform hover:scale-105
                     focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 
                     focus:ring-offset-gray-900"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;