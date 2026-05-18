import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { AnalyticsPoint } from '@fitness-tracker/shared-types';

interface MetricBarChartProps {
  data: AnalyticsPoint[];
  color?: string;
}

export function MetricBarChart({ color = '#56c7a1', data }: MetricBarChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ left: 0, right: 12, top: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(23,33,31,0.12)" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} width={42} />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: '1px solid rgba(23,33,31,0.1)',
              boxShadow: '0 12px 30px rgba(23,33,31,0.12)',
            }}
          />
          <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
