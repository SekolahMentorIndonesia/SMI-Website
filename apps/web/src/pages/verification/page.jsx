import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store/useAuthStore';
import { Mail, Phone, Shield, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { authService } from '@/services/authService';

export default function VerificationPage() {
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Redirect if user is not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSendEmailOTP = async () => {
    if (!user?.email) {
      setMessage('User data tidak tersedia');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await authService.resendEmailVerification(user.email);
      setMessage(`Token verifikasi: ${response.token} (cek konsol untuk testing)`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Gagal mengirim OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      setIsLoading(true);
      const response = await authService.verifyEmail(emailOtp);
      setEmailVerified(true);
      setMessage('Email berhasil diverifikasi!');
      
      if (phoneVerified) {
        navigate('/dashboard');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Gagal verifikasi email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPhoneOTP = async () => {
    if (!user?.phone_number) {
      setMessage('Nomor HP tidak tersedia');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await authService.sendPhoneOTP(user.phone_number);
      setMessage(`OTP: ${response.otp} (cek konsol untuk testing)`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Gagal mengirim OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (!user?.phone_number) {
      setMessage('Nomor HP tidak tersedia');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await authService.verifyPhone(user.phone_number, phoneOtp);
      setPhoneVerified(true);
      setMessage('Nomor HP berhasil diverifikasi!');
      
      if (emailVerified) {
        navigate('/dashboard');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Gagal verifikasi nomor HP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-10 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-y-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 px-4">
          Verifikasi Akun Anda
        </h2>
        <p className="mt-2 text-center text-xs sm:text-sm text-neutral-600 px-4">
          Selesaikan verifikasi untuk mengaktifkan akun
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-5 sm:px-10 shadow-2xl shadow-neutral-200 rounded-3xl sm:rounded-[2rem] border border-neutral-100 mx-auto max-w-[95vw] sm:max-w-none">
          
          {/* Email Verification */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Mail className={`w-5 h-5 ${emailVerified ? 'text-green-600' : 'text-neutral-400'}`} />
              <h3 className="font-bold text-neutral-900">Verifikasi Email</h3>
              {emailVerified && <CheckCircle className="w-5 h-5 text-green-600" />}
            </div>
            
            {!emailVerified ? (
              <div className="space-y-4">
                <p className="text-sm text-neutral-600">{user.email}</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Masukkan token verifikasi"
                  />
                  <button
                    onClick={handleVerifyEmail}
                    disabled={isLoading || !emailOtp}
                    className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verifikasi'}
                  </button>
                </div>
                <button
                  onClick={handleSendEmailOTP}
                  disabled={isLoading}
                  className="text-sm text-brand-600 hover:text-brand-500 font-medium"
                >
                  Kirim ulang token
                </button>
              </div>
            ) : (
              <p className="text-sm text-green-600 font-medium">Email sudah diverifikasi</p>
            )}
          </div>

          {/* Phone Verification */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Phone className={`w-5 h-5 ${phoneVerified ? 'text-green-600' : 'text-neutral-400'}`} />
              <h3 className="font-bold text-neutral-900">Verifikasi Nomor HP</h3>
              {phoneVerified && <CheckCircle className="w-5 h-5 text-green-600" />}
            </div>
            
            {!phoneVerified ? (
              <div className="space-y-4">
                <p className="text-sm text-neutral-600">{user.phone_number}</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value)}
                    className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Masukkan OTP (123456)"
                  />
                  <button
                    onClick={handleVerifyPhone}
                    disabled={isLoading || !phoneOtp}
                    className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verifikasi'}
                  </button>
                </div>
                <button
                  onClick={handleSendPhoneOTP}
                  disabled={isLoading}
                  className="text-sm text-brand-600 hover:text-brand-500 font-medium"
                >
                  Kirim OTP
                </button>
              </div>
            ) : (
              <p className="text-sm text-green-600 font-medium">Nomor HP sudah diverifikasi</p>
            )}
          </div>

          {/* Message */}
          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.includes('berhasil') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {message}
            </div>
          )}

          {/* Success Message */}
          {emailVerified && phoneVerified && (
            <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl">
              <div className="flex items-center gap-2 text-green-600">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Akun Anda sudah aktif!</span>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-3 w-full flex justify-center items-center gap-2 py-3 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Lanjut ke Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
