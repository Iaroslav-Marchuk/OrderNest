import { keepPreviousData, useQuery } from '@tanstack/react-query';
import css from './ProfilePage.module.css';
import { getCurrentUserApi } from '../../services/authApi';
import ChangePasswordForm from '../../components/ChangePasswordForm/ChangePasswordForm';

function ProfilePage() {
  const { data } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUserApi,
    placeholderData: keepPreviousData,
  });

  const currentUser = data ?? null;

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
        </ul>
      </div>
      {currentUser && <ChangePasswordForm />}
    </div>
  );
}

export default ProfilePage;
