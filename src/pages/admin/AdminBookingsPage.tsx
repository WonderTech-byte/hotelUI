import { useState } from 'react';
import { Search } from 'lucide-react';
import { useGetAllBookingsQuery } from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import { BookingStatusBadge, LoadingSpinner } from '../../components/shared';
import type { BookingStatus } from '../../types';

export default function AdminBookingsPage() {
  const { data: bookings = [], isLoading } = useGetAllBookingsQuery();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'ALL'>('ALL');

  const filtered = bookings.filter((b) => {
    const matchStatus = filterStatus === 'ALL' || b.status === filterStatus;
    const matchSearch = b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      b.guest?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      b.room?.roomNumber?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const statusCounts = {
    ALL: bookings.length,
    CONFIRMED: bookings.filter(b => b.status === 'CONFIRMED').length,
    CHECKED_IN: bookings.filter(b => b.status === 'CHECKED_IN').length,
    CHECKED_OUT: bookings.filter(b => b.status === 'CHECKED_OUT').length,
    CANCELLED: bookings.filter(b => b.status === 'CANCELLED').length,
    NO_SHOW: bookings.filter(b => b.status === 'NO_SHOW').length,
  };

  const tabs: { label: string; value: BookingStatus | 'ALL' }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Checked In', value: 'CHECKED_IN' },
    { label: 'Checked Out', value: 'CHECKED_OUT' },
    { label: 'Cancelled', value: 'CANCELLED' },
    { label: 'No Show', value: 'NO_SHOW' },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-slate-800">Bookings</h2>
        <p className="text-slate-500 text-sm">{bookings.length} total bookings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-5 pb-1">
        {tabs.map(({ label, value }) => (
          <button key={value} onClick={() => setFilterStatus(value)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterStatus === value
                ? 'bg-teal-500 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}>
            {label}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${filterStatus === value ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
              {statusCounts[value]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" placeholder="Search by code, guest, or room..."
          className="input-field pl-10 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {['Booking Code', 'Guest', 'Room', 'Check-In', 'Check-Out', 'Nights', 'Total', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-mono font-semibold text-slate-700 whitespace-nowrap">{b.bookingCode}</td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-slate-800">{b.guest?.fullName}</p>
                        <p className="text-xs text-slate-400">{b.guest?.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 whitespace-nowrap">Rm {b.room?.roomNumber} <span className="text-slate-400">({b.room?.roomType})</span></td>
                    <td className="px-5 py-4 text-slate-600 whitespace-nowrap">{new Date(b.checkInDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-5 py-4 text-slate-600 whitespace-nowrap">{new Date(b.checkOutDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-5 py-4 text-slate-600 text-center">{b.numberOfNights}</td>
                    <td className="px-5 py-4 font-semibold text-teal-600 whitespace-nowrap">${b.totalPrice?.toFixed(2)}</td>
                    <td className="px-5 py-4"><BookingStatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-400 text-sm">No bookings found</div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
