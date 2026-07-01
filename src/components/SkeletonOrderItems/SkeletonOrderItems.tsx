import css from './SkeletonOrderItems.module.css';

function SkeletonOrderItems() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <tr key={`skeleton-${i}`} className={css.skeletonRow}>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '120px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '60px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '100px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '40px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '30px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '80px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '100px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '70px' }} />
          </td>
        </tr>
      ))}
    </>
  );
}

export default SkeletonOrderItems;
