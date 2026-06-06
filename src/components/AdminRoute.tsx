import { Navigate, Outlet } from 'react-router-dom';

import { useCurrentUser } from '../hooks/useCurrentUser';

const AdminRoute = () => {
  const { isLoggedIn, isAdmin, isLoading } = useCurrentUser();

  if (isLoading) return null;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
