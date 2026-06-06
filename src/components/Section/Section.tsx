import css from './Section.module.css';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

function Section({ children, className = '' }: SectionProps) {
  return <div className={`${css.section} ${className}`}>{children}</div>;
}

export default Section;
