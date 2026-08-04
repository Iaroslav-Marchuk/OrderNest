import DashBoardCard from '../../components/DashBoardCard/DashBoardCard';
import DashBoardUserList from '../../components/DashBoardUserList/DashBoardUserList';
import css from './AdminPage.module.css';
import { Users, Building2, Layers, SquareCheck } from 'lucide-react';
import { useAllClients } from '../../hooks/useAllClients';
import { useAllGlassTypes } from '../../hooks/useAllGlassTypes';
import { useStats } from '../../hooks/useStats';
import type { UsersInfoResponse } from '../../types/user';
import { getUsersSessionInfoApi } from '../../services/usersApi';
import { useQuery } from '@tanstack/react-query';
import { useUsers } from '../../hooks/useUsers';

function AdminPage() {
  const { allClients } = useAllClients();
  const { allGlassTypes } = useAllGlassTypes();
  const { totalItems: totalUsers } = useUsers({ perPage: 1 });

  const { data } = useStats();

  const { data: dashboardUsers } = useQuery<UsersInfoResponse>({
    queryKey: ['users', 'dashboard'],
    queryFn: () => getUsersSessionInfoApi(),
  });

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
            value={data?.activeOrders ?? 0}
            trend="—"
            trendType="neutral"
          />
        </li>
      </ul>
      <DashBoardUserList
        users={dashboardUsers?.users ?? []}
        sessionInfo={dashboardUsers?.sessionInfo ?? {}}
      />
    </div>
  );
}

export default AdminPage;
