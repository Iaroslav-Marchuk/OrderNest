import { type LucideIcon } from 'lucide-react';

import css from './DashBoardCard.module.css';

interface DashBoardCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  value: number;
  upd: string;
}

function DashBoardCard({
  title,
  icon: Icon,
  iconColor,
  iconBg,
  value,
  upd,
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
      <span className={css.trend}>{upd}</span>
    </div>
  );
}

export default DashBoardCard;
