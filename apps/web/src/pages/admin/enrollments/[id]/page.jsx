import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import AdminLayout from '../../../../layouts/AdminLayout';
import { adminService } from '../../../../services/adminService';
import { ArrowLeft, User, Package, CreditCard, Calendar, CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { useNotification } from '../../../../contexts/NotificationContext';

export default function AdminEnrollmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const { success, error: showError } = useNotification();

  const fetchDetail = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getEnrollmentDetail(id);
      setEnrollment(data);
    } catch (err) {
      setError('Failed to fetch enrollment details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleAction = async (action) => {
    if (!window.confirm(`Are you sure you want to ${action} this enrollment?`)) return;
    
    setIsProcessing(true);
    try {
      if (action === 'approve') {
        await adminService.approveEnrollment(id);
        success(`Enrollment approved successfully! Request ${enrollment.request_id} has been processed.`, 3000);
      } else {
        await adminService.rejectEnrollment(id);
        success(`Enrollment rejected successfully! Request ${enrollment.request_id} has been processed.`, 3000);
      }
      setTimeout(() => navigate('/admin/enrollments'), 1500);
    } catch (err) {
      showError(`Failed to ${action} enrollment. Please try again.`, 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-brand-600" size={40} />
        </div>
      </AdminLayout>
    );
  }

  if (error || !enrollment) {
    return (
      <AdminLayout>
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100">
          {error || 'Enrollment not found'}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <button 
        onClick={() => navigate('/admin/enrollments')}
        className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-8 transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to List
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* User & Package Info */}
          <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm shadow-neutral-200/50">
            <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <User size={20} className="text-brand-600" />
              Customer Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-neutral-400 mb-1">Full Name</p>
                <p className="font-bold text-neutral-900">{enrollment.User?.name}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-400 mb-1">Email Address</p>
                <p className="font-bold text-neutral-900">{enrollment.User?.email}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-400 mb-1">Package Selected</p>
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-brand-500" />
                  <p className="font-bold text-neutral-900">{enrollment.MentorPackage?.name}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-neutral-400 mb-1">Enrolled Date</p>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-brand-500" />
                  <p className="font-bold text-neutral-900">
                    {new Date(enrollment.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Proof */}
          <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm shadow-neutral-200/50">
            <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <CreditCard size={20} className="text-brand-600" />
              Payment Proof
            </h2>
            {enrollment.Payment ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <div>
                    <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-1">Amount Paid</p>
                    <p className="text-2xl font-black text-neutral-900">
                      Rp {parseFloat(enrollment.Payment.amount).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                    enrollment.Payment.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    enrollment.Payment.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100' :
                    'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {enrollment.Payment.status}
                  </div>
                </div>
                <div className="relative group">
                  <img 
                    src={`${import.meta.env.VITE_API_URL}/${enrollment.Payment.proof_image}`} 
                    alt="Payment Proof" 
                    className="w-full rounded-2xl border border-neutral-200 shadow-inner"
                  />
                  <a 
                    href={`${import.meta.env.VITE_API_URL}/${enrollment.Payment.proof_image}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-lg text-neutral-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 text-neutral-500">
                No payment proof uploaded yet.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm shadow-neutral-200/50 sticky top-8">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Current Status</h3>
            <div className={`w-full py-3 text-center rounded-2xl font-bold border mb-8 ${
              enrollment.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
              enrollment.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
              'bg-red-50 text-red-600 border-red-100'
            }`}>
              {enrollment.status.replace('_', ' ')}
            </div>

            {enrollment.status === 'pending' && (
              <div className="space-y-4">
                <button
                  disabled={isProcessing}
                  onClick={() => handleAction('approve')}
                  className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                  Approve Request
                </button>
                <button
                  disabled={isProcessing}
                  onClick={() => handleAction('reject')}
                  className="w-full py-4 bg-white text-red-600 border border-red-200 font-bold rounded-2xl hover:bg-red-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <XCircle size={20} />}
                  Reject Request
                </button>
              </div>
            )}

            {enrollment.status !== 'pending' && (
              <p className="text-sm text-neutral-500 text-center italic">
                This request has already been processed.
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
