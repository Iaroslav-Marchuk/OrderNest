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

interface UsersRoleFilterProps {
  value: string;
  onChange: (value: string) => void;
}

function UsersRoleFilter({ value, onChange }: UsersRoleFilterProps) {
  return (
    <select
      className={css.select}
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {roles.map(r => (
        <option key={r.value} value={r.value}>
          {r.label}
        </option>
      ))}
    </select>
  );
}

export default UsersRoleFilter;
