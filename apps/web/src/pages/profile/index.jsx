import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { User, Mail, Shield, Calendar, Edit2, LogOut, Phone, MessageCircle, Briefcase, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router";
import UserGuard from "../../components/dashboard/UserGuard";
import { userService } from "../../services/userService";

// Halaman profil profesional dengan fitur edit
export default function ProfilePage() {
  const { user, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    telegramUser: user?.telegramUser || '',
    phoneNumber: user?.phoneNumber || '',
    motivation: user?.motivation || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const userData = await userService.getCurrentUser();
      updateUser(userData);
      setSaveMessage('Data profil diperbarui!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Gagal memperbarui profil:', error);
      setSaveMessage('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        telegramUser: user?.telegramUser || '',
        phoneNumber: user?.phoneNumber || '',
        motivation: user?.motivation || ''
      });
      setSaveMessage('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setSaveMessage('');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUser(formData);
      setIsEditing(false);
      setSaveMessage('Profil berhasil diperbarui!');
      
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Gagal memperbarui profil:', error);
      setSaveMessage('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = () => {
    switch (user?.status) {
      case 'approved':
        return {
          color: 'bg-emerald-100 text-emerald-800',
          icon: '✓',
          text: 'Disetujui'
        };
      case 'pending':
        return {
          color: 'bg-amber-100 text-amber-800',
          icon: '⏳',
          text: 'Menunggu Verifikasi'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800',
          icon: '✗',
          text: 'Ditolak'
        };
      case 'menunggu_masuk_komunitas':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: '👥',
          text: 'Menunggu Gabung Komunitas'
        };
      case 'sudah_bergabung':
        return {
          color: 'bg-emerald-100 text-emerald-800',
          icon: '🎉',
          text: 'Sudah Bergabung'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: '?',
          text: 'Tidak Diketahui'
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <UserGuard>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Profil Saya</h1>
              <p className="text-neutral-500 font-medium">Kelola informasi akun dan profil Anda di sini.</p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-neutral-100 overflow-hidden shadow-sm">
            <div className="h-36 bg-gradient-to-r from-brand-600 to-brand-400 relative">
              <div className="absolute -bottom-16 left-8">
                <div className="w-32 h-32 rounded-3xl bg-white p-3 shadow-xl shadow-neutral-500/10">
                  <div className="w-full h-full rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 text-4xl font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </div>
              </div>
              
              <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-semibold ${statusBadge.color}`}>
                {statusBadge.icon} {statusBadge.text}
              </div>
            </div>

            <div className="pt-20 p-8 space-y-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">{user?.name}</h2>
                  <p className="text-neutral-500">{user?.email}</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl font-bold text-sm hover:bg-neutral-50 transition-all shadow-sm hover:shadow-md"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                  <button 
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-6 py-2.5 border border-neutral-200 rounded-xl font-bold text-sm hover:bg-neutral-50 transition-all shadow-sm hover:shadow-md"
                  >
                    <Edit2 className="w-4 h-4" />
                    {isEditing ? 'Batal' : 'Edit Profil'}
                  </button>
                </div>
              </div>

              {saveMessage && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800 text-sm font-medium">
                  {saveMessage}
                </div>
              )}

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-brand-600" />
                      Informasi Dasar
                    </h3>
                    
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">Nama Lengkap</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-3 bg-white border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-3 bg-white border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">Nomor Telepon</label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="w-full p-3 bg-white border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            placeholder="Contoh: 081234567890"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl">
                          <div className="mt-1 flex-shrink-0 w-5 h-5 text-neutral-500">
                            <Mail className="w-full h-full" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-500">Email</p>
                            <p className="font-medium text-neutral-900">{user?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl">
                          <div className="mt-1 flex-shrink-0 w-5 h-5 text-neutral-500">
                            <Phone className="w-full h-full" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-500">Nomor Telepon</p>
                            <p className="font-medium text-neutral-900">{user?.phoneNumber || '-'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl">
                          <div className="mt-1 flex-shrink-0 w-5 h-5 text-neutral-500">
                            <MessageCircle className="w-full h-full" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-500">User Telegram</p>
                            <p className="font-medium text-neutral-900">{user?.telegramUser || '-'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-brand-600" />
                      Informasi Tambahan
                    </h3>
                    
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">User Telegram</label>
                          <input
                            type="text"
                            name="telegramUser"
                            value={formData.telegramUser}
                            onChange={handleInputChange}
                            className="w-full p-3 bg-white border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            placeholder="Contoh: @username"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">Motivasi Menjadi Konten Creator</label>
                          <textarea
                            name="motivation"
                            value={formData.motivation}
                            onChange={handleInputChange}
                            className="w-full p-3 bg-white border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            rows={4}
                            placeholder="Ceritakan alasan Anda ingin menjadi konten creator..."
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl">
                          <div className="mt-1 flex-shrink-0 w-5 h-5 text-neutral-500">
                            <Shield className="w-full h-full" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-500">Role</p>
                            <p className="font-medium text-neutral-900 capitalize">{user?.role}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl">
                          <div className="mt-1 flex-shrink-0 w-5 h-5 text-neutral-500">
                            <Calendar className="w-full h-full" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-500">Status Akun</p>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${user?.status === 'approved' ? 'bg-emerald-500' : user?.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`} />
                              <p className="font-medium text-neutral-900 capitalize">{user?.status}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl">
                          <div className="mt-1 flex-shrink-0 w-5 h-5 text-neutral-500">
                            <Briefcase className="w-full h-full" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-500">Motivasi</p>
                            <p className="font-medium text-neutral-900 text-sm">{user?.motivation || '-'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                  <button
                    onClick={handleEditToggle}
                    className="px-6 py-3 bg-white text-neutral-700 border border-neutral-300 rounded-xl font-bold text-sm hover:bg-neutral-50 transition-all shadow-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-md ${
                      isSaving 
                        ? 'bg-brand-400 text-white cursor-not-allowed' 
                        : 'bg-brand-600 text-white hover:bg-brand-700'
                    }`}
                  >
                    {isSaving ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Menyimpan...
                      </div>
                    ) : (
                      'Simpan Perubahan'
                    )}
                  </button>
                </div>
              )}

              <div className="pt-6 border-t border-neutral-100">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all shadow-sm hover:shadow-md"
                >
                  <LogOut className="w-5 h-5" />
                  Keluar dari Akun
                </button>
              </div>
            </div>
          </div>

          {user?.package && (
            <div className="bg-white rounded-[2rem] border border-neutral-100 overflow-hidden shadow-sm p-8">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Paket Langganan</h3>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-8 h-8 text-brand-600" />
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Paket</p>
                    <p className="text-xl font-bold text-neutral-900 capitalize">{user.package}</p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${user.status === 'approved' || user.status === 'sudah_bergabung' ? 'bg-emerald-100 text-emerald-800' : user.status === 'menunggu_masuk_komunitas' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                  {user.status === 'approved' ? 'Aktif' : user.status === 'sudah_bergabung' ? 'Sudah Bergabung' : user.status === 'menunggu_masuk_komunitas' ? 'Menunggu Gabung Komunitas' : 'Menunggu Verifikasi'}
                </div>
              </div>
              
              {user.status === 'menunggu_masuk_komunitas' && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-neutral-500 mb-3">Langkah Selanjutnya</h4>
                  <a 
                    href="https://t.me/smisekolahmentordonesia/1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-700 transition-all shadow-sm hover:shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Masuk ke Grup Komunitas
                  </a>
                  <p className="mt-2 text-xs text-neutral-500">
                    Setelah bergabung, status akun Anda akan diperbarui oleh admin
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </UserGuard>
  );
}
