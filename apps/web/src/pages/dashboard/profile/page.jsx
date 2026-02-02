import { useState } from "react";
import UserLayout from "../../../layouts/UserLayout";
import UserGuard from "../../../components/dashboard/UserGuard";
import { useAuthStore } from "../../../store/useAuthStore";
import { User, Mail, Shield, Calendar, Edit2, LogOut, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { userService } from "../../../services/userService";

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setMessage("Nama tidak boleh kosong.");
      return;
    }

    try {
      setIsSaving(true);
      setMessage("");

      const payload = { name: name.trim() };
      const result = await userService.updateProfile(payload);

      if (result?.user) {
        updateUser(result.user);
      } else {
        updateUser({ name: name.trim() });
      }

      setIsEditing(false);
      setMessage("Profil berhasil diperbarui.");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Gagal memperbarui profil:", error);
      setMessage("Terjadi kesalahan saat menyimpan profil.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <UserGuard>
      <UserLayout>
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Profil Saya</h1>
            <p className="text-neutral-500 font-medium">Kelola informasi akun Anda di sini.</p>
          </div>

          <div className="bg-white rounded-[2rem] border border-neutral-100 overflow-hidden shadow-sm">
            {/* Profile Header */}
            <div className="h-32 bg-gradient-to-r from-brand-600 to-brand-400 relative">
              <div className="absolute -bottom-12 left-8">
                <div className="w-24 h-24 rounded-3xl bg-white p-2 shadow-xl shadow-neutral-500/10">
                  <div className="w-full h-full rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 text-3xl font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-16 p-8 space-y-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">
                    {isEditing ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-neutral-300 rounded-lg px-3 py-1.5 text-base w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                      />
                    ) : (
                      user?.name
                    )}
                  </h2>
                  <p className="text-neutral-500">{user?.email}</p>
                </div>
                <div className="flex flex-col items-stretch gap-2">
                  {isEditing ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 border border-transparent bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                        Simpan
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setName(user?.name || "");
                          setMessage("");
                        }}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 border border-neutral-200 rounded-xl font-bold text-sm hover:bg-neutral-50 transition-all disabled:opacity-50"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setName(user?.name || "");
                      }}
                      className="flex items-center gap-2 px-6 py-2.5 border border-neutral-200 rounded-xl font-bold text-sm hover:bg-neutral-50 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profil
                    </button>
                  )}
                  {message && (
                    <p className="text-xs text-neutral-500">
                      {message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-50">
                <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-neutral-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Role</p>
                    <p className="font-bold text-neutral-900 uppercase">{user?.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-neutral-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Status Akun</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user?.status === 'approved' ? 'bg-emerald-500' : user?.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`} />
                      <p className="font-bold text-neutral-900 uppercase">{user?.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate("/app")}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-neutral-50 text-neutral-700 rounded-2xl font-bold hover:bg-neutral-100 transition-all"
                >
                  Kembali ke Home
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Keluar dari Akun
                </button>
              </div>
            </div>
          </div>
        </div>
      </UserLayout>
    </UserGuard>
  );
}
