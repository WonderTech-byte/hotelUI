import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForgotPasswordMutation } from '../../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      setSent(true);
    } catch {
      toast.error('Email not found');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center">
            <Hotel size={18} className="text-white" />
          </div>
          <span className="text-xl font-display font-bold text-slate-800">BookInn</span>
        </div>

        <div className="card p-8 animate-fade-in-up">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={28} className="text-teal-600" />
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">Check your email</h2>
              <p className="text-slate-500 mb-6 text-sm">We sent a password reset link to <strong>{email}</strong></p>
              <Link to="/login" className="btn-primary w-full block text-center">Back to Login</Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-1 text-slate-500 hover:text-teal-600 text-sm mb-6">
                <ArrowLeft size={14} /> Back to login
              </Link>
              <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">Reset password</h2>
              <p className="text-slate-500 text-sm mb-6">Enter your email and we'll send a reset link</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input type="email" className="input-field" placeholder="you@example.com"
                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
