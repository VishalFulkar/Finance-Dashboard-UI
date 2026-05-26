import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getMe } from './redux/features/authSlice';
import { fetchTransactions } from './redux/features/financeSlice';

import Homepage from './pages/Homepage';
import Statistics from './pages/Statistics';
import TransactionSection from './pages/TransactionSection';
import Login from './pages/Login';
import Register from './pages/Register';

// ── Protected Route wrapper ──────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user, initialized } = useSelector(state => state.auth);

  if (!initialized) {
    // Still checking cookie — show nothing to avoid flash to /login
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

// ── Auth Route wrapper (redirect to / if already logged in) ──────────────────
const AuthRoute = ({ children }) => {
  const { user, initialized } = useSelector(state => state.auth);
  if (!initialized) return null;
  return user ? <Navigate to="/" replace /> : children;
};

// ── App ───────────────────────────────────────────────────────────────────────
const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  // Restore session from cookie on every page load
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  // Fetch transactions whenever user logs in
  useEffect(() => {
    if (user) {
      dispatch(fetchTransactions());
    }
  }, [user, dispatch]);

  return (
    <div>
      <Routes>
        {/* Auth pages */}
        <Route path="/login"    element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />

        {/* Protected pages */}
        <Route path="/"            element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
        <Route path="/statistics"  element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
        <Route path="/transaction" element={<ProtectedRoute><TransactionSection /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

export default App;
