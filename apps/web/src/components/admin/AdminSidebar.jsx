import { LayoutDashboard, Users, LogOut, ShieldCheck, Home, User, Settings, CreditCard, FileText } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate, useLocation } from "react-router";

export default function AdminSidebar() {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Base menu items for all admin roles
  const baseMenuItems = [
    { name: "Back to Home", icon: <Home size={20} />, path: "/app" },
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin/dashboard" },
    { name: "Enrollment Requests", icon: <Users size={20} />, path: "/admin/enrollments" },
  ];

  // Additional menu items for superadmin only
  const superadminMenuItems = [
    { name: "User Management", icon: <User size={20} />, path: "/admin/users" },
    { name: "Payment Management", icon: <CreditCard size={20} />, path: "/admin/payments" },
    { name: "System Settings", icon: <Settings size={20} />, path: "/admin/settings" },
  ];

  // Combine menu items based on role
  const menuItems = [...baseMenuItems];
  if (user?.role === 'superadmin') {
    menuItems.push(...superadminMenuItems);
  }

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="w-64 bg-neutral-900 text-white h-full flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-neutral-800">
        <div className="p-2 bg-brand-600 rounded-lg">
          <ShieldCheck size={24} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-sm leading-tight">SMI Admin</h1>
          <p className="text-[10px] text-neutral-400 uppercase tracking-wider">Control Panel</p>
        </div>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
              location.pathname === item.path
                ? "bg-brand-600 text-white shadow-lg shadow-brand-900/20"
                : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
            }`}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-neutral-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-brand-500">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-[10px] text-neutral-500 truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:bg-red-500/10 hover:text-red-500 transition-all text-sm font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
