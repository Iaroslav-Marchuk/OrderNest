import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import css from './ChartAvgCompletionTimePerLine.module.css';
import { formatLocation } from '../../utils/formatLocationLabel';

export interface AvgDailyOrdersPerLinePoint {
  location: string;
  value: number;
}

interface ChartAvgDailyOrdersPerLineProps {
  data: AvgDailyOrdersPerLinePoint[];
}

function ChartAvgCompletionTimePerLine({
  data,
}: ChartAvgDailyOrdersPerLineProps) {
  return (
    <div className={css.chartWrapper}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            vertical={false}
          />
          <XAxis
            dataKey="location"
            tickFormatter={formatLocation}
            stroke="var(--color-text-muted)"
            fontSize={12}
          />
          <YAxis
            allowDecimals={false}
            stroke="var(--color-text-muted)"
            fontSize={12}
          />
          <Tooltip
            labelFormatter={label => formatLocation(String(label))}
            formatter={value => `${Number(value).toFixed(1)}h`}
            contentStyle={{
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
            }}
          />
          <Bar
            dataKey="value"
            name="Avg. completion time"
            fill="var(--color-accent-medium)"
            radius={[4, 4, 0, 0]}
            barSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartAvgCompletionTimePerLine;
