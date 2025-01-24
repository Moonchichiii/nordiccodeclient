// src/features/planner/components/devplanner/TimelineManager.tsx
import React from 'react';
import { 
  Calendar,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useProjectTimeline } from '../../hooks/useProjectTimeline';

interface Phase {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
  dependencies: string[];
  milestones: string[];
}

export const TimelineManager: React.FC = () => {
  const { 
    phases, 
    currentPhase,
    updatePhaseStatus,
    getPhaseProgress 
  } = useProjectTimeline();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 bg-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Project Timeline</h2>
        <Calendar className="h-6 w-6 text-yellow-500" />
      </div>

      {/* Current Phase Overview */}
      {currentPhase && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
          <div className="text-sm text-yellow-500 mb-1">Current Phase</div>
          <div className="text-lg font-medium text-white mb-2">{currentPhase.name}</div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {new Date(currentPhase.startDate).toLocaleDateString()} - 
              {new Date(currentPhase.endDate).toLocaleDateString()}
            </div>
            <div className="text-sm font-medium text-yellow-500">
              {getPhaseProgress(currentPhase.id)}% Complete
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {phases.map((phase, index) => (
          <div 
            key={phase.id} 
            className="relative bg-gray-700/50 rounded-lg p-4 transition-all duration-200 hover:bg-gray-700/70"
          >
            {/* Vertical connector line */}
            {index < phases.length - 1 && (
              <div className="absolute left-[1.65rem] top-14 bottom-0 w-0.5 bg-gray-600" />
            )}

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                {getStatusIcon(phase.status)}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">{phase.name}</h3>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>

                <div className="text-sm text-gray-400 mb-3">
                  {new Date(phase.startDate).toLocaleDateString()} - 
                  {new Date(phase.endDate).toLocaleDateString()}
                </div>

                {/* Milestones */}
                {phase.milestones.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {phase.milestones.map((milestone, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                        <span className="text-gray-300">{milestone}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{getPhaseProgress(phase.id)}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-1.5">
                    <div
                      className="bg-yellow-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${getPhaseProgress(phase.id)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineManager;