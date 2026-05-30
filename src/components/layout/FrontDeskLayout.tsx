import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Hotel, LogIn, LogOut as LogOutIcon, Search, ChevronRight, Menu } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Check-In', icon: LogIn, to: '/frontdesk' },
  { label: 'Check-Out', icon: LogOutIcon, to: '/frontdesk/checkout' },
  { label: 'Lookup Booking', icon: Search, to: '/frontdesk/lookup' },
];

interface Props { children: React.ReactNode }

export default function FrontDeskLayout({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Signed out');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-slate-900">
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center">
            <Hotel size={18} className="text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-white text-sm block">BookInn</span>
            <span className="text-xs text-slate-400">Front Desk</span>
          </div>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map(({ label, icon: Icon, to }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to}
                className={`sidebar-link ${active ? 'active' : ''}`}>
                <Icon size={18} className="flex-shrink-0" />
                <span>{label}</span>
                {active && <ChevronRight size={14} className="ml-auto text-teal-400" />}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-2 px-2 py-2 mb-1">
            <div className="w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user?.fullName[0]}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.fullName}</p>
              <p className="text-slate-400 text-xs">Front Desk</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <LogOutIcon size={15} /><span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 bg-slate-900 z-50 flex flex-col">
            <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
              <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center">
                <Hotel size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-white">BookInn</span>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navItems.map(({ label, icon: Icon, to }) => (
                <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                  className={`sidebar-link ${location.pathname === to ? 'active' : ''}`}>
                  <Icon size={18} /><span>{label}</span>
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3 shadow-sm">
          <button className="md:hidden text-slate-600" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
          <h1 className="font-display font-semibold text-slate-800">
            {navItems.find(n => n.to === location.pathname)?.label ?? 'Front Desk'}
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
