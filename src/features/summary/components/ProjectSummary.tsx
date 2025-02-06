import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';

interface SummaryData {
  package: { id: string; title: string; price_eur: number; features: string[] };
  addons: Array<{ id: string; title: string; price_eur: number }>;
  planner: { client_summary: string; developer_worksheet: string };
  total_price_eur: number;
}

const ProjectSummary: React.FC<{ projectId: number; onConfirm: () => void }> = ({ projectId, onConfirm }) => {
  const { data, isLoading, error } = useQuery<SummaryData>(['project-summary', projectId], async () => {
    const res = await axios.get(`/api/projects/${projectId}/summary/`);
    return res.data;
  });

  if (isLoading) return <div>Loading summary...</div>;
  if (error || !data) return <div>Error loading summary.</div>;

  return (
    <div>
      <h2>Review Your Project</h2>
      <section>
        <h3>Package: {data.package.title}</h3>
        <p>Price: €{data.package.price_eur}</p>
        <ul>
          {data.package.features.map((feature, i) => <li key={i}>{feature}</li>)}
        </ul>
      </section>
      <section>
        <h3>Addons</h3>
        <ul>
          {data.addons.map(addon => (
            <li key={addon.id}>{addon.title}: €{addon.price_eur}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Planner Summary</h3>
        <p>{data.planner.client_summary}</p>
      </section>
      <section>
        <h3>Total Cost: €{data.total_price_eur}</h3>
      </section>
      <button onClick={onConfirm}>Confirm & Proceed to Payment</button>
    </div>
  );
};

export default ProjectSummary;
