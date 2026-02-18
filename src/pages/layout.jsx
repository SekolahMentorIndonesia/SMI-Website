
import { useLocation } from 'react-router';
import Navbar from '../components/Navbar';
import SMIHomeFooter from '../components/SMIHomeFooter';

export default function SMILayout({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isLogin = location.pathname === '/login';

  if (isAdmin || isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="smi" />
      <main className="pt-20">
        {children}
      </main>
      <SMIHomeFooter />
    </div>
  );
}
