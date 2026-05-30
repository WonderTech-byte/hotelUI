import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BedDouble, CalendarCheck, Users,
  LogOut, Hotel, Menu, X, ChevronRight
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
  { label: 'Rooms', icon: BedDouble, to: '/admin/rooms' },
  { label: 'Bookings', icon: CalendarCheck, to: '/admin/bookings' },
  { label: 'Users', icon: Users, to: '/admin/users' },
];

interface Props { children: React.ReactNode }

export default function AdminLayout({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
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

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={`
      ${mobile ? 'w-64' : collapsed ? 'w-16' : 'w-60'}
      bg-slate-900 flex flex-col transition-all duration-300 h-full
    `}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <Hotel size={18} className="text-white" />
        </div>
        {(!collapsed || mobile) && (
          <span className="font-display font-bold text-white text-lg">BookInn</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ label, icon: Icon, to }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)}
              className={`sidebar-link ${active ? 'active' : ''}`}
              title={collapsed && !mobile ? label : undefined}>
              <Icon size={18} className="flex-shrink-0" />
              {(!collapsed || mobile) && <span>{label}</span>}
              {(!collapsed || mobile) && active && <ChevronRight size={14} className="ml-auto text-teal-400" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-white/10 p-3">
        <div className={`flex items-center gap-3 px-2 py-2 ${collapsed && !mobile ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.fullName[0]}
          </div>
          {(!collapsed || mobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.fullName}</p>
              <p className="text-slate-400 text-xs truncate">{user?.userType}</p>
            </div>
          )}
        </div>
        <button onClick={handleLogout}
          className={`sidebar-link w-full mt-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 ${collapsed && !mobile ? 'justify-center' : ''}`}>
          <LogOut size={16} className="flex-shrink-0" />
          {(!collapsed || mobile) && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col relative">
        <Sidebar />
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-md z-10">
          <ChevronRight size={12} className={`transition-transform ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 z-50">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-slate-600" onClick={() => setMobileOpen(true)}>
              <Menu size={22} />
            </button>
            <h1 className="font-display font-semibold text-slate-800 text-lg">
              {navItems.find(n => n.to === location.pathname)?.label ?? 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:block">Admin Panel</span>
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user?.fullName[0]}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
