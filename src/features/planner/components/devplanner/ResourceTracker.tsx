// src/features/planner/components/devplanner/ResourceTracker.tsx
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  Calendar 
} from 'lucide-react';
import { useResourceAllocation } from '../../hooks/useResourceAllocation';

interface Resource {
  type: string;
  allocated: number;
  available: number;
  assignee?: string;
}

export const ResourceTracker: React.FC = () => {
  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ['resources'],
    queryFn: async () => {
      // This would fetch from your API
      return [
        { type: 'Development', allocated: 25, available: 40 },
        { type: 'Design', allocated: 15, available: 30 },
        { type: 'Content', allocated: 10, available: 20 }
      ];
    }
  });

  const { allocatedHours, availableHours } = useResourceAllocation();

  if (isLoading) {
    return <div className="animate-pulse">Loading resources...</div>;
  }

  return (
    <div className="space-y-6 bg-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Resource Allocation</h2>
        <Users className="h-6 w-6 text-yellow-500" />
      </div>

      {/* Overall Capacity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-300">Available Hours</span>
          </div>
          <div className="text-2xl font-bold text-white">{availableHours}h</div>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-5 w-5 text-yellow-500" />
            <span className="text-sm text-gray-300">Allocated Hours</span>
          </div>
          <div className="text-2xl font-bold text-white">{allocatedHours}h</div>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className={`h-5 w-5 ${allocatedHours/availableHours > 0.8 ? 'text-red-500' : 'text-green-500'}`} />
            <span className="text-sm text-gray-300">Capacity</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {Math.round((allocatedHours/availableHours) * 100)}%
          </div>
        </div>
      </div>

      {/* Resource Breakdown */}
      <div className="space-y-4">
        {resources?.map((resource) => (
          <div key={resource.type} className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium text-white">{resource.type}</div>
                <div className="text-sm text-gray-400">
                  {resource.allocated}h / {resource.available}h
                </div>
              </div>
              {resource.assignee && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">{resource.assignee}</span>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
            
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  (resource.allocated/resource.available) > 0.8 
                    ? 'bg-red-500' 
                    : 'bg-green-500'
                }`}
                style={{ width: `${(resource.allocated/resource.available) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceTracker;