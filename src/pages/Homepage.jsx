import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { LayoutDashboard, Wallet, ArrowUpRight, ArrowDownRight, CreditCard, PieChart as PieIcon, Bell } from "lucide-react";
import { selectTransactions } from "../redux/features/financeSlice";
import SwitchUser from "../components/SwitchUser";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const CATEGORY_COLORS = ["#8B5CF6", "#EC4899", "#3B82F6", "#10B981", "#F59E0B"];

const Homepage = () => {
  const transactions = useSelector(selectTransactions);
  const user = useSelector((state) => state.auth?.user);

  const CURRENT_MONTH = "03"; 
  const MONTH_LABEL = "March";

  const currentMonthStats = useMemo(() => {
    const monthData = transactions.filter(t => t.date.includes(`-${CURRENT_MONTH}-2026`));
    const income = monthData.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = monthData.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { balance: income - expenses, income, expenses };
  }, [transactions]);

  const trendData = useMemo(() => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = ["01", "02", "03"];
    return days.map((day) => {
      const entry = { day };
      months.forEach((m) => {
        const monthTransactions = transactions.filter(t => t.date.includes(`-${m}-2026`));
        let runningTotal = 0;
        monthTransactions.forEach(t => {
          const tDay = parseInt(t.date.split('-')[0]);
          if (tDay <= day) runningTotal += (t.type === 'income' ? t.amount : -t.amount);
        });
        if (monthTransactions.length > 0) entry[`month_${m}`] = runningTotal;
      });
      return entry;
    });
  }, [transactions]);

  const pieData = useMemo(() => {
    const groups = transactions
      .filter(t => t.type === "expense" && t.date.includes(`-${CURRENT_MONTH}-2026`))
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const formatINR = (v) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F9FBFF] text-slate-800">

      <Navbar/>
      
      <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {/* HEADER: WELCOME TOP LEFT */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Hello, {user?.name.split(" ")[0]}! 👋</h1>
            <p className="text-sm text-slate-400 font-medium">Welcome back to your financial overview.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <SwitchUser />
            <div className="flex items-center gap-3 bg-white p-1.5 pr-5 rounded-full border border-slate-100 shadow-sm">
              <img src={user?.avatar} className="w-9 h-9 rounded-full border-2 border-indigo-50" alt="profile" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 leading-tight">{user?.name}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{user?.currentRole}</span>
              </div>
            </div>
          </div>
        </header>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-linear-to-br from-indigo-600 to-violet-700 p-7 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Monthly Balance</p>
            <h2 className="text-3xl font-black">{formatINR(currentMonthStats.balance)}</h2>
            <Wallet className="absolute -right-4 -bottom-4 opacity-10 w-28 h-28 rotate-12 transition-transform group-hover:scale-110" />
          </div>
          <SummaryCard title={`${MONTH_LABEL} Income`} val={formatINR(currentMonthStats.income)} icon={<ArrowUpRight />} color="text-emerald-500" />
          <SummaryCard title={`${MONTH_LABEL} Spending`} val={formatINR(currentMonthStats.expenses)} icon={<ArrowDownRight />} color="text-rose-500" />
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-stretch">
          <Link to='/statistics' className="lg:col-span-8 bg-white p-7 rounded-[2.5rem] border border-slate-50 shadow-sm hover:scale-101 transition">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-bold text-slate-800 text-lg">Wealth Progression</h3>
              <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest">
                <span className="flex items-center gap-1.5 text-slate-300"><div className="w-2 h-2 rounded-full bg-slate-200"/> JAN</span>
                <span className="flex items-center gap-1.5 text-indigo-300"><div className="w-2 h-2 rounded-full bg-indigo-200"/> FEB</span>
                <span className="flex items-center gap-1.5 text-pink-500"><div className="w-2 h-2 rounded-full bg-pink-500 shadow-sm shadow-pink-200"/> MAR</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} tickFormatter={v => `₹${v/1000}k`} />
                  <Tooltip contentStyle={{ borderRadius: "18px", border: "none", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)" }} />
                  <Line type="monotone" dataKey="month_01" stroke="#E2E8F0" strokeWidth={2} dot={false} connectNulls strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="month_02" stroke="#C7D2FE" strokeWidth={2} dot={false} connectNulls />
                  <Line type="monotone" dataKey="month_03" stroke="#EC4899" strokeWidth={4} dot={{ r: 4, fill: '#EC4899', strokeWidth: 2, stroke: '#fff' }} connectNulls activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Link>

          <Link to='/statistics' className="lg:col-span-4 bg-white p-7 rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col hover:scale-101 transition">
            <h3 className="font-bold text-slate-800 text-center mb-6">Spending Analysis</h3>
            <div className="h-44 relative mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={55} outerRadius={75} paddingAngle={6} dataKey="value" stroke="none">
                    {pieData.map((_, i) => <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Spent</span>
                <span className="font-black text-sm text-slate-700">{formatINR(currentMonthStats.expenses)}</span>
              </div>
            </div>
            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-40 pr-1">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                    <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-800 transition-colors">{item.name}</span>
                  </div>
                  <span className="text-[11px] font-black text-slate-800">{Math.round((item.value / currentMonthStats.expenses) * 100)}%</span>
                </div>
              ))}
            </div>
          </Link>
        </div>

        {/* RECENT TRANSACTIONS GRID */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-lg text-slate-800">Recent Transactions</h3>
            <Link to='/transaction' className="text-xs font-bold text-indigo-600 hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {transactions.slice(0, 4).map((t) => (
              <div key={t.id} className="p-5 rounded-3xl bg-[#FBFCFF] border border-slate-50 flex items-center gap-4 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 group">
                <div className={`p-3.5 rounded-2xl transition-colors ${t.type === "income" ? "bg-emerald-50 text-emerald-500" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500"}`}>
                  <CreditCard size={20} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-black text-slate-800 truncate">{t.description}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{t.date}</p>
                </div>
                <p className={`text-xs font-black ${t.type === "income" ? "text-emerald-500" : "text-slate-700"}`}>
                  {t.type === "income" ? "+" : "-"}₹{t.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

const SummaryCard = ({ title, val, icon, color }) => (
  <div className="bg-white p-7 rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center justify-between hover:translate-y-1 transition-all duration-300">
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h2 className="text-2xl font-black text-slate-800">{val}</h2>
    </div>
    <div className={`p-4 rounded-2xl bg-slate-50 shadow-inner ${color}`}>{icon}</div>
  </div>
);

export default Homepage;