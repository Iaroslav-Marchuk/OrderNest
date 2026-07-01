import { Navigate } from 'react-router-dom';

import { useCurrentUser } from '../hooks/useCurrentUser';

interface PublicRouteProps {
  element: React.ReactNode;
}

const PublicRoute = ({ element }: PublicRouteProps) => {
  const { isLoggedIn, isAdmin, isUserLoading } = useCurrentUser();
  if (isUserLoading) return null;
  if (!isLoggedIn) return element;
  return <Navigate to={isAdmin ? '/admin' : '/'} replace />;
};

export default PublicRoute;
