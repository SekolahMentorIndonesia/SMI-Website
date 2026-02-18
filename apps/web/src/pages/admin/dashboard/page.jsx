import { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { adminService } from '../../../services/adminService';
import { Users, Clock, CheckCircle2, XCircle, Loader2, RefreshCcw, UsersRound, Wallet, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export function meta() {
  return [
    { title: "Admin Dashboard - Sekolah Mentor Indonesia" },
    { name: "description", content: "Pusat kontrol dan statistik admin Sekolah Mentor Indonesia." },
    { name: "robots", content: "noindex, nofollow" }
  ];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const statsData = await adminService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching stats:', err.response || err);
      setError(`Failed to fetch statistics: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Format currency IDR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const statCards = [
    { label: 'Total Enrollments', value: stats?.total || 0, icon: <Users className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Pending Approvals', value: stats?.pending || 0, icon: <Clock className="text-amber-600" />, bg: 'bg-amber-50' },
    { label: 'Approved', value: stats?.approved || 0, icon: <CheckCircle2 className="text-emerald-600" />, bg: 'bg-emerald-50' },
    { label: 'Rejected', value: stats?.rejected || 0, icon: <XCircle className="text-red-600" />, bg: 'bg-red-50' },
    { label: 'Total Admins', value: stats?.adminsCount || 0, icon: <UsersRound className="text-purple-600" />, bg: 'bg-purple-50' },
    { label: 'Total Revenue', value: formatCurrency(stats?.totalRevenue || 0), icon: <Wallet className="text-green-600" />, bg: 'bg-green-50' },
  ];

  // Chart data for enrollment stats
  const chartData = [
    { label: 'Total', value: stats?.total || 0, color: 'bg-blue-500' },
    { label: 'Pending', value: stats?.pending || 0, color: 'bg-amber-500' },
    { label: 'Approved', value: stats?.approved || 0, color: 'bg-emerald-500' },
    { label: 'Rejected', value: stats?.rejected || 0, color: 'bg-red-500' },
  ];

  // Calculate max value for chart scaling
  const maxChartValue = Math.max(...chartData.map(item => item.value), 1);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard Overview</h1>
          <p className="text-neutral-500">Real-time statistics of Sekolah Mentor Indonesia</p>
        </div>
        <button 
          onClick={fetchStats}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-500"
          title="Refresh Data"
        >
          <RefreshCcw size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {isLoading && !stats ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-brand-600" size={40} />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100">
          {error}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm shadow-neutral-200/50 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center mb-4`}>
                  {card.icon}
                </div>
                <p className="text-sm font-medium text-neutral-500 mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-neutral-900">{card.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Chart Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm shadow-neutral-200/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-neutral-900">Enrollment Statistics</h2>
              <BarChart3 className="text-neutral-400" size={24} />
            </div>
            
            <div className="space-y-6">
              {/* Chart Bars */}
              <div className="space-y-4">
                {chartData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-neutral-700">{item.label}</span>
                      <span className="text-neutral-500">{item.value}</span>
                    </div>
                    <div className="h-8 w-full bg-neutral-100 rounded-xl overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.value / maxChartValue) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full ${item.color} rounded-xl`}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
