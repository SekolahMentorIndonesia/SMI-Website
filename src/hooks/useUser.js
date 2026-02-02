
import { useNavigate } from 'react-router';

// Mock user data
const MOCK_USER = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'superadmin', // Default to superadmin for full access
  avatar: null
};

export const useUser = () => {
  const navigate = useNavigate();

  const logout = () => {
    // Navigate to home on logout
    navigate('/');
  };

  return {
    user: MOCK_USER,
    isAuthenticated: true,
    logout,
    data: MOCK_USER,
    loading: false,
    refetch: () => {}
  };
};

export default useUser;
