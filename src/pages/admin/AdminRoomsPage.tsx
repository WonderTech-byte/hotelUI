import { useState } from 'react';
import { Plus, Pencil, Trash2, Image, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useGetAllRoomsQuery, useCreateRoomMutation,
  useDeleteRoomMutation, useUpdateRoomMutation, useAddRoomImageMutation
} from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import { RoomStatusBadge, LoadingSpinner, EmptyState } from '../../components/shared';
import type { Room, RoomType, PriceType } from '../../types';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80';

interface RoomFormData {
  roomNumber: string; roomType: RoomType; price: string;
  priceType: PriceType; description: string;
}

const defaultForm: RoomFormData = {
  roomNumber: '', roomType: 'SINGLE', price: '', priceType: 'PER_NIGHT', description: ''
};

export default function AdminRoomsPage() {
  const { data: rooms = [], isLoading } = useGetAllRoomsQuery();
  const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation();
  const [deleteRoom, { isLoading: isDeleting }] = useDeleteRoomMutation();
  const [updateRoom] = useUpdateRoomMutation();
  const [addImage] = useAddRoomImageMutation();

  const [showModal, setShowModal] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [form, setForm] = useState<RoomFormData>(defaultForm);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  const openCreate = () => { setEditRoom(null); setForm(defaultForm); setImageFiles(null); setShowModal(true); };
  const openEdit = (room: Room) => {
    setEditRoom(room);
    setForm({ roomNumber: room.roomNumber, roomType: room.roomType, price: String(room.price), priceType: room.priceType, description: room.description || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editRoom) {
        await updateRoom({ id: editRoom.id, data: { ...form, price: Number(form.price) } }).unwrap();
        toast.success('Room updated');
      } else {
        const fd = new FormData();
        fd.append('roomNumber', form.roomNumber);
        fd.append('roomType', form.roomType);
        fd.append('price', form.price);
        fd.append('priceType', form.priceType);
        if (form.description) fd.append('description', form.description);
        if (imageFiles) Array.from(imageFiles).forEach(f => fd.append('imageFiles', f));
        await createRoom(fd).unwrap();
        toast.success('Room created');
      }
      setShowModal(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this room?')) return;
    setDeletingId(id);
    try { await deleteRoom(id).unwrap(); toast.success('Room deleted'); }
    catch { toast.error('Delete failed'); }
    finally { setDeletingId(null); }
  };

  const handleImageUpload = async (roomId: number, files: FileList) => {
    setUploadingId(roomId);
    try {
      const fd = new FormData();
      fd.append('imageFile', files[0]);
      await addImage({ roomId, formData: fd }).unwrap();
      toast.success('Image added');
    } catch { toast.error('Upload failed'); }
    finally { setUploadingId(null); }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-800">Rooms</h2>
          <p className="text-slate-500 text-sm">{rooms.length} total rooms</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Room
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : rooms.length === 0 ? (
        <div className="card p-12"><EmptyState title="No rooms yet" description="Add your first room to get started" icon={null} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {rooms.map((room) => (
            <div key={room.id} className="card overflow-hidden group">
              <div className="relative h-44 overflow-hidden">
                <img src={room.imageUrls[0] || PLACEHOLDER} alt={`Room ${room.roomNumber}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3"><RoomStatusBadge status={room.status} /></div>
                <div className="absolute top-3 right-3 bg-white/90 text-slate-700 text-xs font-bold px-2 py-1 rounded-lg">
                  {room.roomType}
                </div>
                {/* Upload image button overlay */}
                <label className="absolute bottom-3 right-3 bg-white/90 hover:bg-white cursor-pointer p-2 rounded-xl shadow transition-all opacity-0 group-hover:opacity-100">
                  {uploadingId === room.id
                    ? <Loader size={14} className="animate-spin text-teal-600" />
                    : <Image size={14} className="text-slate-600" />}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => e.target.files && handleImageUpload(room.id, e.target.files)} />
                </label>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-800">Room {room.roomNumber}</h3>
                    <p className="text-xs text-slate-400">{room.features.length} features · {room.imageUrls.length} images</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-teal-600">${room.price}</p>
                    <p className="text-xs text-slate-400">{room.priceType === 'PER_NIGHT' ? '/night' : '/day'}</p>
                  </div>
                </div>
                {room.description && <p className="text-xs text-slate-500 mb-3 line-clamp-2">{room.description}</p>}
                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <button onClick={() => openEdit(room)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-slate-600 hover:text-teal-600 py-2 rounded-lg hover:bg-teal-50 transition-colors">
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(room.id)} disabled={deletingId === room.id}
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-slate-600 hover:text-red-600 py-2 rounded-lg hover:bg-red-50 transition-colors">
                    {deletingId === room.id ? <Loader size={13} className="animate-spin" /> : <Trash2 size={13} />} Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up">
            <h3 className="text-xl font-display font-bold text-slate-800 mb-5">
              {editRoom ? 'Edit Room' : 'Add New Room'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Room Number</label>
                  <input className="input-field" placeholder="e.g. 101" value={form.roomNumber}
                    onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Room Type</label>
                  <select className="input-field" value={form.roomType}
                    onChange={(e) => setForm({ ...form, roomType: e.target.value as RoomType })}>
                    <option value="SINGLE">Single</option>
                    <option value="DOUBLE">Double</option>
                    <option value="SUITE">Suite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Price ($)</label>
                  <input type="number" className="input-field" placeholder="150" value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })} required min="1" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Price Type</label>
                  <select className="input-field" value={form.priceType}
                    onChange={(e) => setForm({ ...form, priceType: e.target.value as PriceType })}>
                    <option value="PER_NIGHT">Per Night</option>
                    <option value="PER_DAY">Per Day</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">Description</label>
                <textarea className="input-field resize-none" rows={3} placeholder="Room description..."
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              {!editRoom && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Room Images</label>
                  <input type="file" multiple accept="image/*" className="input-field text-sm"
                    onChange={(e) => setImageFiles(e.target.files)} />
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={isCreating} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {isCreating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                  {editRoom ? 'Save Changes' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
