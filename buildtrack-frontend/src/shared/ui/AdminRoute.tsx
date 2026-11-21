import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';

export function AdminRoute() {
  const role = useSelector((s: RootState) => s.auth.role);

  if (role !== 'admin') {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
}
