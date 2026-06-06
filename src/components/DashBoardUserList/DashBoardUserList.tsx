import clsx from 'clsx';
import type { User } from '../../types/user';
import css from './DashBoardUserList.module.css';

interface DashBoardUserListProps {
  users: User[];
  ordersCount: Record<string, number>; // { [userId]: count }
}

function DashBoardUserList({ users, ordersCount }: DashBoardUserListProps) {
  return (
    <div className={css.wrapper}>
      <h2 className={css.title}>System Users</h2>
      <ul className={css.list}>
        {users.map(user => (
          <li key={user._id} className={css.item}>
            <div className={css.avatar}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className={css.info}>
              <span className={css.name}>{user.name}</span>
              <span className={css.role}>{user.role}</span>
            </div>
            <div className={clsx(css.status, !user.isActive && css.offline)}>
              {user.isActive ? 'Active' : 'Inactive'}
            </div>
            <span className={css.activity}>
              {ordersCount[user._id] ?? 0} orders today
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DashBoardUserList;
