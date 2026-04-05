import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectTransactions } from '../redux/features/financeSlice';
import { TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react';

const SummaryCard = () => {
  const transactions = useSelector(selectTransactions);
  const [selectedMonth, setSelectedMonth] = useState('03-2026'); // Default to March

  // Filter transactions based on selected month (MM-YYYY)
  const filteredTransactions = transactions.filter(item => item.date.includes(selectedMonth));

  // Calculate totals for that specific month
  const totals = filteredTransactions.reduce((acc, item) => {
    if (item.type === 'income') acc.income += item.amount;
    else acc.expenses += item.amount;
    return acc;
  }, { income: 0, expenses: 0 });

  const monthBalance = totals.income - totals.expenses;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: 'Month Balance',
      amount: monthBalance,
      icon: <Wallet className="text-blue-500" />,
      bgColor: 'bg-blue-50',
      textColor: monthBalance >= 0 ? 'text-gray-900' : 'text-red-600'
    },
    {
      title: 'Month Income',
      amount: totals.income,
      icon: <TrendingUp className="text-green-500" />,
      bgColor: 'bg-green-50',
      textColor: 'text-gray-900'
    },
    {
      title: 'Month Expenses',
      amount: totals.expenses,
      icon: <TrendingDown className="text-red-500" />,
      bgColor: 'bg-red-50',
      textColor: 'text-gray-900'
    },
  ];

  return (
    <div className="p-6">
      {/* --- Month Selector Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 ">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Financial Overview</h2>
          <p className="text-sm text-gray-500">Summary for the period of {selectedMonth}</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-gray-200 p-2 rounded-xl shadow-sm">
          <Calendar size={18} className="text-gray-400" />
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer"
          >
            <option value="01-2026">January 2026</option>
            <option value="02-2026">February 2026</option>
            <option value="03-2026">March 2026</option>
          </select>
        </div>
      </div>

      {/* --- Cards Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        {cards.map((card, index) => (
          <div key={index} className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-white hover:shadow-md transition-all duration-300 group">
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
            
            {/* Optional Progress Bar for Expenses */}
            {card.title === 'Month Expenses' && totals.income > 0 && (
              <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
                <div 
                  className="bg-red-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min((totals.expenses / totals.income) * 100, 100)}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


export default SummaryCard;