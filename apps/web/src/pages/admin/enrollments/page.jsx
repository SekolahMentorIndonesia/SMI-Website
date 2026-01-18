import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import AdminLayout from '../../../layouts/AdminLayout';
import { adminService } from '../../../services/adminService';
import { Search, Filter, Eye, Loader2, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useNotification } from '../../../contexts/NotificationContext';

export default function AdminEnrollmentListPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [status, setStatus] = useState('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingEnrollments, setProcessingEnrollments] = useState(new Set());
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();

  const fetchEnrollments = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getEnrollments(status);
      setEnrollments(data);
    } catch (err) {
      setError('Failed to fetch enrollments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [status]);

  const getStatusStyle = (s) => {
    switch (s) {
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'rejected': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-neutral-50 text-neutral-600 border-neutral-100';
    }
  };

  const handleQuickAction = async (enrollmentId, action) => {
    if (processingEnrollments.has(enrollmentId)) return;
    
    setProcessingEnrollments(prev => new Set(prev).add(enrollmentId));
    
    try {
      if (action === 'approve') {
        await adminService.approveEnrollment(enrollmentId);
        success(`Enrollment ${enrollmentId} approved successfully!`, 3000);
      } else {
        await adminService.rejectEnrollment(enrollmentId);
        success(`Enrollment ${enrollmentId} rejected successfully!`, 3000);
      }
      await fetchEnrollments(); // Refresh data
    } catch (error) {
      showError(`Failed to ${action} enrollment: ${error.message}`, 5000);
    } finally {
      setProcessingEnrollments(prev => {
        const newSet = new Set(prev);
        newSet.delete(enrollmentId);
        return newSet;
      });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Enrollment Requests</h1>
        <p className="text-neutral-500">Manage student package registrations</p>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm shadow-neutral-200/50 overflow-hidden">
        {/* Filters */}
        <div className="p-6 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-neutral-400" />
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Package</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-brand-600" size={32} />
                  </td>
                </tr>
              ) : enrollments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-neutral-500">
                    No enrollments found for this status.
                  </td>
                </tr>
              ) : (
                enrollments.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-neutral-900">{item.User?.name}</p>
                        <p className="text-xs text-neutral-500">{item.User?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-neutral-700">{item.MentorPackage?.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {item.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleQuickAction(item.id, 'approve')}
                              disabled={processingEnrollments.has(item.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm disabled:opacity-50"
                            >
                              {processingEnrollments.has(item.id) ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle size={14} />}
                              Approve
                            </button>
                            <button 
                              onClick={() => handleQuickAction(item.id, 'reject')}
                              disabled={processingEnrollments.has(item.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm disabled:opacity-50"
                            >
                              {processingEnrollments.has(item.id) ? <Loader2 className="animate-spin" size={14} /> : <XCircle size={14} />}
                              Reject
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => navigate(`/admin/enrollments/${item.id}`)}
                          className="p-2 hover:bg-brand-50 text-neutral-400 hover:text-brand-600 rounded-lg transition-all"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Placeholder */}
        <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
          <p className="text-sm text-neutral-500">Showing {enrollments.length} results</p>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-neutral-200 bg-white text-neutral-400 disabled:opacity-50 cursor-not-allowed" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="p-2 rounded-lg border border-neutral-200 bg-white text-neutral-400 disabled:opacity-50 cursor-not-allowed" disabled>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
