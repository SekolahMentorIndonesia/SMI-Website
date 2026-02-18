import { useState, useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { User, Mail, Shield, Calendar, Edit2, LogOut, Loader2, Phone, MessageCircle, Camera, X, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";
import UserGuard from "../../components/dashboard/UserGuard";
import { userService } from "../../services/userService";
import { uploadFile } from "../../utils/upload";

// Halaman profil lengkap untuk user dengan edit & readonly fields
export function meta() {
  return [
    { title: "Profil Saya - Sekolah Mentor Indonesia" },
    { name: "description", content: "Halaman profil pengguna Sekolah Mentor Indonesia." },
    { name: "robots", content: "noindex, nofollow" }
  ];
}

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || "");
  const [telegramUsername, setTelegramUsername] = useState(user?.telegram_user || "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePhotoUpload = async (file) => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      const photoUrl = await uploadFile(file);
      
      // Update user profile with new photo URL
      const result = await userService.updateProfile({ photo_url: photoUrl });
      
      if (result?.user) {
        updateUser(result.user);
        setMessage("Foto profil berhasil diperbarui");
      }
    } catch (error) {
      console.error("Gagal mengunggah foto:", error);
      setMessage("Gagal mengunggah foto. Silakan coba lagi.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setMessage("Nama tidak boleh kosong.");
      return;
    }

    try {
      setIsSaving(true);
      setMessage("");

      const payload = { 
        name: name.trim(),
        telegram_user: telegramUsername.trim()
      };
      
      // Include email if changed
      if (email !== user?.email) {
        payload.email = email.trim();
      }
      
      const result = await userService.updateProfile(payload);

      if (result?.user) {
        updateUser(result.user);
      } else {
        updateUser({ 
          ...user,
          name: name.trim(),
          email: email.trim(),
          email_verified: email !== user?.email ? false : user?.email_verified,
          telegram_user: telegramUsername.trim()
        });
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
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-6 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Profil Saya</h1>
                  <p className="text-brand-100">Kelola informasi profil Anda</p>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profil
                  </button>
                ) : (
                  <div className="flex gap-2 mt-4 sm:mt-0">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        // Reset form values
                        setName(user?.name || "");
                        setEmail(user?.email || "");
                        setPhoneNumber(user?.phone_number || "");
                        setTelegramUsername(user?.telegram_user || "");
                        setMessage("");
                      }}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 bg-white text-brand-600 hover:bg-white/90 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Menyimpan...
                        </>
                      ) : 'Simpan Perubahan'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              {message && (
                <div className={`p-4 rounded-xl mb-6 ${
                  message.includes('berhasil') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {message}
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column - Profile Picture */}
                <div className="w-full md:w-1/3 flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-600 overflow-hidden">
                      {user?.photo_url ? (
                        <img 
                          src={user.photo_url} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      disabled={isUploading}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-brand-600 hover:bg-brand-50 transition-colors"
                      title="Unggah foto profil"
                    >
                      {isUploading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Camera className="w-5 h-5" />
                      )}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Right Column - Profile Info */}
                <div className="flex-1">
                  <div className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-600">Nama Lengkap</label>
                      <div className="mt-1">
                        {isEditing ? (
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            placeholder="Nama lengkap"
                          />
                        ) : (
                          <p className="text-lg font-medium text-neutral-900">{user?.name}</p>
                        )}
                      </div>
                    </div>

                    {/* Email Field (Editable) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-neutral-600">Email</label>
                        <div className="flex items-center gap-2">
                          {user?.email_verified ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-xs font-medium">Terverifikasi</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-yellow-600">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-xs font-medium">Belum Diverifikasi</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-1">
                        {isEditing ? (
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            placeholder="email@example.com"
                          />
                        ) : (
                          <p className="text-base text-neutral-700">{user?.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Phone Number Field - Readonly */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-neutral-600">Nomor Telepon</label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500">Tidak dapat diubah</span>
                          {user?.phone_verified ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-xs font-medium">Terverifikasi</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-yellow-600">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-xs font-medium">Belum Diverifikasi</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-1">
                        <div className="w-full px-4 py-2 bg-neutral-50 rounded-lg border border-neutral-200 text-neutral-700">
                          {user?.phone_number || 'Belum diisi'}
                        </div>
                        <p className="mt-1 text-xs text-neutral-500">
                          Hubungi admin untuk mengubah nomor telepon
                        </p>
                      </div>
                    </div>

                    {/* Telegram Username Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-600">Username Telegram</label>
                      <div className="mt-1">
                        {isEditing ? (
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-3 py-2 rounded-l-lg border border-r-0 border-neutral-300 bg-neutral-50 text-neutral-500 text-sm">
                              @
                            </span>
                            <input
                              type="text"
                              value={telegramUsername}
                              onChange={(e) => setTelegramUsername(e.target.value)}
                              className="flex-1 px-4 py-2 border border-neutral-300 rounded-r-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                              placeholder="username"
                            />
                          </div>
                        ) : (
                          <p className="text-base text-neutral-700">
                            {user?.telegram_username ? `@${user.telegram_username}` : 'Belum diisi'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Account Status */}
                    <div className="pt-4 border-t border-neutral-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-neutral-600">Status Akun</p>
                          <p className="text-sm text-neutral-500">Verifikasi status akun Anda</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user?.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : user?.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user?.status === 'active' ? 'Aktif' : user?.status === 'pending' ? 'Menunggu Verifikasi' : 'Tidak Aktif'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6 flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => navigate('/app')}
                        className="px-4 py-2.5 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors font-medium"
                      >
                        Kembali ke Beranda
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserGuard>
  );
}
