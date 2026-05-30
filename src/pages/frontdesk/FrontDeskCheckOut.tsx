import { useState } from 'react';
import { Search, LogOut, CheckCircle, Calendar, User, BedDouble } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetBookingByCodeQuery, useCheckOutMutation } from '../../services/api';
import FrontDeskLayout from '../../components/layout/FrontDeskLayout';
import { BookingStatusBadge } from '../../components/shared';

export default function FrontDeskCheckOut() {
  const [code, setCode] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [checkedOut, setCheckedOut] = useState(false);

  const { data: booking, isFetching, error } = useGetBookingByCodeQuery(searchCode, { skip: !searchCode });
  const [checkOut, { isLoading }] = useCheckOutMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckedOut(false);
    setSearchCode(code.trim().toUpperCase());
  };

  const handleCheckOut = async () => {
    if (!booking) return;
    try {
      await checkOut(booking.bookingCode).unwrap();
      toast.success(`${booking.guest.fullName} checked out successfully!`);
      setCheckedOut(true);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Check-out failed');
    }
  };

  return (
    <FrontDeskLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-slate-800">Check-Out</h2>
          <p className="text-slate-500 text-sm mt-1">Enter booking code to process guest check-out</p>
        </div>

        <form onSubmit={handleSearch} className="card p-6 mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Booking Code</label>
          <div className="flex gap-3">
            <input type="text" className="input-field flex-1 font-mono uppercase"
              placeholder="e.g. BK-XXXXXXXX" value={code}
              onChange={(e) => setCode(e.target.value)} required />
            <button type="submit" className="btn-primary flex items-center gap-2 px-5">
              <Search size={16} /> Search
            </button>
          </div>
        </form>

        {isFetching && (
          <div className="card p-8 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-teal-200 border-t-teal-500 rounded-full animate-spin mx-auto mb-3" />
            Searching...
          </div>
        )}

        {error && !isFetching && (
          <div className="card p-6 border-l-4 border-red-400">
            <p className="text-red-600 font-medium">Booking not found</p>
            <p className="text-slate-500 text-sm mt-1">Check the code and try again</p>
          </div>
        )}

        {booking && !isFetching && !checkedOut && (
          <div className="card p-6 animate-fade-in-up">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="font-display font-bold text-slate-800 text-lg">Booking Found</h3>
                <p className="font-mono text-teal-600 font-semibold">{booking.bookingCode}</p>
              </div>
              <BookingStatusBadge status={booking.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1"><User size={12} /> Guest</div>
                <p className="font-semibold text-slate-800">{booking.guest.fullName}</p>
                <p className="text-xs text-slate-400">{booking.guest.email}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1"><BedDouble size={12} /> Room</div>
                <p className="font-semibold text-slate-800">Room {booking.room.roomNumber}</p>
                <p className="text-xs text-slate-400">{booking.room.roomType}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1"><Calendar size={12} /> Check-In</div>
                <p className="font-semibold text-slate-800">{booking.checkInDate}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1"><Calendar size={12} /> Check-Out</div>
                <p className="font-semibold text-slate-800">{booking.checkOutDate}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mb-5">
              <span className="text-slate-500 text-sm">{booking.numberOfNights} nights · {booking.numberOfUnits} unit(s)</span>
              <span className="font-bold text-teal-600 text-lg">${booking.totalPrice?.toFixed(2)}</span>
            </div>

            {booking.status === 'CHECKED_IN' ? (
              <button onClick={handleCheckOut} disabled={isLoading}
                className="bg-slate-800 hover:bg-slate-900 text-white font-medium px-6 py-3 rounded-xl w-full flex items-center justify-center gap-2 transition-all shadow-md">
                {isLoading
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><LogOut size={18} /> Process Check-Out</>}
              </button>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center text-amber-700 text-sm font-medium">
                This booking cannot be checked out (Status: {booking.status.replace('_', ' ')})
              </div>
            )}
          </div>
        )}

        {checkedOut && booking && (
          <div className="card p-8 text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-slate-600" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-800 mb-1">Check-Out Complete!</h3>
            <p className="text-slate-500 mb-4">{booking.guest.fullName} has checked out from Room {booking.room.roomNumber}</p>
            <p className="text-sm font-semibold text-teal-600 mb-6">Total Charged: ${booking.totalPrice?.toFixed(2)}</p>
            <button onClick={() => { setCode(''); setSearchCode(''); setCheckedOut(false); }}
              className="btn-outline">Process Another</button>
          </div>
        )}
      </div>
    </FrontDeskLayout>
  );
}
