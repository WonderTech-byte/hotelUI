import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Hotel } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLoginMutation } from '../../services/api';
import { setCredentials } from '../../features/auth/authSlice';
import { useAppDispatch } from '../../app/hooks';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(form).unwrap();
      dispatch(setCredentials({ token: res.token, user: res.user }));
      toast.success(`Welcome back, ${res.user.fullName.split(' ')[0]}!`);
      if (res.user.userType === 'ADMIN') navigate('/admin');
      else if (res.user.userType === 'FRONT_DESK') navigate('/frontdesk');
      else navigate('/');
    } catch {
      toast.error('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-teal-400 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-blue-400 blur-3xl" />
        </div>
        <div className="relative text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center">
              <Hotel size={24} />
            </div>
            <span className="text-2xl font-display font-bold">BookInn</span>
          </div>
          <h1 className="text-4xl font-display font-bold leading-tight mb-4">
            Your Dream Stay<br />Awaits
          </h1>
          <p className="text-slate-300 text-lg max-w-sm">
            Premium hospitality management — where every stay becomes an unforgettable experience.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-6 text-left">
            {[
              { stat: '100k+', label: 'Satisfied Guests' },
              { stat: '800+', label: 'Total Rooms' },
              { stat: '15k+', label: 'Years Experience' },
              { stat: '12k+', label: 'Staff Members' },
            ].map((s) => (
              <div key={s.stat} className="glass rounded-2xl p-4">
                <div className="text-2xl font-display font-bold text-teal-400">{s.stat}</div>
                <div className="text-slate-400 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center">
              <Hotel size={18} className="text-white" />
            </div>
            <span className="text-xl font-display font-bold text-slate-800">BookInn</span>
          </div>

          <h2 className="text-3xl font-display font-bold text-slate-800 mb-2">Welcome back</h2>
          <p className="text-slate-500 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter your username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-right mt-2">
                <Link to="/forgot-password" className="text-sm text-teal-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-teal-600 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
