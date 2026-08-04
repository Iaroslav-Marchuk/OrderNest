import { formatActivityMessage } from '../../utils/formatActivityMessage';

import type { ActivityLog } from '../../types/activityLogs';

import css from './ActivityLogsRow.module.css';

interface ActivityLogsRowProps {
  log: ActivityLog;
  index: number;
}

function ActivityLogsRow({ log, index }: ActivityLogsRowProps) {
  return (
    <>
      <tr className={css.row}>
        <td className={css.td}>{index}</td>
        <td className={css.td}>
          {new Date(log.createdAt).toLocaleString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </td>
        <td className={css.td}>{log.user?.name}</td>
        <td className={css.td}>{formatActivityMessage(log)}</td>
      </tr>
    </>
  );
}

export default ActivityLogsRow;
