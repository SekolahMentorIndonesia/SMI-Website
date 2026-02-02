import AdminSidebar from "../components/admin/AdminSidebar";
import AdminGuard from "../components/admin/AdminGuard";

// Layout utama untuk halaman Admin.
// Termasuk sidebar navigasi dan guard protection.
export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <div className="flex h-screen bg-neutral-50 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
