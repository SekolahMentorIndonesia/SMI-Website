import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../store/useAuthStore';

// Komponen pelindung halaman User.
// Memastikan user sudah login dan memiliki role 'user'.
export default function UserGuard({ children, requireApproved = false }) {
  const { isAuthenticated, user, token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate('/login');
      return;
    }

    if (user.role !== 'user') {
      console.warn("Non-user role attempting to access user area. Access Denied.");
      useAuthStore.getState().logout();
      navigate('/login');
      return;
    }

    if (requireApproved && user?.status !== 'approved') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, token, user, navigate, requireApproved]);

  if (!isAuthenticated || (requireApproved && user?.status !== 'approved')) {
    return null;
  }

  return children;
}
