import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';

interface WorksheetResponse {
  developerWorksheet: string;
}

const DeveloperWorksheetPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const { data, isLoading, error } = useQuery<WorksheetResponse>(
    ['developerWorksheet', projectId],
    async () => {
      const response = await axios.get(`/api/planner/developer/worksheet/${projectId}/`);
      return response.data;
    },
    { enabled: !!projectId }
  );

  if (isLoading) return <div>Loading developer worksheet...</div>;
  if (error) return <div>Error fetching worksheet.</div>;

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-light mb-4">Developer Worksheet</h1>
      <pre className="whitespace-pre-wrap">{data?.developerWorksheet}</pre>
    </div>
  );
};

export default DeveloperWorksheetPage;
