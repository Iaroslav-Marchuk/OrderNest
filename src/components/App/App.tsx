import { useQuery } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

import GlobalLoader from '../GlobalLoader/GlobalLoader';

import { getCurrentUserApi, refreshSessionApi } from '../../services/authApi';
import { getAccessToken } from '../../services/axiosInstance';
import Layout from '../Layout/Layout';
import PublicRoute from '../PublicRoute';
import PrivateRoute from '../PrivateRoute';
import AdminRoute from '../AdminRoute';
import AdminLayout from '../AdminLayout/AdminLayout';
import SettingsPage from '../../pages/SettingsPage/SettingsPage';
import ActivityPage from '../../pages/ActivityPage/ActivityPage';

const AdminPage = lazy(() => import('../../pages/AdminPage/AdminPage'));
const ArchivePage = lazy(() => import('../../pages/ArchivePage/ArchivePage'));
const AuthPage = lazy(() => import('../../pages/AuthPage/AuthPage'));
const ClientsPage = lazy(() => import('../../pages/ClientsPage/ClientsPage'));
const GlassPage = lazy(() => import('../../pages/GlassPage/GlassPage'));
const MainPage = lazy(() => import('../../pages/MainPage/MainPage'));
const NotFoundPage = lazy(
  () => import('../../pages/NotFoundPage/NotFoundPage')
);
const ProfilePage = lazy(() => import('../../pages/ProfilePage/ProfilePage'));
const StatsPage = lazy(() => import('../../pages/StatsPage/StatsPage'));
const UsersPage = lazy(() => import('../../pages/UsersPage/UsersPage'));

function App() {
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    refreshSessionApi().finally(() => setIsRefreshing(false));
  }, []);

  const { isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUserApi,
    enabled: !isRefreshing && !!getAccessToken(),
    retry: false,
  });

  if (isRefreshing || isLoading) return <GlobalLoader />;

  return (
    <Suspense fallback={<GlobalLoader />}>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<PublicRoute element={<AuthPage />} />} />

        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/users/activity" element={<ActivityPage />} />
            <Route path="/admin/clients" element={<ClientsPage />} />
            <Route path="/admin/glass" element={<GlassPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route path="/admin/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
