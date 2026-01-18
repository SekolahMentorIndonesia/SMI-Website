import { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { CreditCard, Search, Filter, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { adminService } from '../../../services/adminService';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      // Get all enrollments with payments
      const enrollments = await adminService.getEnrollments();
      const paymentData = enrollments
        .filter(enrollment => enrollment.Payment)
        .map(enrollment => ({
          id: enrollment.Payment.id,
          user: enrollment.User,
          package: enrollment.MentorPackage,
          amount: enrollment.Payment.amount,
          status: enrollment.Payment.status,
          proof_image: enrollment.Payment.proof_image,
          created_at: enrollment.Payment.created_at,
          enrollment_id: enrollment.id
        }));
      setPayments(paymentData);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => 
    payment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.id.toString().includes(searchTerm)
  );

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      VERIFIED: 'bg-green-100 text-green-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800'
    };
    const icons = {
      PENDING: <Clock size={12} />,
      VERIFIED: <CheckCircle size={12} />,
      APPROVED: <CheckCircle size={12} />,
      REJECTED: <XCircle size={12} />,
      CANCELLED: <XCircle size={12} />
    };
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {icons[status]}
        {status || 'UNKNOWN'}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Payment Management</h1>
          <p className="text-neutral-500">Manage all payments in the system ({payments.length} total)</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search payments by ID, user name, or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-neutral-100 text-neutral-700 rounded-2xl hover:bg-neutral-200 transition-colors">
            <Filter size={20} />
            Filter
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-500">Payment ID</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-500">User</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-500">Package</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-500">Amount</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-500">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-500">Date</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-4 px-4 text-sm text-neutral-900">#{payment.id}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                          {payment.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-neutral-900">{payment.user.name}</div>
                          <div className="text-xs text-neutral-500">{payment.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-neutral-600">{payment.package.name}</td>
                    <td className="py-4 px-4 text-sm font-medium text-neutral-900">{formatCurrency(payment.amount)}</td>
                    <td className="py-4 px-4">{getStatusBadge(payment.status)}</td>
                    <td className="py-4 px-4 text-sm text-neutral-600">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors text-sm">
                          <Eye size={16} />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-neutral-500">
                      No payments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
