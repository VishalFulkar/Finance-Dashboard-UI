import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectTransactions } from '../redux/features/financeSlice';
import { TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react';

// Helper: extract "YYYY-MM" from ISO date string
const getYearMonth = (iso) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

// Helper: "YYYY-MM" → "May 2026"
const formatMonthLabel = (ym) => {
  const [year, month] = ym.split('-');
  return new Date(year, parseInt(month) - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
};

const SummaryCard = () => {
  const transactions = useSelector(selectTransactions);

  // Build sorted unique month list from actual transactions (most recent first)
  const monthOptions = useMemo(() => {
    const unique = [...new Set(transactions.map(t => getYearMonth(t.date)))];
    return unique.sort().reverse();
  }, [transactions]);

  // Default to current real month, fallback to most recent in data
  const currentYearMonth = getYearMonth(new Date().toISOString());
  const defaultMonth = monthOptions.includes(currentYearMonth)
    ? currentYearMonth
    : (monthOptions[0] || currentYearMonth);

  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  // Filter using "YYYY-MM" extracted from ISO date
  const filteredTransactions = transactions.filter(
    t => getYearMonth(t.date) === selectedMonth
  );

  // Calculate totals
  const totals = filteredTransactions.reduce(
    (acc, item) => {
      if (item.type === 'income') acc.income += item.amount;
      else acc.expenses += item.amount;
      return acc;
    },
    { income: 0, expenses: 0 }
  );

  const monthBalance = totals.income - totals.expenses;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  const cards = [
    {
      title: 'Month Balance',
      amount: monthBalance,
      icon: <Wallet className="text-blue-500" />,
      bgColor: 'bg-blue-50',
      textColor: monthBalance >= 0 ? 'text-gray-900' : 'text-red-600',
    },
    {
      title: 'Month Income',
      amount: totals.income,
      icon: <TrendingUp className="text-green-500" />,
      bgColor: 'bg-green-50',
      textColor: 'text-gray-900',
    },
    {
      title: 'Month Expenses',
      amount: totals.expenses,
      icon: <TrendingDown className="text-red-500" />,
      bgColor: 'bg-red-50',
      textColor: 'text-gray-900',
    },
  ];

  return (
    <div className="p-6">
      {/* Header + Month Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Financial Overview</h2>
          <p className="text-sm text-gray-500">
            Summary for {formatMonthLabel(selectedMonth)}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-200 p-2 rounded-xl shadow-sm">
          <Calendar size={18} className="text-gray-400" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer"
          >
            {monthOptions.length === 0 ? (
              <option value={currentYearMonth}>{formatMonthLabel(currentYearMonth)}</option>
            ) : (
              monthOptions.map(ym => (
                <option key={ym} value={ym}>{formatMonthLabel(ym)}</option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-white hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {card.title}
              </span>
              <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${card.bgColor}`}>
                {card.icon}
              </div>
            </div>

            <div className={`text-3xl font-extrabold tracking-tight ${card.textColor}`}>
              {formatCurrency(card.amount)}
            </div>

            {/* Expense progress bar vs income */}
            {card.title === 'Month Expenses' && totals.income > 0 && (
              <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-red-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totals.expenses / totals.income) * 100, 100)}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryCard;