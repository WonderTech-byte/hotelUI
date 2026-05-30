import { useState } from 'react';
import { Search, LogIn, CheckCircle, Calendar, User, BedDouble } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetBookingByCodeQuery, useCheckInMutation } from '../../services/api';
import FrontDeskLayout from '../../components/layout/FrontDeskLayout';
import { BookingStatusBadge } from '../../components/shared';

export default function FrontDeskCheckIn() {
  const [code, setCode] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [checkedIn, setCheckedIn] = useState(false);

  const { data: booking, isFetching, error } = useGetBookingByCodeQuery(searchCode, {
    skip: !searchCode,
  });
  const [checkIn, { isLoading: isChecking }] = useCheckInMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckedIn(false);
    setSearchCode(code.trim().toUpperCase());
  };

  const handleCheckIn = async () => {
    if (!booking) return;
    try {
      await checkIn(booking.bookingCode).unwrap();
      toast.success(`${booking.guest.fullName} checked in successfully!`);
      setCheckedIn(true);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Check-in failed');
    }
  };

  return (
    <FrontDeskLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-slate-800">Check-In</h2>
          <p className="text-slate-500 text-sm mt-1">Enter booking code to process guest check-in</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="card p-6 mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Booking Code</label>
          <div className="flex gap-3">
            <input
              type="text"
              className="input-field flex-1 font-mono uppercase"
              placeholder="e.g. BK-XXXXXXXX"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary flex items-center gap-2 px-5">
              <Search size={16} /> Search
            </button>
          </div>
        </form>

        {/* Loading */}
        {isFetching && (
          <div className="card p-8 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-teal-200 border-t-teal-500 rounded-full animate-spin mx-auto mb-3" />
            Searching...
          </div>
        )}

        {/* Error */}
        {error && !isFetching && (
          <div className="card p-6 border-l-4 border-red-400">
            <p className="text-red-600 font-medium">Booking not found</p>
            <p className="text-slate-500 text-sm mt-1">Check the code and try again</p>
          </div>
        )}

        {/* Booking found */}
        {booking && !isFetching && !checkedIn && (
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
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <User size={12} /> Guest
                </div>
                <p className="font-semibold text-slate-800">{booking.guest.fullName}</p>
                <p className="text-xs text-slate-400">{booking.guest.email}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <BedDouble size={12} /> Room
                </div>
                <p className="font-semibold text-slate-800">Room {booking.room.roomNumber}</p>
                <p className="text-xs text-slate-400">{booking.room.roomType}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <Calendar size={12} /> Check-In
                </div>
                <p className="font-semibold text-slate-800">{booking.checkInDate}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <Calendar size={12} /> Check-Out
                </div>
                <p className="font-semibold text-slate-800">{booking.checkOutDate}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mb-5">
              <span className="text-slate-500 text-sm">{booking.numberOfNights} nights · {booking.numberOfUnits} unit(s)</span>
              <span className="font-bold text-teal-600 text-lg">${booking.totalPrice?.toFixed(2)}</span>
            </div>

            {booking.status === 'CONFIRMED' ? (
              <button onClick={handleCheckIn} disabled={isChecking}
                className="btn-primary w-full flex items-center justify-center gap-2">
                {isChecking
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><LogIn size={18} /> Process Check-In</>}
              </button>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center text-amber-700 text-sm font-medium">
                This booking cannot be checked in (Status: {booking.status})
              </div>
            )}
          </div>
        )}

        {/* Success */}
        {checkedIn && booking && (
          <div className="card p-8 text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-teal-600" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-800 mb-1">Check-In Complete!</h3>
            <p className="text-slate-500 mb-4">{booking.guest.fullName} has been checked in to Room {booking.room.roomNumber}</p>
            <p className="text-xs text-slate-400 mb-6">A confirmation email has been sent to the guest</p>
            <button onClick={() => { setCode(''); setSearchCode(''); setCheckedIn(false); }}
              className="btn-outline">Process Another</button>
          </div>
        )}
      </div>
    </FrontDeskLayout>
  );
}
