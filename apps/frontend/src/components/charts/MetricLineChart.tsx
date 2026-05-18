import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { AnalyticsPoint } from '@fitness-tracker/shared-types';

interface MetricLineChartProps {
  data: AnalyticsPoint[];
  color?: string;
}

export function MetricLineChart({ color = '#255f4f', data }: MetricLineChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ left: 0, right: 12, top: 10, bottom: 0 }}>
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
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
