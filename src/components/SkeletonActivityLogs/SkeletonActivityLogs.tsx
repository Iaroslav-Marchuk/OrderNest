import css from './SkeletonActivityLogs.module.css';

function SkeletonActivityLogs() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={`skeleton-${i}`}>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '20px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '120px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '100px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '220px' }} />
          </td>
        </tr>
      ))}
    </>
  );
}

export default SkeletonActivityLogs;
