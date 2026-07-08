import Container from '../Container/Container';
import css from './Footer.module.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={css.footer}>
      <Container className={css.container}>
        <span>© {currentYear} OrderNest</span>
        <span className={css.version}>v1.0.0</span>
        <span>All rights reserved</span>
      </Container>
    </footer>
  );
}

export default Footer;
