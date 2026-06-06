import { NavLink, Link } from 'react-router-dom';
import {
  Users,
  Building2,
  Layers,
  ArrowLeft,
  ActivityIcon,
  Settings,
  Shield,
} from 'lucide-react';
import clsx from 'clsx';
import css from './AdminNavigation.module.css';

function AdminNavigation() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    clsx(css.link, isActive && css.active);

  return (
    <div className={css.wrapper}>
      <NavLink to="/admin" className={css.logo}>
        <Shield size={24} strokeWidth={2} />
        <span className={css.title}>Admin Panel</span>
      </NavLink>

      <nav className={css.nav}>
        <div className={css.group}>
          <span className={css.groupLabel}>Management</span>
          <ul className={css.list}>
            <li>
              <NavLink to="/admin/users" className={linkClass} end>
                <Users size={18} strokeWidth={1.5} />
                Users
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/users/activity" className={linkClass}>
                <ActivityIcon size={18} strokeWidth={1.5} />
                User Activity
              </NavLink>
            </li>
          </ul>
        </div>

        <div className={css.group}>
          <span className={css.groupLabel}>Catalogs</span>
          <ul className={css.list}>
            <li>
              <NavLink to="/admin/clients" className={linkClass}>
                <Building2 size={18} strokeWidth={1.5} />
                Clients
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/glass" className={linkClass}>
                <Layers size={18} strokeWidth={1.5} />
                Glass Units
              </NavLink>
            </li>
          </ul>
        </div>

        <div className={css.group}>
          <span className={css.groupLabel}>Configuration</span>
          <ul className={css.list}>
            <li>
              <NavLink to="/admin/settings" className={linkClass}>
                <Settings size={18} strokeWidth={1.5} />
                Settings
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      <div className={css.footer}>
        <Link to="/" className={css.backLink}>
          <ArrowLeft size={18} strokeWidth={1.5} />
          Back to App
        </Link>
      </div>
    </div>
  );
}

export default AdminNavigation;
