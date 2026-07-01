import css from './ProfilePage.module.css';
import ChangePasswordForm from '../../components/ChangePasswordForm/ChangePasswordForm';
import { useCurrentUser } from '../../hooks/useCurrentUser';

function ProfilePage() {
  const LOCATION_LABEL: Record<string, string> = {
    line_1: 'Line 1',
    line_2: 'Line 2',
    line_3: 'Line 3',
  };

  const { currentUser, isUserLoading, location } = useCurrentUser();

  if (isUserLoading) {
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
                <div
                  className={css.skeleton}
                  style={{ width: 80, height: 16 }}
                />
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

  return (
    <div className={css.wrapper}>
      <h2 className={css.title}>User's profile</h2>
      <div className={css.top}>
        <div className={css.line1}>
          <div className={css.avatar}>
            {currentUser?.name.charAt(0).toUpperCase()}
          </div>
          <span className={css.name}>{currentUser?.name}</span>
        </div>
        <div className={css.line2}>
          <span className={css.role}>{currentUser?.role}</span>
          <span className={css.isActive}>
            {currentUser?.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      <div className={css.middle}>
        <ul className={css.list}>
          <li className={css.item}>
            <span className={css.itemLabel}>Telephone</span>
            <span className={css.itemValue}>{currentUser?.tel}</span>
          </li>
          <li className={css.item}>
            <span>Member since</span>
            <span>
              <span>
                {currentUser?.createdAt
                  ? new Date(currentUser.createdAt).toLocaleDateString('en-GB')
                  : '—'}
              </span>
            </span>
          </li>
          <li className={css.item}>
            <span className={css.itemLabel}>Role</span>
            <span className={css.itemValue}>{currentUser?.role}</span>
          </li>

          {location && (
            <li className={css.item}>
              <span className={css.itemLabel}>Location</span>
              <span className={css.itemValue}>
                {LOCATION_LABEL[location] ?? location}
              </span>
            </li>
          )}
        </ul>
      </div>
      {currentUser && <ChangePasswordForm />}
    </div>
  );
}

export default ProfilePage;
