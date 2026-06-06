import { Bell, LogOut, ShieldUser, UserRound } from 'lucide-react';
import logo from '../../assets/logo-sticky-2x.png';
import css from './AdminHeader.module.css';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutApi } from '../../services/authApi';
import toast from 'react-hot-toast';
import ModalOverlay from '../ModalOverlay/ModalOverlay';
import ConfirmContainer from '../ConfirmContainer/ConfirmContainer';

function AdminHeader() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logout } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.clear();
      navigate('/login');
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const openConfirm = () => setIsConfirmOpen(true);
  const closeConfirm = () => setIsConfirmOpen(false);

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const date = now.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const time = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    closeConfirm();
  };

  return (
    <header className={css.header}>
      <div className={css.wrapper}>
        <img src={logo} alt="logo" className={css.logo} />
        <span className={css.headerSpan}>Order Nest</span>
      </div>

      <div className={css.wrapper2}>
        <div className={css.currentDate}>
          <span>{date}</span>
          <span className={css.time}>{time}</span>
        </div>
        <div className={css.bell}>
          <Bell size={20} strokeWidth={1.5} />
        </div>

        <div className={css.avatarWrapper} ref={menuRef}>
          <button className={css.avatar} onClick={() => setIsMenuOpen(p => !p)}>
            <ShieldUser size={20} strokeWidth={1.5} />
          </button>
          {isMenuOpen && (
            <div className={css.menu}>
              <Link
                to="/admin/profile"
                className={css.menuItem}
                onClick={() => setIsMenuOpen(false)}
              >
                <UserRound size={16} strokeWidth={1.5} />
                Profile
              </Link>
              <button className={css.menuItem} onClick={openConfirm}>
                <LogOut size={16} strokeWidth={1.5} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {isConfirmOpen && (
        <ModalOverlay onClose={closeConfirm}>
          <ConfirmContainer
            text="Do you really want to leave?"
            onConfirm={handleLogout}
            onClose={closeConfirm}
          />
        </ModalOverlay>
      )}
    </header>
  );
}

export default AdminHeader;
