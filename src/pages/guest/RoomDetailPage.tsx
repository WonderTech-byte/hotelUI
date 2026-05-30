import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Check, ChevronRight, Calendar, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetRoomByIdQuery, useCreateBookingMutation } from '../../services/api';
import { useAppSelector } from '../../app/hooks';
import GuestNavbar from '../../components/layout/GuestNavbar';
import { RoomStatusBadge, LoadingSpinner } from '../../components/shared';
import { differenceInDays } from 'date-fns';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80';

export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: room, isLoading } = useGetRoomByIdQuery(Number(id));
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  const today = new Date().toISOString().split('T')[0];
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [units, setUnits] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [confirmed, setConfirmed] = useState<any>(null);

  const nights =
    checkIn && checkOut ? differenceInDays(new Date(checkOut), new Date(checkIn)) : 0;
  const total = room ? room.price * nights * units : 0;

  const handleBook = async () => {
    const token = localStorage.getItem('hms_token');
    console.log('=== BOOKING DEBUG ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('token in localStorage:', token);
    console.log('checkIn:', checkIn, 'checkOut:', checkOut, 'nights:', nights);

    if (!isAuthenticated) {
      toast.error('Please sign in to make a booking');
      navigate('/login');
      return;
    }
    if (!checkIn || !checkOut || nights <= 0) {
      toast.error('Please select valid check-in and check-out dates');
      return;
    }
    try {
      const res = await createBooking({
        roomId: Number(id),
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfUnits: units,
      }).unwrap();
      setConfirmed(res);
    } catch (err: any) {
      console.log('=== BOOKING ERROR ===', err);
      toast.error(err?.data?.message || `Failed: ${err?.status}`);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen">
        <GuestNavbar />
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );

  if (!room)
    return (
      <div className="min-h-screen">
        <GuestNavbar />
        <div className="text-center py-20 text-slate-500">Room not found</div>
      </div>
    );

  if (confirmed)
    return (
      <div className="min-h-screen bg-slate-50">
        <GuestNavbar />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="card p-10 animate-fade-in-up">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={36} className="text-teal-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-800 mb-2">AWESOME!</h1>
            <p className="text-slate-500 mb-6">Your booking is confirmed</p>
            <div className="bg-teal-50 rounded-2xl p-6 text-left space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Booking Code</span>
                <span className="font-bold text-slate-800 font-mono">{confirmed.bookingCode}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Room</span>
                <span className="font-medium">
                  {confirmed.room.roomNumber} ({confirmed.room.roomType})
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Check-In</span>
                <span className="font-medium">{confirmed.checkInDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Check-Out</span>
                <span className="font-medium">{confirmed.checkOutDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Nights</span>
                <span className="font-medium">{confirmed.numberOfNights}</span>
              </div>
              <div className="border-t border-teal-200 pt-3 flex justify-between">
                <span className="font-semibold text-slate-700">Total</span>
                <span className="font-bold text-teal-600 text-lg">
                  ${confirmed.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              A confirmation email has been sent to your inbox
            </p>
            <div className="flex gap-3">
              <Link to="/my-bookings" className="btn-primary flex-1">
                View My Bookings
              </Link>
              <Link to="/rooms" className="btn-outline flex-1">
                Browse More
              </Link>
            </div>
          </div>
        </div>
      </div>
    );

  const images = room.imageUrls.length > 0 ? room.imageUrls : [PLACEHOLDER];

  return (
    <div className="min-h-screen bg-slate-50">
      <GuestNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-teal-600 mb-6 text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to Rooms
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2">
            {/* Image gallery */}
            <div className="card overflow-hidden mb-6">
              <div className="relative h-80 md:h-96">
                <img
                  src={images[activeImage]}
                  alt={`Room ${room.roomNumber}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <RoomStatusBadge status={room.status} />
                </div>
              </div>
              {images.length > 1 && (
                <div className="p-4 flex gap-3 overflow-x-auto scrollbar-hide">
                  {images.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        i === activeImage ? 'border-teal-500' : 'border-transparent'
                      }`}
                    >
                      <img src={url} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="card p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-display font-bold text-slate-800">
                    Room {room.roomNumber}
                  </h1>
                  <p className="text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin size={14} /> Premium Location · {room.roomType}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#f59e0b" className="text-amber-400" />
                  ))}
                  <span className="text-sm text-slate-500 ml-1">(5.0)</span>
                </div>
              </div>
              {room.description && (
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {room.description}
                </p>
              )}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-2xl font-bold text-teal-600">
                  ${room.price}
                  <span className="text-sm font-normal text-slate-400">
                    /{room.priceType === 'PER_NIGHT' ? 'night' : 'day'}
                  </span>
                </p>
              </div>
            </div>

            {/* Features */}
            {room.features.length > 0 && (
              <div className="card p-6">
                <h2 className="font-display font-semibold text-slate-800 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 gap-3">
                  {room.features.map((f) => (
                    <div key={f.id} className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-teal-600" />
                      </div>
                      <span>{f.roomFeature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Panel */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-display font-semibold text-slate-800 mb-5">Book This Room</h2>

              <div
                className={`mb-4 ${
                  room.status !== 'AVAILABLE' ? 'opacity-60 pointer-events-none' : ''
                }`}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide flex items-center gap-1">
                      <Calendar size={12} /> Check-In Date
                    </label>
                    <input
                      type="date"
                      className="input-field"
                      min={today}
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide flex items-center gap-1">
                      <Calendar size={12} /> Check-Out Date
                    </label>
                    <input
                      type="date"
                      className="input-field"
                      min={checkIn || today}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide flex items-center gap-1">
                      <Users size={12} /> Number of Units
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setUnits(Math.max(1, units - 1))}
                        className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
                      >
                        −
                      </button>
                      <span className="font-semibold text-slate-800 w-6 text-center">{units}</span>
                      <button
                        onClick={() => setUnits(units + 1)}
                        className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {nights > 0 && (
                  <div className="mt-4 bg-teal-50 rounded-xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>
                        ${room.price} × {nights} nights × {units} units
                      </span>
                    </div>
                    <div className="border-t border-teal-200 pt-2 flex justify-between font-bold text-slate-800">
                      <span>Total</span>
                      <span className="text-teal-600">${total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {room.status === 'AVAILABLE' ? (
                <button
                  onClick={handleBook}
                  disabled={isBooking}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {isBooking ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Book Now</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              ) : (
                <div className="text-center py-3 bg-slate-100 rounded-xl text-slate-500 text-sm font-medium">
                  Room is currently {room.status.toLowerCase()}
                </div>
              )}

              {!isAuthenticated && (
                <p className="mt-3 text-center text-xs text-slate-400">
                  <Link to="/login" className="text-teal-600 hover:underline">
                    Sign in
                  </Link>{' '}
                  to book this room
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}