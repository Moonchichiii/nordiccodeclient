// src/features/planner/hooks/useProjectTimeline.ts
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export const useProjectTimeline = () => {
  const [phases, setPhases] = useState([]);
  const [currentPhase, setCurrentPhase] = useState(null);

  const { data: projectData } = useQuery({
    queryKey: ['project-timeline'],
    queryFn: async () => {
      // This would be your API call
      return {
        phases: [
          {
            id: '1',
            name: 'Planning & Design',
            startDate: new Date(),
            endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            status: 'in-progress',
            dependencies: [],
            milestones: ['Design Approval', 'Technical Specifications']
          },
          // Add more phases
        ]
      };
    }
  });

  useEffect(() => {
    if (projectData?.phases) {
      setPhases(projectData.phases);
      const current = projectData.phases.find(p => p.status === 'in-progress');
      setCurrentPhase(current || null);
    }
  }, [projectData]);

  const updatePhaseStatus = (phaseId: string, status: string) => {
    setPhases(prev => 
      prev.map(phase => 
        phase.id === phaseId ? { ...phase, status } : phase
      )
    );
  };

  const getPhaseProgress = (phaseId: string) => {
    // This would be more complex in reality, based on tasks/milestones
    const phase = phases.find(p => p.id === phaseId);
    if (!phase) return 0;
    
    switch (phase.status) {
      case 'completed':
        return 100;
      case 'in-progress':
        const total = phase.endDate.getTime() - phase.startDate.getTime();
        const elapsed = Date.now() - phase.startDate.getTime();
        return Math.min(Math.round((elapsed / total) * 100), 99);
      default:
        return 0;
    }
  };

  return {
    phases,
    currentPhase,
    updatePhaseStatus,
    getPhaseProgress
  };
};

// src/features/planner/hooks/useResourceAllocation.ts
export const useResourceAllocation = () => {
  const { data: workload } = useQuery({
    queryKey: ['workload'],
    queryFn: async () => {
      // This would be your API call
      return {
        currentWorkload: [
          {
            week: '2024-01-22',
            development: 25,
            design: 15,
            content: 5,
            maxCapacity: 40
          },
          // Add more weeks
        ],
        upcomingDeadlines: [
          {
            projectName: 'E-commerce Platform',
            date: '2024-02-15'
          },
          // Add more deadlines
        ]
      };
    }
  });

  const allocatedHours = workload?.currentWorkload.reduce(
    (sum, week) => sum + week.development + week.design + week.content,
    0
  ) || 0;

  const availableHours = workload?.currentWorkload.reduce(
    (sum, week) => sum + week.maxCapacity,
    0
  ) || 0;

  return {
    currentWorkload: workload?.currentWorkload || [],
    upcomingDeadlines: workload?.upcomingDeadlines || [],
    allocatedHours,
    availableHours
  };
};