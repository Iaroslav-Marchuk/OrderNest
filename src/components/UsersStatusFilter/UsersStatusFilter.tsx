import { useSearchParams } from 'react-router-dom';
import css from './UsersStatusFilter.module.css';

const statuses = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

function UsersStatusFilter() {
  const [query, setQuery] = useSearchParams();
  const current = query.get('status') || 'all';

  const handleClick = (value: string) => {
    setQuery(prev => {
      const params = new URLSearchParams(prev);
      if (value === 'all') {
        params.delete('status');
      } else {
        params.set('status', value);
      }
      return params;
    });
  };

  return (
    <div className={css.group}>
      {statuses.map(s => (
        <button
          key={s.value}
          type="button"
          className={`${css.btn} ${current === s.value ? css.active : ''}`}
          onClick={() => handleClick(s.value)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

export default UsersStatusFilter;
