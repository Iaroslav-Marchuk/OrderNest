import { Navigate } from 'react-router-dom';

import { useCurrentUser } from '../hooks/useCurrentUser';

interface PublicRouteProps {
  element: React.ReactNode;
}

const PublicRoute = ({ element }: PublicRouteProps) => {
  const { isLoggedIn, isLoading } = useCurrentUser();

  if (isLoading) return null;
  return isLoggedIn ? <Navigate to="/" replace /> : element;
};

export default PublicRoute;
