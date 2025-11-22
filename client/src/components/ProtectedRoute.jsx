import { Navigate } from 'react-router-dom';
import { useAdmin } from '../state/AdminContext.jsx';

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

