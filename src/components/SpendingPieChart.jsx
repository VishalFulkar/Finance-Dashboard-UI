import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useSelector } from 'react-redux';
import { selectTransactions } from '../redux/features/financeSlice';

const COLORS = ['#2563EB', '#7C3AED', '#DB2777', '#EA580C', '#059669', '#4B5563'];

// "YYYY-MM" from ISO string
const getYearMonth = (iso) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

// "YYYY-MM" → "May 2026"
const formatMonthLabel = (ym) => {
  if (!ym || ym === 'all') return 'All Time';
  const [year, month] = ym.split('-');
  return new Date(year, parseInt(month) - 1)
    .toLocaleString('default', { month: 'long', year: 'numeric' });
};

const SpendingPieChart = ({ selectedMonth = 'all' }) => {
  const transactions = useSelector(selectTransactions);

  const chartData = useMemo(() => {
    const filtered = transactions.filter(t =>
      t.type === 'expense' &&
      (selectedMonth === 'all' || getYearMonth(t.date) === selectedMonth)
    );

    const grouped = filtered.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    return Object.keys(grouped)
      .map(name => ({ name, value: grouped[name] }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, selectedMonth]);

  if (chartData.length === 0) {
    return (
      <div className="mx-2 mt-6 flex h-64 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-sm font-medium text-gray-400 md:mx-3">
        No expense data for {formatMonthLabel(selectedMonth)}.
      </div>
    );
  }

  return (
    <div className="mx-2 mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:mx-3">
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900">Spending Breakdown</h3>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {formatMonthLabel(selectedMonth)} · Expenses by Category
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(val) => `₹${val.toLocaleString('en-IN')}`}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: '600' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingPieChart;