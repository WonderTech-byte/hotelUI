import { Link } from 'react-router-dom';
import { Search, Star, MapPin, ArrowRight, Wifi, Car, Coffee, Waves } from 'lucide-react';
import { useGetAvailableRoomsQuery } from '../../services/api';
import GuestNavbar from '../../components/layout/GuestNavbar';

const ROOM_PLACEHOLDER = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80';

const amenities = [
  { icon: <Wifi size={22} />, label: 'Free WiFi' },
  { icon: <Car size={22} />, label: 'Parking' },
  { icon: <Coffee size={22} />, label: 'Breakfast' },
  { icon: <Waves size={22} />, label: 'Pool' },
];

const stats = [
  { stat: '100k+', label: 'Satisfied Guests' },
  { stat: '15k+', label: 'Years Experience' },
  { stat: '800+', label: 'Total Rooms' },
  { stat: '12k+', label: 'Staff Members' },
];

export default function HomePage() {
  const { data: rooms = [], isLoading } = useGetAvailableRoomsQuery();

  return (
    <div className="min-h-screen bg-white">
      <GuestNavbar />

      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center bg-hero-gradient overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80"
            alt="Hero" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/30 text-teal-300 text-sm px-4 py-2 rounded-full mb-6">
              <Star size={14} fill="currentColor" /> Premium Hospitality
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white leading-tight mb-6">
              Your Dream Stay<br />
              <span className="text-gradient">Awaits You</span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-lg">
              Discover luxury comfort, world-class amenities, and unforgettable experiences — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/rooms" className="btn-primary flex items-center gap-2 justify-center text-base">
                <Search size={18} /> Explore Rooms
              </Link>
              <Link to="/register" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 justify-center">
                Book Now <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Floating search bar */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-0">
          <div className="bg-white rounded-t-3xl shadow-card-hover p-6 w-full max-w-4xl mx-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Room Type</label>
                <select className="input-field">
                  <option>All Types</option>
                  <option>SINGLE</option>
                  <option>DOUBLE</option>
                  <option>SUITE</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Check-In</label>
                <input type="date" className="input-field" min={new Date().toISOString().split('T')[0]} />
              </div>
              <Link to="/rooms" className="btn-primary flex items-center justify-center gap-2 h-12">
                <Search size={18} /> Search Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="pt-32 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-teal-50 text-teal-600 text-xs font-semibold px-4 py-2 rounded-full mb-4">Categories</div>
            <h2 className="text-3xl font-display font-bold text-slate-800">Luxury &amp; Comfort Choices</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {amenities.map((a) => (
              <div key={a.label} className="card p-6 text-center hover:-translate-y-1 transition-transform cursor-pointer group">
                <div className="w-14 h-14 bg-teal-50 group-hover:bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 mx-auto mb-4 transition-colors">
                  {a.icon}
                </div>
                <p className="font-medium text-slate-700">{a.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Rooms */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-block bg-teal-50 text-teal-600 text-xs font-semibold px-4 py-2 rounded-full mb-3">Featured Rooms</div>
              <h2 className="text-3xl font-display font-bold text-slate-800">Check Out Premium Stays</h2>
            </div>
            <Link to="/rooms" className="hidden md:flex items-center gap-2 text-teal-600 font-medium hover:gap-3 transition-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {rooms.slice(0, 8).map((room, i) => (
                <Link key={room.id} to={`/rooms/${room.id}`}
                  className={`card overflow-hidden group animate-fade-in-up stagger-${(i % 4) + 1}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img src={room.imageUrls[0] || ROOM_PLACEHOLDER} alt={room.roomNumber}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <span className="badge-available text-xs">{room.status}</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-2 py-1 rounded-lg">
                      {room.roomType}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 mb-1">Room {room.roomNumber}</h3>
                    <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
                      <MapPin size={12} /> Premium Location
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-teal-600">${room.price}</span>
                        <span className="text-xs text-slate-400">/{room.priceType === 'PER_NIGHT' ? 'night' : 'day'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={11} fill="#f59e0b" className="text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-teal-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.stat}>
                <div className="text-4xl md:text-5xl font-display font-bold mb-2">{s.stat}</div>
                <div className="text-teal-100 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                  <Star size={14} className="text-white" />
                </div>
                <span className="font-display font-bold text-white">BookInn</span>
              </div>
              <p className="text-sm leading-relaxed">Premium hotel management system for the modern traveller.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <div><Link to="/" className="hover:text-teal-400 transition-colors">Home</Link></div>
                <div><Link to="/rooms" className="hover:text-teal-400 transition-colors">Rooms</Link></div>
                <div><Link to="/login" className="hover:text-teal-400 transition-colors">Login</Link></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <div className="space-y-2 text-sm">
                <p>info@bookinn.com</p>
                <p>+1 (555) 000-0000</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 text-center text-sm">
            © {new Date().getFullYear()} BookInn. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
