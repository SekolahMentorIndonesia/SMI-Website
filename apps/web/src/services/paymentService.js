import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeader = () => {
  const token = useAuthStore.getState().token;
  return { 
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  };
};

export const paymentService = {
  uploadProof: async (formData) => {
    const response = await axios.post(`${API_URL}/api/user/payment/upload`, formData, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};
