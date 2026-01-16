import AdminLayout from '../../../layouts/AdminLayout';
import { Users, Search, Filter } from 'lucide-react';

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">User Management</h1>
          <p className="text-neutral-500">Manage all users in the system</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-neutral-100 text-neutral-700 rounded-2xl hover:bg-neutral-200 transition-colors">
            <Filter size={20} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-500">User ID</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-500">Name</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-500">Email</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-500">Role</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-500">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Placeholder row */}
              <tr className="border-b border-neutral-100">
                <td className="py-4 px-4 text-sm text-neutral-900">1</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                      D
                    </div>
                    <span className="text-sm font-medium text-neutral-900">Dzarel</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-neutral-600">dzarel@gmail.com</td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">admin</span>
                </td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">active</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <button className="p-2 bg-yellow-100 text-yellow-700 rounded-xl hover:bg-yellow-200 transition-colors">
                      Edit
                    </button>
                    <button className="p-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
