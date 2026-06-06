import css from './Container.module.css';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

function Container({ children, className = '' }: ContainerProps) {
  return <div className={`${css.container} ${className}`}>{children}</div>;
}

export default Container;
