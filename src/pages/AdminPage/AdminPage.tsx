import { useQueryClient } from '@tanstack/react-query';
import DashBoardCard from '../../components/DashBoardCard/DashBoardCard';
import DashBoardUserList from '../../components/DashBoardUserList/DashBoardUserList';
import css from './AdminPage.module.css';
import { Users, Building2, Layers, SquareCheck, Users2 } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import { useAllClients } from '../../hooks/useAllClients';
import { useAllGlassTypes } from '../../hooks/useAllGlassTypes';
import { useOrders } from '../../hooks/useOrders';

function AdminPage() {
  const { users, totalItems: totalUsers } = useUsers({
    page: 1,
    perPage: 5,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { allClients } = useAllClients();

  const { allGlassTypes } = useAllGlassTypes();

  // TODO: 'active' — placeholder, потрібен реальний enum статусу Order
  const { totalItems: activeOrdersCount } = useOrders({
    page: 1,
    perPage: 1,
    status: 'active',
  });

  // TODO: немає джерела даних для orders per user — див. питання нижче
  const ordersCountByUser: Record<string, number> = {};

  return (
    <div className={css.wrapper}>
      <h2 className={css.title}>Dashboard</h2>
      <h3 className={css.subtitle}>System Overview</h3>
      <ul className={css.cardList}>
        <li className={css.cardItem}>
          <DashBoardCard
            title="Users"
            icon={Users}
            iconColor="var(--color-accent-hover)"
            iconBg="var(--color-accent-deep)"
            value={totalUsers}
            trend="—"
            trendType="neutral"
          />
        </li>
        <li className={css.cardItem}>
          <DashBoardCard
            title="Clients"
            icon={Building2}
            iconColor="#4cca88"
            iconBg="#0f3d2a"
            value={allClients.length}
            trend="—"
            trendType="neutral"
          />
        </li>
        <li className={css.cardItem}>
          <DashBoardCard
            title="Glass Units"
            icon={Layers}
            iconColor="var(--color-accent-hover)"
            iconBg="var(--color-accent-deep)"
            value={allGlassTypes.length}
            trend="—"
            trendType="neutral"
          />
        </li>
        <li className={css.cardItem}>
          <DashBoardCard
            title="Active Orders"
            icon={SquareCheck}
            iconColor="var(--color-accent-hover)"
            iconBg="var(--color-accent-deep)"
            value={activeOrdersCount}
            trend="—"
            trendType="neutral"
          />
        </li>
      </ul>
      <DashBoardUserList users={users} ordersCount={ordersCountByUser} />
    </div>
  );
}

export default AdminPage;
