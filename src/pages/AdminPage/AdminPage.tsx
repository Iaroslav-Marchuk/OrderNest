import DashBoardCard from '../../components/DashBoardCard/DashBoardCard';
import DashBoardUserList from '../../components/DashBoardUserList/DashBoardUserList';
import css from './AdminPage.module.css';
import { Users, Building2, Layers, SquareCheck } from 'lucide-react';
import type { User } from '../../types/user';

const mockUsers: User[] = [
  {
    _id: '1',
    name: 'João Silva',
    tel: '+351910000001',
    role: 'cutting',
    telegramChatId: null,
    isActive: true,
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2026-06-03T09:00:00.000Z',
  },
  {
    _id: '2',
    name: 'Maria Santos',
    tel: '+351910000002',
    role: 'assembly',
    telegramChatId: '123456',
    isActive: true,
    createdAt: '2025-02-14T08:00:00.000Z',
    updatedAt: '2026-06-03T10:30:00.000Z',
  },
  {
    _id: '3',
    name: 'Rui Costa',
    tel: '+351910000003',
    role: 'logistics',
    telegramChatId: null,
    isActive: false,
    createdAt: '2025-03-01T08:00:00.000Z',
    updatedAt: '2026-06-02T17:00:00.000Z',
  },
  {
    _id: '4',
    name: 'Ana Ferreira',
    tel: '+351910000004',
    role: 'quality',
    telegramChatId: '789012',
    isActive: true,
    createdAt: '2025-04-20T08:00:00.000Z',
    updatedAt: '2026-06-03T11:15:00.000Z',
  },
];

const mockOrdersCount: Record<string, number> = {
  '1': 18,
  '2': 12,
  '3': 0,
  '4': 7,
};

function AdminPage() {
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
            value={12}
            trend="+2 this month"
            trendType="positive"
          />
        </li>
        <li className={css.cardItem}>
          <DashBoardCard
            title="Clients"
            icon={Building2}
            iconColor="#4cca88"
            iconBg="#0f3d2a"
            value={48}
            trend="+5 this month"
            trendType="positive"
          />
        </li>
        <li className={css.cardItem}>
          <DashBoardCard
            title="Glass Units"
            icon={Layers}
            iconColor="var(--color-accent-hover)"
            iconBg="var(--color-accent-deep)"
            value={134}
            trend="no changes"
            trendType="neutral"
          />
        </li>
        <li className={css.cardItem}>
          <DashBoardCard
            title="Active Orders"
            icon={SquareCheck}
            iconColor="var(--color-accent-hover)"
            iconBg="var(--color-accent-deep)"
            value={49}
            trend="+5 today"
            trendType="positive"
          />
        </li>
      </ul>
      <DashBoardUserList users={mockUsers} ordersCount={mockOrdersCount} />
    </div>
  );
}

export default AdminPage;
