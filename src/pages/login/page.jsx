import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function LoginRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect ke halaman utama atau pembayaran
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p>Redirecting...</p>
      </div>
    </div>
  );
}
