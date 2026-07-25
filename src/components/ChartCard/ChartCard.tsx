import type { ReactNode } from 'react';
import css from './ChartCard.module.css';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <section className={css.card}>
      <header className={css.header}>
        <div>
          <h3 className={css.title}>{title}</h3>

          {subtitle && <p className={css.subtitle}>{subtitle}</p>}
        </div>
      </header>

      <div className={css.content}>{children}</div>
    </section>
  );
}

export default ChartCard;
