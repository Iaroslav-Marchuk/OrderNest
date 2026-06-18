import { NavLink, useNavigate } from 'react-router-dom';
import Container from '../Container/Container';
import css from './Header.module.css';

import logo from '/logo.png';
import Navigation from '../Navigation/Navigation';
import { useEffect, useRef, useState } from 'react';
import { LogOut, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutApi } from '../../services/authApi';
import ModalOverlay from '../ModalOverlay/ModalOverlay';
import ConfirmContainer from '../ConfirmContainer/ConfirmContainer';

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
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
          <button
            className={css.avatarBtn}
            onClick={() => setIsDropdownOpen(prev => !prev)}
          >
            A
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
