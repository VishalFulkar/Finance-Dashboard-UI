import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../redux/features/authSlice';
import { Eye, EyeOff, TrendingUp, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    dispatch(clearError());
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans">

      {/* ── Left Panel ────────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-linear-to-br from-indigo-600 via-violet-700 to-purple-800 p-14 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-900/40 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Wallet className="text-white" size={22} />
          </div>
          <span className="text-white font-black text-xl tracking-tight">FinFlow</span>
        </div>

        {/* Stats cards */}
        <div className="relative z-10 space-y-4">
          <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-6">Live Portfolio</p>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6">
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Total Balance</p>
            <p className="text-white text-4xl font-black mb-4">₹2,34,500</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-emerald-400/20 px-3 py-1.5 rounded-full">
                <ArrowUpRight size={14} className="text-emerald-400" />
                <span className="text-emerald-300 text-xs font-bold">+18.4% this month</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight size={16} className="text-emerald-400" />
                <span className="text-white/60 text-[10px] font-bold uppercase">Income</span>
              </div>
              <p className="text-white text-xl font-black">₹85,000</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDownRight size={16} className="text-rose-400" />
                <span className="text-white/60 text-[10px] font-bold uppercase">Spent</span>
              </div>
              <p className="text-white text-xl font-black">₹41,200</p>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="text-white/50" size={18} />
            <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Smart Finance</span>
          </div>
          <p className="text-white/80 text-sm font-medium leading-relaxed">
            Track every rupee, understand your spending patterns, and take control of your financial future.
          </p>
        </div>
      </div>

      {/* ── Right Panel ───────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <Wallet className="text-white" size={20} />
            </div>
            <span className="text-white font-black text-xl">FinFlow</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-white mb-2">Welcome back</h1>
            <p className="text-slate-400 text-sm font-medium">Sign in to your financial dashboard</p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
              <p className="text-rose-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-300 text-sm font-bold mb-2">Email</label>
              <input
                id="login-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-slate-600 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-bold mb-2">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 pr-12 text-white placeholder-slate-600 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
