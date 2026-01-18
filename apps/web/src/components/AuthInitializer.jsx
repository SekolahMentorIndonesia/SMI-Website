import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

// Auth state initializer component
export default function AuthInitializer({ children }) {
  const { isAuthenticated, user, token } = useAuthStore();

  useEffect(() => {
    // Check if auth state exists in localStorage on app load
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        // Validate that we have required auth data
        if (!parsed.state?.user || !parsed.state?.token) {
          console.warn('Invalid auth state found, clearing...');
          localStorage.removeItem('auth-storage');
        }
      } catch (error) {
        console.error('Error parsing auth storage:', error);
        localStorage.removeItem('auth-storage');
      }
    }
  }, []);

  return children;
}
