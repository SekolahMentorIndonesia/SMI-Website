import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Global state untuk manajemen autentikasi user.
// Menyimpan data user, token, dan status login.
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (userData, token) => {
        // Only allow login with valid user data and token
        if (!userData || !token) {
          console.error('Login failed: Missing user data or token');
          return;
        }
        set({ 
          user: userData,
          token: token,
          isAuthenticated: true 
        });
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('auth-storage');
      },

      isAdmin: () => {
        const state = useAuthStore.getState();
        const role = state.user?.role?.toLowerCase();
        return state.user && (role === 'admin' || role === 'superadmin' || role === 'owner');
      },

      isSuperAdmin: () => {
        const state = useAuthStore.getState();
        const role = state.user?.role?.toLowerCase();
        return state.user && (role === 'superadmin' || role === 'owner');
      },

      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      }))
    }),
    {
      name: 'auth-storage',
    }
  )
);
