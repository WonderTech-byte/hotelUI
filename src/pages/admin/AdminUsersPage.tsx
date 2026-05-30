import { useState } from 'react';
import { Search, UserCheck, UserX, Shield, MonitorSmartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useGetAllUsersQuery, useActivateUserMutation, useDeactivateUserMutation,
  usePromoteToAdminMutation, usePromoteToFrontDeskMutation
} from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import { LoadingSpinner } from '../../components/shared';
import type { UserType } from '../../types';

export default function AdminUsersPage() {
  const { data: users = [], isLoading } = useGetAllUsersQuery();
  const [activateUser] = useActivateUserMutation();
  const [deactivateUser] = useDeactivateUserMutation();
  const [promoteAdmin] = usePromoteToAdminMutation();
  const [promoteFrontDesk] = usePromoteToFrontDeskMutation();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<UserType | 'ALL'>('ALL');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const filtered = users.filter((u) => {
    const matchType = filterType === 'ALL' || u.userType === filterType;
    const matchSearch = u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const withLoad = async (id: number, fn: () => Promise<any>, msg: string) => {
    setActionLoading(id);
    try { await fn(); toast.success(msg); }
    catch (err: any) { toast.error(err?.data?.message || 'Failed'); }
    finally { setActionLoading(null); }
  };

  const roleColors: Record<UserType, string> = {
    ADMIN: 'bg-violet-100 text-violet-700',
    FRONT_DESK: 'bg-blue-100 text-blue-700',
    GUEST: 'bg-slate-100 text-slate-600',
  };

  const tabs: { label: string; value: UserType | 'ALL' }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Guests', value: 'GUEST' },
    { label: 'Front Desk', value: 'FRONT_DESK' },
    { label: 'Admins', value: 'ADMIN' },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-slate-800">Users</h2>
        <p className="text-slate-500 text-sm">{users.length} total users</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search users..." className="input-field pl-10 text-sm"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {tabs.map(({ label, value }) => (
            <button key={value} onClick={() => setFilterType(value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterType === value ? 'bg-teal-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {['User', 'Username', 'Phone', 'Role', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-sm flex-shrink-0">
                          {user.fullName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{user.fullName}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 font-mono text-xs">{user.username}</td>
                    <td className="px-5 py-4 text-slate-500 text-xs">{user.phoneNumber || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleColors[user.userType]}`}>
                        {user.userType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {actionLoading === user.id ? (
                          <div className="w-4 h-4 border-2 border-teal-300 border-t-teal-500 rounded-full animate-spin" />
                        ) : (
                          <>
                            {user.isActive ? (
                              <button onClick={() => withLoad(user.id, () => deactivateUser(user.id).unwrap(), 'User deactivated')}
                                title="Deactivate" className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <UserX size={15} />
                              </button>
                            ) : (
                              <button onClick={() => withLoad(user.id, () => activateUser(user.id).unwrap(), 'User activated')}
                                title="Activate" className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors">
                                <UserCheck size={15} />
                              </button>
                            )}
                            {user.userType === 'GUEST' && (
                              <button onClick={() => withLoad(user.id, () => promoteFrontDesk(user.id).unwrap(), 'Promoted to Front Desk')}
                                title="Promote to Front Desk" className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                <MonitorSmartphone size={15} />
                              </button>
                            )}
                            {user.userType !== 'ADMIN' && (
                              <button onClick={() => withLoad(user.id, () => promoteAdmin(user.id).unwrap(), 'Promoted to Admin')}
                                title="Promote to Admin" className="p-1.5 text-slate-400 hover:text-violet-500 hover:bg-violet-50 rounded-lg transition-colors">
                                <Shield size={15} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-400 text-sm">No users found</div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
