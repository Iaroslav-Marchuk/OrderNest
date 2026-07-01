import css from './SkeletonUsers.module.css';

function SkeletonUsers() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={`skeleton-${i}`} className={css.skeletonRow}>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '20px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '140px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '120px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '80px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '60px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '100px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '60px' }} />
          </td>
        </tr>
      ))}
    </>
  );
}

export default SkeletonUsers;
