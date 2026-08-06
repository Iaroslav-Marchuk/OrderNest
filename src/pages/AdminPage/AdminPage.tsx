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
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import { useOrders } from '../../hooks/useOrders';

function AdminPage() {
  const { allClients, lastClient } = useAllClients();
  const { allGlassTypes, lastGlassType } = useAllGlassTypes();
  const { totalItems: totalUsers, users } = useUsers({
    perPage: 1,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const lastUser = users[0] ?? null;

  const { data } = useStats();

  const { orders } = useOrders({
    perPage: 1,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const lastOrder = orders[0] ?? null;

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
            upd={
              lastUser
                ? `Last added: ${lastUser.name} · ${formatRelativeTime(lastUser.createdAt)}`
                : 'No users yet'
            }
          />
        </li>
        <li className={css.cardItem}>
          <DashBoardCard
            title="Clients"
            icon={Building2}
            iconColor="#4cca88"
            iconBg="#0f3d2a"
            value={allClients.length}
            upd={
              lastClient
                ? `Last added: ${lastClient.name} · ${formatRelativeTime(lastClient.createdAt)}`
                : 'No clients yet'
            }
          />
        </li>
        <li className={css.cardItem}>
          <DashBoardCard
            title="Glass Units"
            icon={Layers}
            iconColor="var(--color-accent-hover)"
            iconBg="var(--color-accent-deep)"
            value={allGlassTypes.length}
            upd={
              lastGlassType
                ? `Last added: ${lastGlassType.label} · ${formatRelativeTime(lastGlassType.createdAt)}`
                : 'No glass units yet'
            }
          />
        </li>
        <li className={css.cardItem}>
          <DashBoardCard
            title="Active Orders"
            icon={SquareCheck}
            iconColor="var(--color-accent-hover)"
            iconBg="var(--color-accent-deep)"
            value={data?.activeOrders ?? 0}
            upd={
              lastOrder
                ? `Last added: EP-${lastOrder.ep} · ${formatRelativeTime(lastOrder.createdAt)}`
                : 'No orders yet'
            }
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
