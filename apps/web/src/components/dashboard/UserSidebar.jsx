import { LayoutDashboard, BookOpen, Users, Calendar, User, LogOut, ChevronRight, Lock } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate, useLocation } from "react-router";

export default function UserSidebar({ status }) {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isApproved = status === 'approved';

  const menuItems = [
    { 
      name: "Dashboard", 
      icon: <LayoutDashboard size={20} />, 
      path: "/dashboard",
      disabled: false 
    },
    { 
      name: "Konten Saya", 
      icon: <BookOpen size={20} />, 
      path: "/dashboard/content",
      disabled: !isApproved 
    },
    { 
      name: "Komunitas", 
      icon: <Users size={20} />, 
      path: "/dashboard/community",
      disabled: !isApproved 
    },
    { 
      name: "Event / Zoom", 
      icon: <Calendar size={20} />, 
      path: "/dashboard/events",
      disabled: !isApproved 
    },
    { 
      name: "Profil", 
      icon: <User size={20} />, 
      path: "/dashboard/profile",
      disabled: false 
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-white border-r border-neutral-100 min-h-screen flex flex-col sticky top-0">
      <div className="p-8 flex items-center gap-3">
        <img src="/logo.jpeg" alt="Logo Sekolah Mentor Indonesia - Platform Mentoring Content Creator" className="h-8 w-auto" />
        <span className="font-bold text-neutral-900">SMI Dashboard</span>
      </div>

      <div className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              disabled={item.disabled}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm font-medium group ${
                isActive
                  ? "bg-brand-50 text-brand-600"
                  : item.disabled
                  ? "text-neutral-300 cursor-not-allowed"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {item.name}
              </div>
              {item.disabled ? (
                <Lock size={14} className="text-neutral-300" />
              ) : (
                <ChevronRight 
                  size={14} 
                  className={`transition-transform duration-300 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} 
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="p-6 border-t border-neutral-50">
        <div className="flex items-center gap-3 px-2 py-3 mb-4 bg-neutral-50 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-neutral-900 truncate">{user?.name}</p>
            <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-all text-sm font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
