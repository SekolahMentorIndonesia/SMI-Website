
import { Outlet } from 'react-router';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';
import SMIHomeFooter from '../../components/SMIHomeFooter';

export default function LibraryLayout() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar variant="smi" />
        <main className="pt-20">
          <Outlet />
        </main>
        <SMIHomeFooter />
      </div>
    </ProtectedRoute>
  );
}
