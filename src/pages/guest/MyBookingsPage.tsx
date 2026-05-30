import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, X, Hotel, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetMyBookingsQuery, useCancelBookingMutation } from '../../services/api';
import GuestNavbar from '../../components/layout/GuestNavbar';
import { BookingStatusBadge, LoadingSpinner, EmptyState } from '../../components/shared';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80';

export default function MyBookingsPage() {
  const { data: bookings = [], isLoading } = useGetMyBookingsQuery();
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(id);
    try {
      await cancelBooking(id).unwrap();
      toast.success('Booking cancelled');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Cancel failed');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <GuestNavbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-slate-800">My Bookings</h1>
          <p className="text-slate-500 mt-1">Track and manage all your reservations</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : bookings.length === 0 ? (
          <div className="card p-12">
            <EmptyState
              title="No bookings yet"
              description="Start by exploring our available rooms"
              icon={<Hotel size={48} />}
            />
            <div className="flex justify-center mt-6">
              <Link to="/rooms" className="btn-primary">Browse Rooms</Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="card overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-48 h-40 md:h-auto flex-shrink-0">
                    <img
                      src={booking.room.imageUrls[0] || PLACEHOLDER}
                      alt={`Room ${booking.room.roomNumber}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-800 text-lg">
                          Room {booking.room.roomNumber}
                        </h3>
                        <p className="text-slate-500 text-sm">{booking.room.roomType}</p>
                      </div>
                      <BookingStatusBadge status={booking.status} />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Booking Code</p>
                        <p className="font-mono font-bold text-slate-700 text-sm">{booking.bookingCode}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Check-In</p>
                        <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
                          <Calendar size={12} /> {booking.checkInDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Check-Out</p>
                        <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
                          <Calendar size={12} /> {booking.checkOutDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Total</p>
                        <p className="text-sm font-bold text-teal-600">${booking.totalPrice?.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <p className="text-xs text-slate-400">{booking.numberOfNights} nights · {booking.numberOfUnits} unit(s)</p>
                      {booking.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={isCancelling && cancellingId === booking.id}
                          className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-medium"
                        >
                          {isCancelling && cancellingId === booking.id
                            ? <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                            : <X size={14} />}
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
