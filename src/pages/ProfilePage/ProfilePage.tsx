import css from './ProfilePage.module.css';

import { useCurrentUser } from '../../hooks/useCurrentUser';
import SkeletonProfile from '../../components/SkeletonProfile/SkeletonProfile';
import { useState } from 'react';
import ModalOverlay from '../../components/ModalOverlay/ModalOverlay';
import ChangePasswordForm from '../../components/ChangePasswordForm/ChangePasswordForm';

const LOCATION_LABEL: Record<string, string> = {
  line_1: 'Line 1',
  line_2: 'Line 2',
  line_3: 'Line 3',
};

function ProfilePage() {
  const { currentUser, isUserLoading, location } = useCurrentUser();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const openModal = () => setShowChangePassword(true);
  const closeModal = () => setShowChangePassword(false);

  if (isUserLoading) {
    return <SkeletonProfile />;
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
          {location && (
            <span className={css.locationBadge}>
              {LOCATION_LABEL[location] ?? location}
            </span>
          )}
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
              {currentUser?.createdAt
                ? new Date(currentUser.createdAt).toLocaleDateString('en-GB')
                : '—'}
            </span>
          </li>
          <li className={css.item}>
            <span className={css.itemLabel}>Role</span>
            <span className={css.itemValue}>{currentUser?.role}</span>
          </li>
        </ul>
      </div>

      <div className={css.middle}>
        <div className={css.item}>
          <span className={css.itemLabel}>Password</span>
          <button
            type="button"
            className={css.changePasswordBtn}
            onClick={openModal}
          >
            Change
          </button>
        </div>
      </div>

      {showChangePassword && (
        <ModalOverlay onClose={closeModal}>
          <ChangePasswordForm onSuccess={closeModal} />
        </ModalOverlay>
      )}
    </div>
  );
}

export default ProfilePage;
