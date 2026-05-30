import { useState } from 'react';
import { Search } from 'lucide-react';
import { useGetBookingByCodeQuery } from '../../services/api';
import FrontDeskLayout from '../../components/layout/FrontDeskLayout';
import { BookingStatusBadge } from '../../components/shared';

export default function FrontDeskLookup() {
  const [code, setCode] = useState('');
  const [searchCode, setSearchCode] = useState('');

  const { data: booking, isFetching, error } = useGetBookingByCodeQuery(searchCode, { skip: !searchCode });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchCode(code.trim().toUpperCase());
  };

  return (
    <FrontDeskLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-slate-800">Lookup Booking</h2>
          <p className="text-slate-500 text-sm mt-1">Search any booking by its code</p>
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
          </div>
        )}

        {booking && !isFetching && (
          <div className="card p-6 animate-fade-in-up">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Booking Code</p>
                <p className="font-mono font-bold text-slate-800 text-lg">{booking.bookingCode}</p>
              </div>
              <BookingStatusBadge status={booking.status} />
            </div>

            <div className="space-y-3">
              {[
                { label: 'Guest Name', value: booking.guest.fullName },
                { label: 'Email', value: booking.guest.email },
                { label: 'Phone', value: booking.guest.phoneNumber || '—' },
                { label: 'Room', value: `Room ${booking.room.roomNumber} (${booking.room.roomType})` },
                { label: 'Check-In', value: booking.checkInDate },
                { label: 'Check-Out', value: booking.checkOutDate },
                { label: 'Nights', value: String(booking.numberOfNights) },
                { label: 'Units', value: String(booking.numberOfUnits) },
                { label: 'Total Amount', value: `$${booking.totalPrice?.toFixed(2)}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2.5 border-b border-slate-50 last:border-0">
                  <span className="text-slate-500 text-sm">{label}</span>
                  <span className="font-medium text-slate-800 text-sm">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </FrontDeskLayout>
  );
}
