import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../store/useAuthStore';

// Komponen pelindung halaman Admin.
// Memastikan hanya user dengan role 'admin' yang bisa mengakses.
export default function AdminGuard({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if auth state is loaded from localStorage
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) {
      navigate('/admin/login');
      return;
    }

    if (!isAuthenticated) {
      navigate('/admin/login');
    } else if (user.role !== 'admin' && user.role !== 'superadmin') {
      // Strict Role Check: Forced logout and redirect if not admin or superadmin
      console.warn("Non-admin role attempting to access admin area. Access Denied.");
      useAuthStore.getState().logout();
      navigate('/admin/login');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return null;
  }

  return children;
}
