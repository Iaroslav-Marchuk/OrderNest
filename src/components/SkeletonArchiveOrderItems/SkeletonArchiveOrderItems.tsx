import css from './SkeletonArchiveOrderItems.module.css';

function SkeletonArchiveOrderItems() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <tr key={`skeleton-${i}`} className={css.skeletonRow}>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '220px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '100px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '40px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '280px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '180px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '160px' }} />
          </td>
        </tr>
      ))}
    </>
  );
}

export default SkeletonArchiveOrderItems;
