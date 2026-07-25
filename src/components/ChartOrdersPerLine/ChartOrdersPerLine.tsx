import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import css from './ChartOrdersPerLine.module.css';
import { formatLocation } from '../../utils/formatLocationLabel';

export interface OrdersPerLine {
  location: string;
  value: number;
}

interface ChartOrdersPerLineProps {
  data: OrdersPerLine[];
}

function ChartOrdersPerLine({ data }: ChartOrdersPerLineProps) {
  return (
    <div className={css.chartWrapper}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            horizontal={false}
          />
          <XAxis
            type="number"
            allowDecimals={false}
            stroke="var(--color-text-muted)"
            fontSize={12}
          />
          <YAxis
            type="category"
            dataKey="location"
            tickFormatter={formatLocation}
            stroke="var(--color-text-muted)"
            fontSize={12}
            width={60}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
            }}
          />
          <Bar
            dataKey="value"
            name="Active orders"
            fill="var(--color-accent)"
            radius={[0, 4, 4, 0]}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartOrdersPerLine;
