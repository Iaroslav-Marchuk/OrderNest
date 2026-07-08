import css from './SkeletonProfile.module.css';

function SkeletonProfile() {
  return (
    <div className={css.wrapper}>
      <h2 className={css.title}>User's profile</h2>
      <div className={css.top}>
        <div className={css.line1}>
          <div
            className={`${css.avatar} ${css.skeleton}`}
            style={{ width: 48, height: 48 }}
          />
          <div
            className={`${css.skeleton}`}
            style={{ width: 140, height: 20 }}
          />
        </div>
      </div>
      <div className={css.middle}>
        <ul className={css.list}>
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className={css.item}>
              <div className={css.skeleton} style={{ width: 80, height: 16 }} />
              <div
                className={css.skeleton}
                style={{ width: 120, height: 16 }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SkeletonProfile;
