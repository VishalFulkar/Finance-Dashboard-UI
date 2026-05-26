import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/features/authSlice';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <button
      id="logout-btn"
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-2.5 rounded-full shadow-md hover:shadow-lg hover:border-rose-200 hover:text-rose-500 transition-all duration-300 font-bold text-sm text-slate-600 disabled:opacity-60"
    >
      <LogOut size={16} />
      Logout
    </button>
  );
};

export default LogoutButton;
