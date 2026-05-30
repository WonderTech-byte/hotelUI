import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Hotel, Menu, X, User, LogOut, Calendar } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';

export default function GuestNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Signed out');
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Rooms', to: '/rooms' },
  ];

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center">
              <Hotel size={18} className="text-white" />
            </div>
            <span className="text-xl font-display font-bold text-slate-800">BookInn</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to}
                className={`text-sm font-medium transition-colors ${location.pathname === l.to ? 'text-teal-600' : 'text-slate-600 hover:text-teal-600'}`}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl transition-colors">
                  <div className="w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.fullName[0]}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user.fullName.split(' ')[0]}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-card-hover border border-slate-100 py-2 z-50">
                    <Link to="/my-bookings" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                      <Calendar size={15} /> My Bookings
                    </Link>
                    <hr className="my-1 border-slate-100" />
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full">
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started</Link>
              </>
            )}
          </div>

          <button className="md:hidden text-slate-600" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-2">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-slate-600 hover:text-teal-600 font-medium text-sm">
              {l.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/my-bookings" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 text-sm">
                <Calendar size={15} /> My Bookings
              </Link>
              <button onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-red-500 text-sm w-full">
                <LogOut size={15} /> Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="btn-outline text-sm flex-1 text-center">Sign In</Link>
              <Link to="/register" className="btn-primary text-sm flex-1 text-center">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
