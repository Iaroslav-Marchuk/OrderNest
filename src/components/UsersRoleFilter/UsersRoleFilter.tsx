import { useSearchParams } from 'react-router-dom';
import type { UserRole } from '../../types/user';
import css from './UsersRoleFilter.module.css';

type RoleFilter = UserRole | 'all';

const roles: { value: RoleFilter; label: string }[] = [
  { value: 'all', label: 'All Roles' },
  { value: 'cutting', label: 'Cutting' },
  { value: 'hardening', label: 'Hardening' },
  { value: 'assembly', label: 'Assembly' },
  { value: 'quality', label: 'Quality' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'guest', label: 'Guest' },
];

function UsersRoleFilter() {
  const [query, setQuery] = useSearchParams();
  const current = query.get('role') || 'all';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuery(prev => {
      const params = new URLSearchParams(prev);
      if (e.target.value === 'all') {
        params.delete('role');
      } else {
        params.set('role', e.target.value);
      }
      return params;
    });
  };

  return (
    <select className={css.select} value={current} onChange={handleChange}>
      {roles.map(r => (
        <option key={r.value} value={r.value}>
          {r.label}
        </option>
      ))}
    </select>
  );
}

export default UsersRoleFilter;
