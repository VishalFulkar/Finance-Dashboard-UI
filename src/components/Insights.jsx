import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectTransactions } from '../redux/features/financeSlice';
import { Lightbulb, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

// "YYYY-MM" from ISO string
const getYearMonth = (iso) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

// Get previous month as "YYYY-MM"
const getPrevMonth = (ym) => {
  const [year, month] = ym.split('-').map(Number);
  const d = new Date(year, month - 2, 1); // month-2 because getMonth is 0-indexed
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

// "YYYY-MM" → "May 2026"
const formatMonthLabel = (ym) => {
  const [year, month] = ym.split('-');
  return new Date(year, parseInt(month) - 1)
    .toLocaleString('default', { month: 'long' });
};

const Insights = () => {
  const transactions = useSelector(selectTransactions);

  // Use the most recent month that has data (not necessarily current calendar month)
  const currentMonth = useMemo(() => {
    if (!transactions.length) return getYearMonth(new Date().toISOString());
    const months = [...new Set(transactions.map(t => getYearMonth(t.date)))].sort();
    return months[months.length - 1]; // most recent month with data
  }, [transactions]);

  const prevMonth = getPrevMonth(currentMonth);

  const { currentExpenses, prevExpenses, currentIncome, topCategory, savingsRate, percentChange, isSpendingMore } = useMemo(() => {
    const curr = transactions.filter(t => getYearMonth(t.date) === currentMonth);
    const prev = transactions.filter(t => getYearMonth(t.date) === prevMonth);

    const currentExpenses = curr.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const prevExpenses    = prev.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const currentIncome   = curr.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);

    // Highest spending category this month
    const categoryTotals = curr
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});

    const topCategory = Object.keys(categoryTotals).length > 0
      ? Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b)
      : 'N/A';

    // Month-over-Month spending change
    const diff = currentExpenses - prevExpenses;
    const isSpendingMore = diff > 0;
    const percentChange = prevExpenses > 0
      ? Math.abs((diff / prevExpenses) * 100).toFixed(1)
      : currentExpenses > 0 ? '100' : '0';

    // Savings rate for current month
    const savingsRate = currentIncome > 0
      ? (((currentIncome - currentExpenses) / currentIncome) * 100).toFixed(1)
      : 0;

    return { currentExpenses, prevExpenses, currentIncome, topCategory, savingsRate, percentChange, isSpendingMore };
  }, [transactions, currentMonth, prevMonth]);

  const currLabel = formatMonthLabel(currentMonth);
  const prevLabel = formatMonthLabel(prevMonth);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mx-3 mb-4">

      {/* Insight 1: Top Spending Category */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 shadow-sm">
        <Lightbulb className="text-amber-600 mt-1 shrink-0" size={20} />
        <div>
          <h4 className="font-bold text-amber-900 text-sm">Top Category · {currLabel}</h4>
          <p className="text-amber-800 text-xs mt-1">
            <span className="font-bold uppercase text-amber-900">{topCategory}</span> is your biggest expense this month.
            Reviewing this could save you the most.
          </p>
        </div>
      </div>

      {/* Insight 2: Month-over-Month Change */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 shadow-sm ${isSpendingMore ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
        {isSpendingMore
          ? <TrendingUp  className="text-red-600   mt-1 shrink-0" size={20} />
          : <TrendingDown className="text-green-600 mt-1 shrink-0" size={20} />
        }
        <div>
          <h4 className={`font-bold text-sm ${isSpendingMore ? 'text-red-900' : 'text-green-900'}`}>
            {currLabel} vs {prevLabel}
          </h4>
          <p className={`text-xs mt-1 ${isSpendingMore ? 'text-red-800' : 'text-green-800'}`}>
            You spent <span className="font-bold">{percentChange}% {isSpendingMore ? 'more' : 'less'}</span> than {prevLabel}.
            {isSpendingMore ? ' Watch your budget!' : ' Great job saving!'}
          </p>
        </div>
      </div>

      {/* Insight 3: Savings Rate */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3 shadow-sm">
        <Wallet className="text-blue-600 mt-1 shrink-0" size={20} />
        <div>
          <h4 className="font-bold text-blue-900 text-sm">Savings Rate · {currLabel}</h4>
          <p className="text-blue-800 text-xs mt-1">
            You are saving <span className="font-bold">{savingsRate}%</span> of your {currLabel} income.
            {parseFloat(savingsRate) >= 20 ? ' Excellent financial health! 🎉' : ' Aim for 20% savings.'}
          </p>
        </div>
      </div>

    </div>
  );
};

export default Insights;