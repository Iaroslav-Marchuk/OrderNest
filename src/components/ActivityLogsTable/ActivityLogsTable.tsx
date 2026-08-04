import ActivityLogsRow from '../ActivityLogsRow/ActivityLogsRow';
import SkeletonActivityLogs from '../SkeletonActivityLogs/SkeletonActivityLogs';

import type { ActivityLog } from '../../types/activityLogs';

import css from './ActivityLogsTable.module.css';

interface ActivityLogsTableProps {
  activityLogs: ActivityLog[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  perPage: number;
}

function ActivityLogsTable({
  activityLogs,
  isLoading,
  isError,
  page,
  perPage,
}: ActivityLogsTableProps) {
  if (isError) return <p className={css.state}>Something went wrong!</p>;

  if (!isLoading && activityLogs.length === 0)
    return <p className={css.state}>No activity logs found!</p>;

  return (
    <table className={css.table}>
      <thead className={css.header}>
        <tr>
          <th className={css.th}>#</th>
          <th className={css.th}>Date/Time</th>
          <th className={css.th}>User</th>
          <th className={css.th}>Action</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <SkeletonActivityLogs />
        ) : (
          activityLogs.map((log, index) => (
            <ActivityLogsRow
              key={log._id}
              log={log}
              index={(page - 1) * perPage + index + 1}
            />
          ))
        )}
      </tbody>
    </table>
  );
}

export default ActivityLogsTable;
