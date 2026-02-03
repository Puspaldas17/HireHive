import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { JobStatus } from '@/lib/types';

interface StatusChartProps {
  data: Record<JobStatus, number>;
}

const STATUS_COLORS: Record<JobStatus, string> = {
  Applied: '#3b82f6',
  Interview: '#8b5cf6',
  Offer: '#10b981',
  Rejected: '#ef4444',
  OnHold: '#f59e0b',
};

export function StatusChart({ data }: StatusChartProps) {
  const chartData = Object.entries(data)
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({
      name: status,
      value: count,
      color: STATUS_COLORS[status as JobStatus],
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-muted-foreground">
        <p>No applications yet</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value, percent }) => `${name} (${value})`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${value} applications`, 'Count']}
          contentStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
