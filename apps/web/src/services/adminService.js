import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Service untuk menangani semua request API terkait Admin.
// Termasuk stats dashboard, management enrollment, dan payments.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAuthHeader = () => {
  const token = useAuthStore.getState().token;
  return { Authorization: `Bearer ${token}` };
};

export const adminService = {
  // Stats for dashboard
  getStats: async () => {
    const response = await axios.get(`${API_URL}/api/admin/stats`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Enrollment list
  getEnrollments: async (status = '') => {
    const url = status 
      ? `${API_URL}/api/admin/enrollments?status=${status}` 
      : `${API_URL}/api/admin/enrollments`;
    const response = await axios.get(url, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Enrollment detail
  getEnrollmentDetail: async (id) => {
    const response = await axios.get(`${API_URL}/api/admin/enrollments/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Payment detail (via payment endpoint as per backend requirement)
  getPaymentDetails: async (id) => {
    const response = await axios.get(`${API_URL}/api/admin/payments/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Actions
  approveEnrollment: async (id) => {
    const response = await axios.post(`${API_URL}/api/admin/enrollments/${id}/approve`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  rejectEnrollment: async (id) => {
    const response = await axios.post(`${API_URL}/api/admin/enrollments/${id}/reject`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Login
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    return response.data;
  },

  // Get all users
  getUsers: async () => {
    const response = await axios.get(`${API_URL}/api/admin/users`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Update user status
  updateUserStatus: async (userId, statusData) => {
    const response = await axios.put(`${API_URL}/api/admin/users/${userId}/status`, statusData, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};
