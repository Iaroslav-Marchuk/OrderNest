import type { LucideIcon } from 'lucide-react';

import css from './KpiCard.module.css';

interface KpiCardProps {
  color: string;
  title: string;
  subtitle?: string;
  value: string | number;
  details?: string | string[];
  icon: LucideIcon;
}

function KpiCard({
  color,
  title,
  value,
  details,
  icon: Icon,
  subtitle,
}: KpiCardProps) {
  const detailLines = Array.isArray(details)
    ? details
    : details
      ? [details]
      : [];

  return (
    <div
      className={css.card}
      style={{ '--kpi-color': color } as React.CSSProperties}
    >
      <div className={css.wrapper}>
        <span className={css.iconWrapper}>
          <Icon size={18} className={css.icon} />
        </span>
        <span className={css.title}>{title}</span>
      </div>

      <span className={css.value}>{value}</span>
      {subtitle && <span className={css.subtitle}>{subtitle}</span>}
      {detailLines.length > 0 && (
        <div className={css.detailsList}>
          {detailLines.map(line => (
            <span key={line} className={css.details}>
              {line}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default KpiCard;
