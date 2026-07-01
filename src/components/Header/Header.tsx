import { Link, NavLink, useNavigate } from 'react-router-dom';
import Container from '../Container/Container';
import css from './Header.module.css';

import logo from '/logo.png';
import Navigation from '../Navigation/Navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, LogOut, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutApi } from '../../services/authApi';
import ModalOverlay from '../ModalOverlay/ModalOverlay';
import ConfirmContainer from '../ConfirmContainer/ConfirmContainer';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import type { AxiosError } from 'axios';

function Header() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const openConfirm = () => setIsConfirmOpen(true);
  const closeConfirm = () => setIsConfirmOpen(false);

  const { mutate: logout, isPending } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.clear();
      toast.success('Logged Out!');
      navigate('/login');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message;
      toast.error(message ?? 'Something went wrong!');
    },
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { currentUser, isAdmin } = useCurrentUser();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={css.header}>
      <Container className={css.container}>
        <NavLink to="/">
          <img src={logo} alt="logo" className={css.logo} />
        </NavLink>
        <Navigation />
        <div className={css.avatarWrapper} ref={dropdownRef}>
          {isAdmin ? (
            <Link to="/admin" className={css.backLink}>
              <ArrowLeft size={18} strokeWidth={1.5} />
              Back to admin painel
            </Link>
          ) : undefined}

          <button
            className={css.avatarBtn}
            onClick={() => setIsDropdownOpen(prev => !prev)}
          >
            {currentUser?.name}
          </button>

          {isDropdownOpen && (
            <div className={css.menu}>
              <NavLink
                to="/profile"
                onClick={() => setIsDropdownOpen(false)}
                className={css.menuItem}
              >
                <UserRound size={16} strokeWidth={1.5} />
                Profile
              </NavLink>
              <button
                className={css.menuItem}
                onClick={openConfirm}
                disabled={isPending}
              >
                <LogOut size={16} strokeWidth={1.5} />
                Exit
              </button>
            </div>
          )}
        </div>
      </Container>

      {isConfirmOpen && (
        <ModalOverlay onClose={closeConfirm}>
          <ConfirmContainer
            text={`Do you really want to leave?`}
            onConfirm={logout}
            onClose={closeConfirm}
          />
        </ModalOverlay>
      )}
    </header>
  );
}

export default Header;
