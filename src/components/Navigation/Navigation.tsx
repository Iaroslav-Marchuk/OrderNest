import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

import css from './Navigation.module.css';

function Navigation() {
  return (
    <nav className={css.navigation}>
      <NavLink
        to="/"
        className={({ isActive }) => clsx(css.link, isActive && css.active)}
      >
        Active Orders
      </NavLink>
      <NavLink
        to="/archive"
        className={({ isActive }) => clsx(css.link, isActive && css.active)}
      >
        Archive
      </NavLink>
      <NavLink
        to="/stats"
        className={({ isActive }) => clsx(css.link, isActive && css.active)}
      >
        Statistics
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) => clsx(css.link, isActive && css.active)}
      >
        User's Profile
      </NavLink>
    </nav>
  );
}

export default Navigation;
