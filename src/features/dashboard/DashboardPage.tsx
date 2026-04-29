import { useEffect, useState } from 'react';
import { getDashboardSummary } from './dashboardApi';
import { getStoredAuth } from '../auth/authStorage';

export function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const auth = getStoredAuth();

        if (!auth) {
          return;
        }

        const result = await getDashboardSummary(auth.token);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      }
    }

    load();
  }, []);

  if (error) {
    return <div className="form-error">{error}</div>;
  }

  if (!data) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-grid">
      <Card title="Active Workers" value={data.activeWorkers} />
      <Card title="Active Teams" value={data.activeTeams} />
      <Card title="Inventory Items" value={data.inventoryItems} />
      <Card title="Pending Inventory" value={data.pendingInventoryItems} />
      <Card title="Attendance (This Month)" value={data.attendanceThisMonth} />
      <Card title="Finance (This Month)" value={`R ${data.financeThisMonth}`} />
    </div>
  );
}

function Card({ title, value }: { title: string; value: any }) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
    </div>
  );
}