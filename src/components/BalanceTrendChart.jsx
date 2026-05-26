import React, { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useSelector } from 'react-redux';
import { Calendar } from 'lucide-react';
import { selectTransactions } from '../redux/features/financeSlice';

// "YYYY-MM" from ISO string
const getYearMonth = (iso) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

// "YYYY-MM" → "May 2026"
const formatMonthLabel = (ym) => {
  const [year, month] = ym.split('-');
  return new Date(year, parseInt(month) - 1)
    .toLocaleString('default', { month: 'short', year: 'numeric' });
};

// ISO → "05 Jan" for X-axis tick label
const formatDayLabel = (iso) => {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')} ${d.toLocaleString('default', { month: 'short' })}`;
};

const BalanceTrendChart = ({ selectedMonth, onMonthChange }) => {
  const transactions = useSelector(selectTransactions);

  // Build dynamic month options from actual data (newest first)
  const monthOptions = useMemo(() => {
    const unique = [...new Set(transactions.map(t => getYearMonth(t.date)))];
    return unique.sort().reverse();
  }, [transactions]);

  // If parent hasn't set a real month yet, use most recent
  const currentYM = getYearMonth(new Date().toISOString());
  const activeMonth = (!selectedMonth || selectedMonth === 'all')
    ? (monthOptions.includes(currentYM) ? currentYM : monthOptions[0] || currentYM)
    : selectedMonth;

  const chartData = useMemo(() => {
    if (!transactions?.length) return [];

    let runningBalance = 0;

    return transactions
      .filter(t => getYearMonth(t.date) === activeMonth)
      .sort((a, b) => new Date(a.date) - new Date(b.date)) // oldest first for running balance
      .map(t => {
        runningBalance += t.type === 'income' ? t.amount : -t.amount;
        return {
          label: formatDayLabel(t.date), // "05 Jan"
          balance: runningBalance,
        };
      });
  }, [transactions, activeMonth]);

  const finalBalance = chartData[chartData.length - 1]?.balance || 0;

  return (
    <div className="mx-2 mt-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:mx-3 md:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-gray-900">Balance Trend</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Wealth Growth</p>
        </div>

        <div className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 sm:w-auto">
          <Calendar size={14} className="text-gray-400" />
          <select
            value={activeMonth}
            onChange={(e) => onMonthChange?.(e.target.value)}
            className="w-full cursor-pointer bg-transparent text-xs font-bold text-gray-700 outline-none"
          >
            {monthOptions.map(ym => (
              <option key={ym} value={ym}>{formatMonthLabel(ym)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-64 w-full md:h-72">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-400 text-sm font-medium">
            No transactions for this month.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748B' }}
                minTickGap={25}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748B' }}
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
              />

              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Balance']}
              />

              <Area
                type="monotone"
                dataKey="balance"
                stroke="#2563EB"
                strokeWidth={2.5}
                fill="url(#balanceGradient)"
                dot={{ r: 3, fill: '#2563EB', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
        <p className="text-[10px] font-medium text-slate-400">Live data sync</p>
        {chartData.length > 0 && (
          <p className="text-xs font-medium text-slate-500">
            Closing: <span className="font-bold text-blue-600">₹{finalBalance.toLocaleString('en-IN')}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default BalanceTrendChart;