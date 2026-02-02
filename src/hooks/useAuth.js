
import { useAuthContext } from '../contexts/AuthContext';

function useAuth() {
  const { user, loading, error, login, register, logout } = useAuthContext();

  // Adapter to match existing interface expected by components
  const signInWithCredentials = async ({ email, password }) => {
    return login(email, password);
  };

  const signUpWithCredentials = async (userData) => {
    return register(userData);
  };

  const signOut = async () => {
    logout();
    return { ok: true };
  };

  // Keep mocked social auth for now as requested to focus on core auth first
  const signInWithGoogle = async (options) => {
    console.log('signInWithGoogle mocked', options);
    return Promise.resolve({ ok: true });
  };

  const signInWithFacebook = async (options) => {
    console.log('signInWithFacebook mocked', options);
    return Promise.resolve({ ok: true });
  };

  const signInWithTwitter = async (options) => {
    console.log('signInWithTwitter mocked', options);
    return Promise.resolve({ ok: true });
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading: loading,
    error,
    signInWithCredentials,
    signUpWithCredentials,
    signOut,
    signInWithGoogle,
    signInWithFacebook,
    signInWithTwitter,
  };
}

export default useAuth;
