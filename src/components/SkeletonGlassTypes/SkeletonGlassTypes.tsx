import css from './SkeletonGlassTypes.module.css';

function SkeletonGlassTypes() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={`skeleton-${i}`}>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '20px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '200px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '120px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '100px' }} />
          </td>
          <td className={css.td}>
            <div className={css.skeleton} style={{ width: '80px' }} />
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

export default SkeletonGlassTypes;
