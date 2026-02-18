import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuthStore } from '../../store/useAuthStore';
import { ShieldCheck, Lock, Mail, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/authService';

export function meta() {
  return [
    { title: "Login - Sekolah Mentor Indonesia" },
    { name: "description", content: "Masuk ke akun Sekolah Mentor Indonesia Anda untuk mengakses materi dan mentoring." },
    { name: "robots", content: "noindex, nofollow" }
  ];
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, login } = useAuthStore();

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated && user) {
      if (user.role === 'admin' || user.role === 'superadmin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'user') {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { user, token } = await authService.login(email, password);
      login(user, token);

      if (user.role === 'admin' || user.role === 'superadmin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'user') {
        navigate('/dashboard');
      } else {
        // Force logout if role is undefined or not recognized
        console.error("Unknown role detected during login");
        useAuthStore.getState().logout();
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email atau password salah');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-10 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-y-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/app" className="flex justify-center mb-6 group">
          <img src="/logo.jpeg" alt="SMI Logo" width="48" height="48" className="h-10 sm:h-12 w-auto transition-transform group-hover:scale-110" />
        </Link>
        <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 px-4">
          Masuk ke Dashboard
        </h2>
        <p className="mt-2 text-center text-xs sm:text-sm text-neutral-600 px-4">
          Akses konten eksklusif Sekolah Mentor Indonesia
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-5 sm:px-10 shadow-2xl shadow-neutral-200 rounded-3xl sm:rounded-[2rem] border border-neutral-100 mx-auto max-w-[95vw] sm:max-w-none">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-600/20"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Masuk Sekarang
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-neutral-50 pt-8">
            <p className="text-sm text-neutral-500">
              Belum punya akun?{' '}
              <Link to="/register" className="font-bold text-brand-600 hover:text-brand-500">
                Daftar Gratis
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-center gap-2 text-neutral-400 text-[10px] uppercase font-bold tracking-widest">
          <ShieldCheck className="w-3 h-3" />
          Securely managed by SMI
        </div>
      </div>
    </div>
  );
}
