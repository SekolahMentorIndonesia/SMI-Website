import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../store/useAuthStore';
import { paymentService } from '../../services/paymentService';
import PendingScreen from '../../components/dashboard/PendingScreen';
import RejectedScreen from '../../components/dashboard/RejectedScreen';
import SelectPackageScreen from '../../components/dashboard/SelectPackageScreen';
import UserLayout from '../../layouts/UserLayout';
import { 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Video,
  AlertCircle,
  ExternalLink,
  Upload,
  FileText,
  Loader2
} from "lucide-react";
import { useNotification } from '../../contexts/NotificationContext';

export default function UserDashboardPage() {
  const { user, token, updateUser } = useAuthStore();
  const { success, error: showError } = useNotification();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setUploadError("Ukuran file maksimal 5MB");
        return;
      }
      setFile(selectedFile);
      setUploadError("");
    }
  };

  const handleUploadProof = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadError("Silakan pilih file bukti pembayaran");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append('proof_image', file);
      formData.append('enrollment_id', user.enrollment_id || user.Enrollments?.[0]?.id);
      formData.append('amount', 0); 

      await paymentService.uploadProof(formData);

      updateUser({ 
        enrollment_status: 'WAITING_APPROVAL'
      });
      
      success("Bukti pembayaran berhasil diunggah. Mohon tunggu verifikasi admin.", 4000);
    } catch (err) {
      setUploadError(err.response?.data?.message || "Gagal mengunggah bukti pembayaran");
    } finally {
      setIsUploading(false);
    }
  };

  const renderStatusCard = () => {
    // 1. Fresh Register (No Package Selected)
    if (!user?.package && user?.status === 'pending') {
      return <SelectPackageScreen />;
    }

    // 2. Package Selected, No Proof Uploaded
    if (user?.package && user?.enrollment_status === 'PAYMENT_PENDING') {
      return (
        <div className="bg-white border border-neutral-100 rounded-3xl p-8 md:p-12 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="w-10 h-10 text-brand-600" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Upload Bukti Pembayaran</h1>
            <p className="text-neutral-600">
              Paket Terpilih: <span className="font-bold text-brand-600">{user.package}</span>
            </p>
          </div>

          <form onSubmit={handleUploadProof} className="space-y-6">
            <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-8 text-center hover:border-brand-300 transition-colors cursor-pointer relative">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {file ? (
                <div className="flex flex-col items-center">
                  <FileText className="w-12 h-12 text-brand-600 mb-2" />
                  <p className="text-sm font-medium text-neutral-900">{file.name}</p>
                  <p className="text-xs text-neutral-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-neutral-400 mb-2" />
                  <p className="text-sm font-medium text-neutral-900">Klik atau drag file bukti transfer</p>
                  <p className="text-xs text-neutral-500">Format: JPG, PNG, GIF (Maks 5MB)</p>
                </div>
              )}
            </div>

            {uploadError && (
              <p className="text-sm text-red-600 font-medium text-center">{uploadError}</p>
            )}

            <button
              type="submit"
              disabled={isUploading || !file}
              className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-600/20"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Mengunggah...
                </>
              ) : (
                <>
                  Kirim Bukti Pembayaran
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      );
    }

    // 3. Waiting Approval
    if (user?.enrollment_status === 'WAITING_APPROVAL' || (user?.status === 'pending' && user?.package)) {
      return <PendingScreen />;
    }

    // 4. Rejected
    if (user?.status === 'rejected' || user?.enrollment_status === 'REJECTED') {
      return <RejectedScreen onRetry={() => updateUser({ enrollment_status: 'PAYMENT_PENDING' })} />;
    }

    // 5. Approved
    if (user?.status === 'approved') {
      return (
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-neutral-100">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Halo, {user?.name}! 👋</h1>
              <p className="text-neutral-500 font-medium">Selamat datang kembali di dashboard Sekolah Mentor Indonesia.</p>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-bold uppercase tracking-wider text-sm">Akun Aktif</span>
            </div>
          </div>

          {/* Quick Stats/Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 hover:shadow-xl hover:shadow-neutral-500/5 transition-all group">
              <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center mb-4 text-brand-600 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <p className="text-neutral-500 text-sm font-medium mb-1">Paket Aktif</p>
              <h3 className="text-xl font-bold text-neutral-900 uppercase">{user?.package || 'Standard'}</h3>
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 hover:shadow-xl hover:shadow-neutral-500/5 transition-all group">
              <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center mb-4 text-brand-600 group-hover:scale-110 transition-transform">
                <ExternalLink className="w-6 h-6" />
              </div>
              <p className="text-neutral-500 text-sm font-medium mb-1">Komunitas</p>
              <h3 className="text-xl font-bold text-neutral-900">SMI Exclusive</h3>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-neutral-100 hover:shadow-xl hover:shadow-neutral-500/5 transition-all group">
              <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center mb-4 text-brand-600 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <p className="text-neutral-500 text-sm font-medium mb-1">Next Event</p>
              <h3 className="text-xl font-bold text-neutral-900">Mentoring Live</h3>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Content Card */}
            <div className="bg-brand-600 rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Akses Konten Eksklusif</h3>
                <p className="text-brand-100 mb-8 max-w-xs leading-relaxed">
                  Mulai pelajari materi terbaik dari para mentor berpengalaman sekarang juga.
                </p>
                <button className="flex items-center gap-2 px-6 py-3 bg-white text-brand-600 rounded-2xl font-bold hover:bg-brand-50 transition-all">
                  Lihat Materi
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <BookOpen className="absolute -right-8 -bottom-8 w-48 h-48 text-brand-500 opacity-20 group-hover:scale-110 transition-transform duration-500" />
            </div>

            {/* Community Card */}
            <div className="bg-neutral-900 rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Gabung Komunitas</h3>
                <p className="text-neutral-400 mb-8 max-w-xs leading-relaxed">
                  Terhubung dengan ribuan mentor lainnya di grup Discord eksklusif SMI.
                </p>
                <button className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20">
                  Gabung Discord
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              <ExternalLink className="absolute -right-8 -bottom-8 w-48 h-48 text-neutral-800 opacity-40 group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>

          {/* Notifications/Announcements */}
          <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-start gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <AlertCircle size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-amber-900 mb-1">Pengumuman Penting</h4>
              <p className="text-amber-800 text-sm leading-relaxed mb-4">
                Webinar eksklusif "Mentoring Strategis 2024" akan dilaksanakan pada hari Sabtu ini pukul 19.00 WIB. Pastikan Anda sudah mendaftar!
              </p>
              <button className="flex items-center gap-2 text-sm font-bold text-amber-700 hover:text-amber-900 transition-colors">
                Daftar Webinar Sekarang
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <UserLayout>
      <div className="py-4">
        {renderStatusCard()}
      </div>
    </UserLayout>
  );
}
