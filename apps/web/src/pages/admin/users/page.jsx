import { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Users, Search, Filter, Edit2, Trash2, Shield, UserCheck, UserX, Loader2 } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { useNotification } from '../../../contexts/NotificationContext';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingUsers, setProcessingUsers] = useState(new Set());
  const { success, error: showError } = useNotification();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersData = await adminService.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    const styles = {
      superadmin: 'bg-purple-100 text-purple-800',
      admin: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[role] || styles.user}`}>
        {role?.toUpperCase() || 'USER'}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-800',
      PENDING_VERIFICATION: 'bg-yellow-100 text-yellow-800',
      SUSPENDED: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status || 'UNKNOWN'}
      </span>
    );
  };

  const handleUpdateUserStatus = async (userId, newStatus) => {
    if (processingUsers.has(userId)) return;
    
    setProcessingUsers(prev => new Set(prev).add(userId));
    
    try {
      await adminService.updateUserStatus(userId, { status: newStatus });
      await fetchUsers(); // Refresh data
      success(`User status updated to ${newStatus} successfully`, 3000);
    } catch (error) {
      showError(`Failed to update user status: ${error.message}`, 5000);
    } finally {
      setProcessingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">User Management</h1>
          <p className="text-neutral-500">Manage all users in the system ({users.length} total)</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
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
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-500">ID</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-500">Name</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-500">Email</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-500">Phone</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-500">Role</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-500">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-4 px-4 text-sm text-neutral-900">{user.id}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-neutral-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-neutral-600">{user.email}</td>
                    <td className="py-4 px-4 text-sm text-neutral-600">{user.phone_number || '-'}</td>
                    <td className="py-4 px-4">{getRoleBadge(user.role)}</td>
                    <td className="py-4 px-4">{getStatusBadge(user.account_status)}</td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        {user.account_status === 'PENDING_VERIFICATION' && (
                          <>
                            <button 
                              onClick={() => handleUpdateUserStatus(user.id, 'ACTIVE')}
                              disabled={processingUsers.has(user.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors text-sm disabled:opacity-50"
                            >
                              {processingUsers.has(user.id) ? <Loader2 className="animate-spin" size={14} /> : <UserCheck size={14} />}
                              Approve
                            </button>
                            <button 
                              onClick={() => handleUpdateUserStatus(user.id, 'SUSPENDED')}
                              disabled={processingUsers.has(user.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors text-sm disabled:opacity-50"
                            >
                              {processingUsers.has(user.id) ? <Loader2 className="animate-spin" size={14} /> : <UserX size={14} />}
                              Reject
                            </button>
                          </>
                        )}
                        <button className="p-2 bg-yellow-100 text-yellow-700 rounded-xl hover:bg-yellow-200 transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-neutral-500">
                      No users found
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
