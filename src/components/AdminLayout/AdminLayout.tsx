import { Outlet } from 'react-router-dom';

import AdminNavigation from '../AdminNavigation/AdminNavigation';

import css from './AdminLayout.module.css';
import AdminHeader from '../AdminHeader/AdminHeader';

function AdminLayout() {
  return (
    <div className={css.wrapper}>
      <aside className={css.sidebar}>
        <AdminNavigation />
      </aside>
      <div className={css.content}>
        <header className={css.header}>
          <AdminHeader />
        </header>
        <main className={css.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
