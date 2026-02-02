// Base API URL configuration
// Using relative path to allow proxying to work correctly in both dev and prod
export const API_BASE_URL = '/api';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  USER: {
    PROFILE: '/user/me',
    ENROLLMENT: '/user/enrollment',
    PAYMENT: '/user/payment',
    UPLOAD: '/user/upload-photo',
  },
  ADMIN: {
    STATS: '/admin/stats',
    ENROLLMENTS: '/admin/enrollments',
    PAYMENTS: '/admin/payments',
  },
  PRODUCTS: '/products',
  ORDERS: '/orders',
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  // If endpoint is a full URL, return it as is
  if (endpoint.startsWith('http')) return endpoint;
  // If endpoint already starts with /api, return it directly (for backward compatibility)
  if (endpoint.startsWith('/api')) return endpoint;
  // Otherwise, append to API_BASE_URL
  return `${API_BASE_URL}${endpoint}`;
};
