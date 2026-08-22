import clsx from 'clsx';
import type { SessionInfo, User } from '../../types/user';
import css from './DashBoardUserList.module.css';
import { formatLocation } from '../../utils/formatLocationLabel';

interface DashBoardUserListProps {
  users: User[];
  sessionInfo: Record<string, SessionInfo>;
}

function DashBoardUserList({ users, sessionInfo }: DashBoardUserListProps) {
  return (
    <div className={css.wrapper}>
      <h2 className={css.title}>System Users</h2>
      <ul className={css.list}>
        {users.map(user => {
          const info = sessionInfo[user._id];
          const hasSession = Boolean(info);
          const isOnline = info?.isOnline ?? false;
          const location = info?.location ?? null;

          const locationLabel = hasSession
            ? user.role === 'assembly' && location
              ? formatLocation(location)
              : user.role
            : null;

          return (
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
              <span className={clsx(css.loggedIn, !isOnline && css.loggedOut)}>
                {isOnline ? 'Online' : hasSession ? 'Away' : 'Offline'}
              </span>
              <span className={clsx(css.location, !location && css.notLocated)}>
                {locationLabel ? `${locationLabel}` : '-'}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default DashBoardUserList;
