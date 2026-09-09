import { Navigate, Outlet } from 'react-router-dom';
import { useMe } from '@/features/auth/api/auth.queries';

export function ProtectedRoute() {
  const { data: user, isLoading } = useMe();

  if (isLoading) {
    return <></>
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}