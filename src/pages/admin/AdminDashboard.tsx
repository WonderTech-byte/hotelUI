import { useMemo } from 'react';
import { BedDouble, CalendarCheck, Users, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useGetAllRoomsQuery, useGetAllBookingsQuery, useGetAllUsersQuery } from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import { BookingStatusBadge, LoadingSpinner } from '../../components/shared';

const COLORS = ['#14b8a6', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6'];

export default function AdminDashboard() {
  const { data: rooms = [] } = useGetAllRoomsQuery();
  const { data: bookings = [], isLoading } = useGetAllBookingsQuery();
  const { data: users = [] } = useGetAllUsersQuery();

  const stats = useMemo(() => {
    const totalRevenue = bookings
      .filter(b => ['CHECKED_OUT', 'CHECKED_IN'].includes(b.status))
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const available = rooms.filter(r => r.status === 'AVAILABLE').length;
    const occupied = rooms.filter(r => r.status === 'OCCUPIED').length;
    const confirmed = bookings.filter(b => b.status === 'CONFIRMED').length;
    const checkedIn = bookings.filter(b => b.status === 'CHECKED_IN').length;
    const guests = users.filter(u => u.userType === 'GUEST').length;
    return { totalRevenue, available, occupied, confirmed, checkedIn, guests, totalBookings: bookings.length };
  }, [rooms, bookings, users]);

  // Monthly bookings chart data
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, i) => ({
      month,
      bookings: bookings.filter(b => new Date(b.checkInDate).getMonth() === i).length,
      revenue: bookings.filter(b => new Date(b.checkInDate).getMonth() === i)
        .reduce((s, b) => s + (b.totalPrice || 0), 0),
    }));
  }, [bookings]);

  // Room status pie
  const roomPieData = [
    { name: 'Available', value: rooms.filter(r => r.status === 'AVAILABLE').length },
    { name: 'Booked', value: rooms.filter(r => r.status === 'BOOKED').length },
    { name: 'Occupied', value: rooms.filter(r => r.status === 'OCCUPIED').length },
  ].filter(d => d.value > 0);

  const statCards = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'teal', change: '+12.5%' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: CalendarCheck, color: 'blue', change: '+8.2%' },
    { label: 'Total Guests', value: stats.guests, icon: Users, color: 'violet', change: '+5.1%' },
    { label: 'Available Rooms', value: stats.available, icon: BedDouble, color: 'emerald', change: null },
  ];

  const recentBookings = [...bookings].reverse().slice(0, 6);

  return (
    <AdminLayout>
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {statCards.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${color}-100 text-${color}-600 flex-shrink-0`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-medium mb-1">{label}</p>
              <p className="text-2xl font-bold text-slate-800">{value}</p>
              {change && <p className="text-xs text-emerald-600 font-medium">{change} this month</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Bookings chart */}
        <div className="xl:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-slate-800">Booking Trends</h2>
            <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full">This Year</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="bookingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
              <Area type="monotone" dataKey="bookings" stroke="#14b8a6" strokeWidth={2} fill="url(#bookingGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Room status pie */}
        <div className="card p-5">
          <h2 className="font-display font-semibold text-slate-800 mb-4">Room Status</h2>
          {roomPieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={roomPieData} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                    {roomPieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {roomPieData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                      <span className="text-slate-600">{d.name}</span>
                    </div>
                    <span className="font-semibold text-slate-800">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm">No room data</div>
          )}
        </div>
      </div>

      {/* Today's activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-5 flex items-center gap-4 border-l-4 border-amber-400">
          <Clock size={24} className="text-amber-500 flex-shrink-0" />
          <div>
            <p className="text-2xl font-bold text-slate-800">{stats.confirmed}</p>
            <p className="text-slate-500 text-sm">Pending Check-Ins</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4 border-l-4 border-teal-400">
          <CheckCircle size={24} className="text-teal-500 flex-shrink-0" />
          <div>
            <p className="text-2xl font-bold text-slate-800">{stats.checkedIn}</p>
            <p className="text-slate-500 text-sm">Currently Checked In</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4 border-l-4 border-red-400">
          <AlertCircle size={24} className="text-red-500 flex-shrink-0" />
          <div>
            <p className="text-2xl font-bold text-slate-800">{rooms.filter(r => r.status === 'OCCUPIED').length}</p>
            <p className="text-slate-500 text-sm">Occupied Rooms</p>
          </div>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-display font-semibold text-slate-800">Recent Bookings</h2>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-10"><LoadingSpinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {['Code', 'Guest', 'Room', 'Check-In', 'Check-Out', 'Total', 'Status'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-700">{b.bookingCode}</td>
                    <td className="px-6 py-4 text-slate-700">{b.guest?.fullName}</td>
                    <td className="px-6 py-4 text-slate-600">Rm {b.room?.roomNumber}</td>
                    <td className="px-6 py-4 text-slate-600">{b.checkInDate}</td>
                    <td className="px-6 py-4 text-slate-600">{b.checkOutDate}</td>
                    <td className="px-6 py-4 font-semibold text-teal-600">${b.totalPrice?.toFixed(2)}</td>
                    <td className="px-6 py-4"><BookingStatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentBookings.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-sm">No bookings yet</div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
