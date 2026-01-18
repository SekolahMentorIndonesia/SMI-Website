import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    return response.data;
  },

  register: async (name, email, password, phone_number) => {
    const response = await axios.post(`${API_URL}/api/auth/register`, {
      name,
      email,
      password,
      phone_number
    });
    return response.data;
  },

  verifyPhone: async (phone_number, otp) => {
    const response = await axios.post(`${API_URL}/api/auth/verify-phone`, { phone_number, otp });
    return response.data;
  },

  sendPhoneOTP: async (phone_number) => {
    const response = await axios.post(`${API_URL}/api/auth/send-phone-otp`, { phone_number });
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await axios.get(`${API_URL}/api/auth/verify-email/${token}`);
    return response.data;
  },

  resendEmailVerification: async (email) => {
    const response = await axios.post(`${API_URL}/api/auth/resend-email-verification`, { email });
    return response.data;
  }
};
