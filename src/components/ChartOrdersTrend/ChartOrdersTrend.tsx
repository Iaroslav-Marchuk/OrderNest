import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import css from './ChartOrdersTrend.module.css';

export interface OrdersTrendPoint {
  date: string;
  created: number;
  completed: number;
}

interface OrdersTrendChartProps {
  data: OrdersTrendPoint[];
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' });
}

function ChartOrdersTrend({ data }: OrdersTrendChartProps) {
  return (
    <div className={css.chartWrapper}>
      <ResponsiveContainer width="100%" aspect={1.618}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="var(--color-text-muted)"
            fontSize={12}
          />
          <YAxis
            allowDecimals={false}
            stroke="var(--color-text-muted)"
            fontSize={12}
          />
          <Tooltip
            labelFormatter={label => formatDate(String(label))}
            contentStyle={{
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="created"
            name="Created"
            stroke="var(--color-accent)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="completed"
            name="Completed"
            stroke="var(--color-success)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartOrdersTrend;
