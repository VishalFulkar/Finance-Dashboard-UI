import React, { useState } from 'react';
import { 
  LayoutDashboard, CreditCard, PieChart as PieIcon, 
  Menu, X, Bell, Settings 
} from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Hook to check which route is active

  const navLinks = [
    { icon: <LayoutDashboard size={22} />, label: 'Dashboard', path: '/' },
    { icon: <CreditCard size={22} />, label: 'Transactions', path: '/transaction' },
    { icon: <PieIcon size={22} />, label: 'Statistics', path: '/statistics' },
  ];

  return (
    <>
      {/* --- MOBILE TOP BAR --- */}
      <div className="lg:hidden flex items-center justify-between bg-white px-6 py-4 border-b border-slate-100 sticky top-0 z-40">
        <Link to="/" className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">F</Link>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* --- MOBILE SLIDE-OUT DRAWER --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-60 lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-70 p-8 shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">F</div>
                  <span className="font-bold text-slate-900">FINCHECK</span>
                </Link>
                <button onClick={() => setIsOpen(false)} className="text-slate-400"><X size={24}/></button>
              </div>

              <div className="space-y-4 flex-1">
                {navLinks.map((link, i) => (
                  <Link 
                    key={i} 
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${location.pathname === link.path ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                 <Link to="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl transition-all">
                    <Settings size={22}/> Settings
                 </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- DESKTOP SLIM SIDEBAR --- */}
      <nav className="hidden lg:flex w-24 flex-col items-center py-10 bg-white border-r border-slate-100 gap-10 sticky top-0 h-screen overflow-y-auto shadow-sm">
        <Link to="/" className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-xl shadow-indigo-100 transition-transform hover:scale-105">
          F
        </Link>
        
        <div className="flex flex-col gap-10 text-slate-300">
          {navLinks.map((link, i) => (
            <Link 
              key={i} 
              to={link.path}
              className={`cursor-pointer transition-all hover:scale-110 ${location.pathname === link.path ? 'text-indigo-600' : 'hover:text-indigo-400'}`}
              title={link.label}
            >
              {link.icon}
            </Link>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-8 text-slate-300">
           <Link className="hover:text-indigo-500 transition-colors"><Bell size={22}/></Link>
           <Link className="hover:text-indigo-500 transition-colors"><Settings size={22}/></Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;