import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, clearError } from '../redux/features/authSlice';
import { Eye, EyeOff, Wallet, Upload, User } from 'lucide-react';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    dispatch(clearError());
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!avatarFile) {
      alert('Please select a profile photo.');
      return;
    }

    // Build multipart form data
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('avatar', avatarFile);

    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans">

      {/* ── Left Panel ──────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-violet-700 via-indigo-600 to-blue-700 p-14 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-900/40 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Wallet className="text-white" size={22} />
          </div>
          <span className="text-white font-black text-xl tracking-tight">FinanceFlow</span>
        </div>

        <div className="relative z-10 space-y-6">
          <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Get started in seconds</p>

          {['Track income & expenses in real-time', 'Beautiful charts and spending insights', 'Secure cloud storage for your data', 'Access from any device, anytime'].map((text, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black text-xs">{i + 1}</span>
              </div>
              <p className="text-white/80 text-sm font-medium">{text}</p>
            </div>
          ))}
        </div>

        <div className="relative z-10">
          <p className="text-white/40 text-xs font-medium">
            Join thousands of users managing their finances smarter.
          </p>
        </div>
      </div>

      {/* ── Right Panel ─────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <Wallet className="text-white" size={20} />
            </div>
            <span className="text-white font-black text-xl">FinanceFlow</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Create account</h1>
            <p className="text-slate-400 text-sm font-medium">Start your financial journey today</p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
              <p className="text-rose-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-3">
              <label htmlFor="avatar-upload" className="cursor-pointer group">
                <div className="w-24 h-24 rounded-3xl bg-white/5 border-2 border-dashed border-white/20 group-hover:border-indigo-500 transition-all overflow-hidden flex items-center justify-center relative">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-500 group-hover:text-indigo-400 transition-colors">
                      <User size={28} />
                      <span className="text-[10px] font-bold uppercase tracking-wide">Photo</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl">
                    <Upload size={20} className="text-white" />
                  </div>
                </div>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <p className="text-slate-500 text-xs font-medium">
                {avatarFile ? avatarFile.name : 'Click to upload profile photo'}
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-slate-300 text-sm font-bold mb-2">Full Name</label>
              <input
                id="register-name"
                name="name"
                type="text"
                required
                minLength={3}
                value={formData.name}
                onChange={handleChange}
                placeholder="Peter Parker"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-slate-600 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-300 text-sm font-bold mb-2">Email</label>
              <input
                id="register-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-slate-600 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-300 text-sm font-bold mb-2">Password</label>
              <div className="relative">
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
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
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
