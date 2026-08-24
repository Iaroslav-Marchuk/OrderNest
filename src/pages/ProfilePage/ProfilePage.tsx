import { Send } from 'lucide-react';
import { useState } from 'react';

import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useTelegramLink } from '../../hooks/useTelegrammLink';

import { formatLocation } from '../../utils/formatLocationLabel';

import SkeletonProfile from '../../components/SkeletonProfile/SkeletonProfile';
import ModalOverlay from '../../components/ModalOverlay/ModalOverlay';
import ChangePasswordForm from '../../components/ChangePasswordForm/ChangePasswordForm';
import Container from '../../components/Container/Container';
import Section from '../../components/Section/Section';

import css from './ProfilePage.module.css';

function ProfilePage() {
  const { currentUser, isUserLoading, location } = useCurrentUser();
  const { connectTelegram, isConnecting } = useTelegramLink();

  const [showChangePassword, setShowChangePassword] = useState(false);

  const openModal = () => setShowChangePassword(true);
  const closeModal = () => setShowChangePassword(false);

  if (isUserLoading) {
    return <SkeletonProfile />;
  }

  return (
    <Section>
      <Container className={css.container}>
        <h2 className={css.title}>User's profile</h2>

        <div className={css.wrapper}>
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
                  {formatLocation(location)}
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
                    ? new Date(currentUser.createdAt).toLocaleDateString(
                        'en-GB'
                      )
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
              <button type="button" className={css.btn} onClick={openModal}>
                Change
              </button>
            </div>
          </div>

          <div className={css.middle}>
            <div className={css.item}>
              <span className={css.itemLabel}>Telegramm Bot</span>
              <button
                type="button"
                className={css.btn}
                onClick={() => connectTelegram()}
                disabled={isConnecting}
              >
                <Send size={16} />
                {isConnecting ? 'Generating link...' : 'Connect Telegram'}
              </button>
            </div>
          </div>
        </div>

        {showChangePassword && (
          <ModalOverlay onClose={closeModal}>
            <ChangePasswordForm onSuccess={closeModal} />
          </ModalOverlay>
        )}
      </Container>
    </Section>
  );
}

export default ProfilePage;
