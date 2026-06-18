import css from './Section.module.css';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

function Section({ children, className = '' }: SectionProps) {
  return (
    <section className={`${css.section} ${className}`}>{children}</section>
  );
}

export default Section;
