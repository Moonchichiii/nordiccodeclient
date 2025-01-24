// src/features/planner/components/devplanner/WorkloadView.tsx
import React from 'react';
import { 
  BarChart, 
  Clock, 
  AlertTriangle,
  Calendar,
  Users
} from 'lucide-react';
import { useResourceAllocation } from '../../hooks/useResourceAllocation';

interface WorkloadItem {
  week: string;
  development: number;
  design: number;
  content: number;
  maxCapacity: number;
}

export const WorkloadView: React.FC = () => {
  const { currentWorkload, upcomingDeadlines } = useResourceAllocation();

  // Calculate workload percentage for visual indicators
  const getWorkloadStatus = (hours: number, maxHours: number) => {
    const percentage = (hours / maxHours) * 100;
    if (percentage > 90) return 'bg-red-500';
    if (percentage > 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6 bg-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Workload Overview</h2>
        <BarChart className="h-6 w-6 text-yellow-500" />
      </div>

      {/* Weekly Workload Chart */}
      <div className="space-y-4">
        {currentWorkload.map((week) => (
          <div key={week.week} className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-300">
                Week of {week.week}
              </span>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">
                  {week.development + week.design + week.content}h / {week.maxCapacity}h
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {/* Development Hours */}
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Development</span>
                  <span>{week.development}h</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      getWorkloadStatus(week.development, week.maxCapacity * 0.6)
                    }`}
                    style={{ width: `${(week.development / (week.maxCapacity * 0.6)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Design Hours */}
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Design</span>
                  <span>{week.design}h</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      getWorkloadStatus(week.design, week.maxCapacity * 0.3)
                    }`}
                    style={{ width: `${(week.design / (week.maxCapacity * 0.3)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Content Hours */}
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Content</span>
                  <span>{week.content}h</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      getWorkloadStatus(week.content, week.maxCapacity * 0.1)
                    }`}
                    style={{ width: `${(week.content / (week.maxCapacity * 0.1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Deadlines */}
      <div className="mt-6 bg-gray-700/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Upcoming Deadlines</h3>
          <Calendar className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="space-y-3">
          {upcomingDeadlines.map((deadline, index) => (
            <div 
              key={index}
              className="flex items-center justify-between py-2 border-b border-gray-600 last:border-0"
            >
              <div className="flex items-center space-x-3">
                <AlertTriangle className={`h-4 w-4 ${
                  new Date(deadline.date).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000
                    ? 'text-red-500'
                    : 'text-yellow-500'
                }`} />
                <span className="text-sm text-gray-300">{deadline.projectName}</span>
              </div>
              <span className="text-sm text-gray-400">
                {new Date(deadline.date).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkloadView;