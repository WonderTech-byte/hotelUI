import { useMemo, useState } from 'react';
import { BedDouble, CalendarCheck, Users, TrendingUp, AlertCircle, CheckCircle, Clock, ChevronRight, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend, ComposedChart } from 'recharts';
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
    return months.map((month, i) => {
      const monthBookings = bookings.filter(b => new Date(b.checkInDate).getMonth() === i);
      return {
        month,
        bookings: monthBookings.length,
        revenue: monthBookings
          .filter(b => ['CHECKED_OUT', 'CHECKED_IN'].includes(b.status))
          .reduce((s, b) => s + (b.totalPrice || 0), 0),
      };
    });
  }, [bookings]);

  // Room status pie
  const roomPieData = [
    { name: 'Available', value: rooms.filter(r => r.status === 'AVAILABLE').length },
    { name: 'Booked', value: rooms.filter(r => r.status === 'BOOKED').length },
    { name: 'Occupied', value: rooms.filter(r => r.status === 'OCCUPIED').length },
  ].filter(d => d.value > 0);

  const statCards = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'teal', change: '+12.5%', isUp: true },
    { label: 'Total Bookings', value: stats.totalBookings, icon: CalendarCheck, color: 'blue', change: '+8.2%', isUp: true },
    { label: 'Total Guests', value: stats.guests, icon: Users, color: 'indigo', change: '+5.1%', isUp: true },
    { label: 'Occupancy Rate', value: `${rooms.length > 0 ? Math.round((stats.occupied / rooms.length) * 100) : 0}%`, icon: TrendingUp, color: 'amber', change: '-2.4%', isUp: false },
  ];

  const recentBookings = [...bookings].reverse().slice(0, 6);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-xl rounded-2xl border border-slate-50">
          <p className="text-sm font-bold text-slate-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-3 text-xs mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-500">{entry.name}:</span>
              <span className="font-semibold text-slate-800">
                {entry.name === 'Revenue' ? `$${entry.value.toLocaleString()}` : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-800">Dashboard Overview</h1>
            <p className="text-slate-500 text-sm">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2 text-sm font-medium text-slate-600">
              <CalendarCheck size={16} className="text-teal-500" />
              {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {statCards.map(({ label, value, icon: Icon, color, change, isUp }) => (
            <div key={label} className="card p-5 group hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {change}
                </div>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">{label}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="xl:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display font-bold text-slate-800 text-lg">Revenue & Bookings</h2>
                <p className="text-slate-400 text-xs mt-1">Monthly performance breakdown</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="w-2 h-2 rounded-full bg-teal-500" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase">Bookings</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase">Revenue</span>
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    yAxisId="left"
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar yAxisId="left" dataKey="bookings" name="Bookings" fill="#14b8a6" radius={[4, 4, 0, 0]} barSize={20} />
                  <Area 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Revenue" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Room Status */}
          <div className="card p-6 flex flex-col">
            <h2 className="font-display font-bold text-slate-800 text-lg mb-1">Room Inventory</h2>
            <p className="text-slate-400 text-xs mb-6">Current availability status</p>
            
            <div className="flex-1 flex flex-col justify-center">
              {roomPieData.length > 0 ? (
                <>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={roomPieData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {roomPieData.map((_, i) => (
                            <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-1 gap-3 mt-6">
                    {roomPieData.map((d, i) => (
                      <div key={d.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 transition-hover hover:border-teal-100">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="text-sm font-medium text-slate-600">{d.name}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-800">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <BedDouble size={48} className="opacity-20 mb-4" />
                  <p className="text-sm">No inventory data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity & Recent Bookings */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h2 className="font-display font-bold text-slate-800 text-lg px-1">Today's Focus</h2>
            <div className="card p-4 flex items-center gap-4 border-l-4 border-amber-400 hover:translate-x-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800">{stats.confirmed}</h4>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Arrivals Pending</p>
              </div>
            </div>
            <div className="card p-4 flex items-center gap-4 border-l-4 border-teal-400 hover:translate-x-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800">{stats.checkedIn}</h4>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Active Stay</p>
              </div>
            </div>
            <div className="card p-4 flex items-center gap-4 border-l-4 border-rose-400 hover:translate-x-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <AlertCircle size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800">{stats.occupied}</h4>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Rooms Occupied</p>
              </div>
            </div>
          </div>

          <div className="xl:col-span-2 card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="font-display font-bold text-slate-800 text-lg">Recent Bookings</h2>
              <button className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                View All <ChevronRight size={14} />
              </button>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-12"><LoadingSpinner /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Guest & Room</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Stay</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold uppercase">
                              {b.guest?.fullName?.split(' ').map((n: string) => n[0]).join('') || 'G'}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{b.guest?.fullName}</p>
                              <p className="text-[10px] text-slate-400">Room {b.room?.roomNumber} • {b.bookingCode}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-center">
                            <p className="text-xs font-semibold text-slate-600">
                              {new Date(b.checkInDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(b.checkOutDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </p>
                            <p className="text-[10px] text-slate-400">{b.numberOfNights} nights</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800">${b.totalPrice?.toFixed(2)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <BookingStatusBadge status={b.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {recentBookings.length === 0 && (
                  <div className="text-center py-12">
                    <CalendarCheck size={40} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-slate-400 text-sm font-medium">No recent bookings found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
