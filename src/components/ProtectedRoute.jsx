
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuthContext } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return children;
};
