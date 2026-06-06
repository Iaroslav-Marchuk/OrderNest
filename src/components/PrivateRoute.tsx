import { Navigate, Outlet } from 'react-router-dom';

import { useCurrentUser } from '../hooks/useCurrentUser';

const PrivateRoute = () => {
  const { isLoggedIn, isLoading } = useCurrentUser();

  if (isLoading) return null;
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
