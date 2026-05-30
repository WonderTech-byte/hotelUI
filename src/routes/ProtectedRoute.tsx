import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import type { UserType } from '../types';

interface Props {
  children: React.ReactNode;
  allowedRoles: UserType[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.userType)) {
    if (user.userType === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.userType === 'FRONT_DESK') return <Navigate to="/frontdesk" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
