import css from './UsersStatusFilter.module.css';

const statuses = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

interface UsersStatusFilterProps {
  value: string;
  onChange: (value: string) => void;
}

function UsersStatusFilter({ value, onChange }: UsersStatusFilterProps) {
  return (
    <div className={css.group}>
      {statuses.map(s => (
        <button
          key={s.value}
          type="button"
          className={`${css.btn} ${value === s.value ? css.active : ''}`}
          onClick={() => onChange(s.value)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

export default UsersStatusFilter;
