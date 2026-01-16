import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAuthHeader = () => {
  const token = useAuthStore.getState().token;
  return { Authorization: `Bearer ${token}` };
};

export const userService = {
  getCurrentUser: async () => {
    const response = await axios.get(`${API_URL}/api/user/me`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  updateProfile: async (payload) => {
    const response = await axios.put(`${API_URL}/api/user/me`, payload, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};
