import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnalyticsStats } from '@/lib/types';

interface TrendsChartProps {
  data: AnalyticsStats['monthlyTrends'];
}

export function TrendsChart({ data }: TrendsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-muted-foreground">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
        <XAxis
          dataKey="month"
          stroke="rgba(0,0,0,0.5)"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="rgba(0,0,0,0.5)"
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
          }}
          formatter={(value) => [`${value} applications`, 'Count']}
          labelFormatter={(label) => `Month: ${label}`}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
