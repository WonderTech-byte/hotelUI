import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, SlidersHorizontal } from 'lucide-react';
import { useGetAllRoomsQuery } from '../../services/api';
import GuestNavbar from '../../components/layout/GuestNavbar';
import { RoomStatusBadge, LoadingSpinner } from '../../components/shared';
import type { RoomType, RoomStatus } from '../../types';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80';

export default function RoomsPage() {
  const { data: rooms = [], isLoading } = useGetAllRoomsQuery();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<RoomType | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<RoomStatus | 'ALL'>('ALL');

  const filtered = rooms.filter((r) => {
    const matchType = filterType === 'ALL' || r.roomType === filterType;
    const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchSearch = r.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.roomType.toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <GuestNavbar />

      {/* Header */}
      <div className="bg-hero-gradient text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80"
            className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-display font-bold mb-3">Explore All Rooms</h1>
          <p className="text-slate-300">Find the perfect room for your stay</p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search rooms..." className="input-field pl-10 py-2.5 text-sm"
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex items-center gap-3">
              <SlidersHorizontal size={16} className="text-slate-400" />
              <select className="input-field py-2.5 text-sm w-36"
                value={filterType} onChange={(e) => setFilterType(e.target.value as any)}>
                <option value="ALL">All Types</option>
                <option value="SINGLE">Single</option>
                <option value="DOUBLE">Double</option>
                <option value="SUITE">Suite</option>
              </select>
              <select className="input-field py-2.5 text-sm w-40"
                value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
                <option value="ALL">All Status</option>
                <option value="AVAILABLE">Available</option>
                <option value="BOOKED">Booked</option>
                <option value="OCCUPIED">Occupied</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Search size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">No rooms found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((room) => (
              <Link key={room.id} to={`/rooms/${room.id}`}
                className="card overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-52 overflow-hidden">
                  <img src={room.imageUrls[0] || PLACEHOLDER} alt={`Room ${room.roomNumber}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <RoomStatusBadge status={room.status} />
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-2 py-1 rounded-lg">
                    {room.roomType}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-slate-800">Room {room.roomNumber}</h3>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, j) => <Star key={j} size={11} fill="#f59e0b" className="text-amber-400" />)}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                    <MapPin size={11} /> Premium Location
                  </p>
                  {room.description && (
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{room.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-xl font-bold text-teal-600">${room.price}</span>
                      <span className="text-xs text-slate-400">/{room.priceType === 'PER_NIGHT' ? 'night' : 'day'}</span>
                    </div>
                    <span className="text-teal-600 text-sm font-medium">View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
