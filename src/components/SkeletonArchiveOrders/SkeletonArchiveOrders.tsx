import css from './SkeletonArchiveOrders.module.css';

function SkeletonArchiveOrders() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={`skeleton-${i}`} className={css.skeletonRow}>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '60px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '100px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '420px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '100px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '200px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '200px' }} />
          </td>
        </tr>
      ))}
    </>
  );
}

export default SkeletonArchiveOrders;
