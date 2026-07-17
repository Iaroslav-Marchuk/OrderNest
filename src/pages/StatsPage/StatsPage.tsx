import Container from '../../components/Container/Container';
import Section from '../../components/Section/Section';
import css from './StatsPage.module.css';

function StatsPage() {
  return (
    <Section>
      <Container>
        <div className={css.wrapper}>
          <h2 className={css.title}>General statistics</h2>
        </div>
      </Container>
    </Section>
  );
}

export default StatsPage;
