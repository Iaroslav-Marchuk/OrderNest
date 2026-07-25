import Container from '../../components/Container/Container';
import Section from '../../components/Section/Section';
import css from './StatsPage.module.css';
import {
  ActivityIcon,
  Check,
  Plus,
  CircleAlert,
  History,
  ClockArrowUp,
} from 'lucide-react';
import KpiCard from '../../components/KpiCard/KpiCard';
import ChartCard from '../../components/ChartCard/ChartCard';
import OldestOrdersTable from '../../components/OldestOrdersTable/OldestOrdersTable';
import ChartOrdersTrend from '../../components/ChartOrdersTrend/ChartOrdersTrend';
import ChartOrdersPerLine from '../../components/ChartOrdersPerLine/ChartOrdersPerLine';

import type { StatsResponse } from '../../types/stats';
import { getStatsApi } from '../../services/statsApi';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ChartAvgCompletionTimePerLine from '../../components/ChartAvgCompletionTimePerLine/ChartAvgCompletionTimePerLine';

function StatsPage() {
  const { data, isLoading, isError } = useQuery<StatsResponse>({
    queryKey: ['stats'],
    queryFn: () => getStatsApi(),
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return (
      <Section>
        <Container>
          <p>Loading stats...</p>
        </Container>
      </Section>
    );
  }

  if (isError || !data) {
    return (
      <Section>
        <Container>
          <p>Failed to load stats.</p>
        </Container>
      </Section>
    );
  }

  const { oldestActiveOrder } = data;

  const oldestOrderValue = oldestActiveOrder
    ? `EP-${oldestActiveOrder.ep}`
    : 'No active orders';

  const oldestOrderDetails = oldestActiveOrder
    ? [
        oldestActiveOrder.clientName ?? 'Unknown client',
        new Date(oldestActiveOrder.createdAt).toLocaleDateString('en-GB'),
      ]
    : undefined;

  return (
    <Section>
      <Container>
        <h2 className={css.title}>General statistics</h2>

        <div className={css.kpiWrapper}>
          <KpiCard
            color={'var(--color-accent)'}
            title={'Active'}
            value={`${data.activeOrders} orders`}
            icon={ActivityIcon}
          />
          <KpiCard
            color={'var(--color-success)'}
            title={'Completed today'}
            value={`${data.completedToday} orders`}
            icon={Check}
          />
          <KpiCard
            color={'var(--color-warning)'}
            title={'Created today'}
            value={`${data.createdToday} orders`}
            icon={Plus}
          />
          <KpiCard
            color={'var(--color-error)'}
            title={'Delayed'}
            value={`${data.delayedOrders} orders`}
            icon={History}
            subtitle={'More than 3 days'}
          />

          <KpiCard
            color={'var(--color-accent-medium)'}
            title={'Average Time'}
            value={`${data.averageCompletionHours}h`}
            icon={ClockArrowUp}
            subtitle={'Last 30 days'}
          />

          <KpiCard
            color={'var(--color-warning-border)'}
            title={'Oldest Active Order'}
            value={oldestOrderValue}
            details={oldestOrderDetails}
            icon={CircleAlert}
          />
        </div>

        <div className={css.chartWrapper}>
          <ChartCard title={'Created vs. Completed'} subtitle={'Last 14 days'}>
            <ChartOrdersTrend data={data.ordersTrend} />
          </ChartCard>
          <ChartCard title={'Orders per Line'} subtitle={'Active orders'}>
            <ChartOrdersPerLine data={data.ordersPerLine} />
          </ChartCard>
          <ChartCard
            title={'Avg. Daily Orders per Line'}
            subtitle={'Last 30 days'}
          >
            <ChartAvgCompletionTimePerLine
              data={data.avgCompletionTimePerLine}
            />
          </ChartCard>
        </div>

        <div className={css.tableWrapper}>
          <div className={css.tableHeader}>
            <h3 className={css.tableTitle}>Oldest Active Orders</h3>
            <p className={css.tableSubtitle}>Top 10</p>
          </div>

          <OldestOrdersTable orders={data.oldestOrders} />
        </div>
      </Container>
    </Section>
  );
}

export default StatsPage;
