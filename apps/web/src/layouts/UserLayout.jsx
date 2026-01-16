import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { userService } from "../services/userService";

// Layout utama untuk halaman User.
// Termasuk pengecekan status user terbaru dan redirect dari dashboard.
export default function UserLayout({ children }) {
  const { token, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserStatus = async () => {
      try {
        const userData = await userService.getCurrentUser();
        
        // Security check: Force logout if role mismatch (spec requirement)
        if (userData.role !== 'user') {
          console.error("Role mismatch detected. Forcing logout.");
          logout();
          navigate("/login");
          return;
        }

        updateUser(userData);
        
        // Redirect user from dashboard to profile
        if (window.location.pathname.startsWith('/dashboard')) {
          navigate('/profile');
        }
      } catch (error) {
        console.error("Failed to fetch user status", error);
        if (error.response?.status === 401) {
          logout();
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStatus();
  }, [token, navigate, logout, updateUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
          <p className="text-sm font-medium text-neutral-500">Memuat profile...</p>
        </div>
      </div>
    );
  }

  // User should not access dashboard, redirect to profile
  if (window.location.pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
