import { ChartLine, ShieldCheck, UsersRound } from 'lucide-react';
import logo from '/logo.png';

import css from './AuthPage.module.css';
import LoginForm from '../../components/LoginForm/LoginForm';
import Section from '../../components/Section/Section';
import Container from '../../components/Container/Container';

function AuthPage() {
  return (
    <Section className={css.section}>
      <Container className={css.container}>
        <div className={css.header}>
          <img src={logo} alt="logo" className={css.logo} />
          <span className={css.headerSpan}>Order Nest</span>
        </div>

        <div className={css.wrapper}>
          <div className={css.leftSide}>
            <h1 className={css.title}>
              Control. Analyze. <span className={css.span}>Achieve more</span>
            </h1>

            <p className={css.text}>
              OrderNest gives your team the tools to work smarter, make
              data-driven decisions, and reach your goals faster!
            </p>

            <ul className={css.list}>
              <li className={css.item}>
                <div className={css.itemIcon}>
                  <ChartLine size={24} />
                </div>

                <div className={css.itemWrapper}>
                  <h3 className={css.itemTitle}>Analitycs</h3>
                  <span className={css.itemSpan}>
                    Detailed reports and real-time visualizations
                  </span>
                </div>
              </li>
              <li className={css.item}>
                <div className={css.itemIcon}>
                  <UsersRound size={24} />
                </div>

                <div className={css.itemWrapper}>
                  <h3 className={css.itemTitle}>Team Work</h3>
                  <span className={css.itemSpan}>
                    Collaborative workflows and seamless communication
                  </span>
                </div>
              </li>
              <li className={css.item}>
                <div className={css.itemIcon}>
                  <ShieldCheck size={24} />
                </div>
                <div className={css.itemWrapper}>
                  <h3 className={css.itemTitle}>Security</h3>
                  <span className={css.itemSpan}>
                    Your data is securely protected
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <div className={css.rigthSide}>
            <div className={css.formCard}>
              <h2 className={css.formTitle}>Welcome back!</h2>
              <h3 className={css.subtitle}>Sign in to your account</h3>
              <LoginForm />
            </div>
          </div>
        </div>

        <p className={css.rights}>
          &copy; 2026 Vidreira Algarvia Order Nest. All rigths reserved.
        </p>
      </Container>
    </Section>
  );
}

export default AuthPage;
