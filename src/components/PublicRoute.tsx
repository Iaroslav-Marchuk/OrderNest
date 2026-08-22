import { Navigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';

interface PublicRouteProps {
  element: React.ReactNode;
}

const PublicRoute = ({ element }: PublicRouteProps) => {
  const { currentUser, isLoggedIn, isAdmin, location } = useCurrentUser();

  const needsLocation = currentUser?.role === 'assembly' && !location;

  if (isLoggedIn && !needsLocation) {
    return <Navigate to={isAdmin ? '/admin' : '/'} replace />;
  }

  return element;
};

export default PublicRoute;
