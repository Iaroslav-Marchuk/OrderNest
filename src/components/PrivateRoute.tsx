import { Navigate, Outlet } from 'react-router-dom';

import { useCurrentUser } from '../hooks/useCurrentUser';
import { useHeartbeat } from '../hooks/useHeartbeat';

const PrivateRoute = () => {
  const { isLoggedIn, isUserLoading } = useCurrentUser();

  useHeartbeat(isLoggedIn);

  if (isUserLoading) return null;
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
