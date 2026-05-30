import type { RoomStatus, BookingStatus } from '../../types';

export function RoomStatusBadge({ status }: { status: RoomStatus }) {
  const map: Record<RoomStatus, string> = {
    AVAILABLE: 'badge-available',
    BOOKED: 'badge-booked',
    OCCUPIED: 'badge-occupied',
  };
  return <span className={map[status]}>{status}</span>;
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const map: Record<BookingStatus, string> = {
    CONFIRMED: 'badge-confirmed',
    CHECKED_IN: 'badge-checked-in',
    CHECKED_OUT: 'badge-checked-out',
    CANCELLED: 'badge-cancelled',
    NO_SHOW: 'badge-no-show',
  };
  return <span className={map[status]}>{status.replace('_', ' ')}</span>;
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} border-2 border-teal-200 border-t-teal-500 rounded-full animate-spin`} />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-slate-500 font-body">Loading...</p>
      </div>
    </div>
  );
}

export function EmptyState({ title, description, icon }: { title: string; description?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-slate-300">{icon}</div>}
      <h3 className="text-lg font-semibold text-slate-600">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
    </div>
  );
}
