import { useAuthStore } from '../store/useAuthStore';

const useUser = () => {
  const { user } = useAuthStore();

  return {
    user,
    data: user || null,
    loading: false,
    refetch: () => {}
  };
};

export { useUser }

export default useUser;