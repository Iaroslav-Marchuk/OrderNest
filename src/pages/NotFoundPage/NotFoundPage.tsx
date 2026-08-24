import { NavLink } from 'react-router-dom';
import css from './NotFoundPage.module.css';

function NotFoundPage() {
  return (
    <div className={css.wrapper}>
      <h1 className={css.title}>404</h1>
      <p className={css.text}>Sorry, we couldn't find this page</p>
      <NavLink to="/" className={css.link}>
        Go back to Home Page
      </NavLink>
    </div>
  );
}

export default NotFoundPage;
