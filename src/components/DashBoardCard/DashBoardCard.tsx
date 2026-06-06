import { type LucideIcon } from 'lucide-react';
import css from './DashBoardCard.module.css';

type TrendType = 'positive' | 'negative' | 'neutral';

interface DashBoardCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  value: number;
  trend?: string;
  trendType?: TrendType;
}

const trendColor: Record<TrendType, string> = {
  positive: 'var(--color-success)',
  negative: 'var(--color-error)',
  neutral: 'var(--color-text-muted)',
};

const trendArrow: Record<TrendType, string> = {
  positive: '↑',
  negative: '↓',
  neutral: '→',
};

function DashBoardCard({
  title,
  icon: Icon,
  iconColor,
  iconBg,
  value,
  trend,
  trendType = 'neutral',
}: DashBoardCardProps) {
  return (
    <div className={css.card}>
      <div className={css.top}>
        <span className={css.title}>{title}</span>
        <div className={css.iconBox} style={{ background: iconBg }}>
          <Icon size={18} strokeWidth={1.5} style={{ color: iconColor }} />
        </div>
      </div>
      <span className={css.value}>{value}</span>
      {trend && (
        <span className={css.trend} style={{ color: trendColor[trendType] }}>
          {trendArrow[trendType]} {trend}
        </span>
      )}
    </div>
  );
}

export default DashBoardCard;
