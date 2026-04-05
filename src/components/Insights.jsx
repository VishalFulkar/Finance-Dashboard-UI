import React from 'react';
import { useSelector } from 'react-redux';
import { selectTransactions } from '../redux/features/financeSlice';
import { Lightbulb, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const Insights = () => {
  const transactions = useSelector(selectTransactions);
  
  //Filter data for March vs February 2026
  const marchExpenses = transactions.filter(item => item.date.includes('-03-2026') && item.type === 'expense');
  const febExpenses = transactions.filter(item => item.date.includes('-02-2026') && item.type === 'expense');

  const marchTotal = marchExpenses.reduce((sum, item) => sum + item.amount, 0);
  const febTotal = febExpenses.reduce((sum, item) => sum + item.amount, 0);

  // Calculate MoM (Month over Month) Change
  const diff = marchTotal - febTotal;
  const isSpendingMore = diff > 0;
  const percentChange = febTotal !== 0 ? Math.abs((diff / febTotal) * 100).toFixed(1) : 0;

  //Highest Spending Category (Current Month)
  const categoryTotals = marchExpenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const highestCategory = Object.keys(categoryTotals).reduce((a, b) => 
    categoryTotals[a] > categoryTotals[b] ? a : b, 
    "N/A"
  );

  // Savings Rate Logic
  const totalIncome = transactions
    .filter(item => item.date.includes('-03-2026') && item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
  
  const savingsRate = totalIncome > 0 ? (((totalIncome - marchTotal) / totalIncome) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mx-3 mb-4">
      
      {/* Insight 1: */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 shadow-sm">
        <Lightbulb className="text-amber-600 mt-1 shrink-0" size={20} />
        <div>
          <h4 className="font-bold text-amber-900 text-sm">Top Category</h4>
          <p className="text-amber-800 text-xs mt-1">
            <span className="font-bold uppercase text-amber-900">{highestCategory}</span> is your biggest expense this month. Reviewing this could save you the most.
          </p>
        </div>
      </div>

      {/* Insight 2: */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 shadow-sm ${isSpendingMore ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
        {isSpendingMore ? <TrendingUp className="text-red-600 mt-1 shrink-0" size={20} /> : <TrendingDown className="text-green-600 mt-1 shrink-0" size={20} />}
        <div>
          <h4 className={`font-bold text-sm ${isSpendingMore ? 'text-red-900' : 'text-green-900'}`}>Monthly Change</h4>
          <p className={`text-xs mt-1 ${isSpendingMore ? 'text-red-800' : 'text-green-800'}`}>
            You spent <span className="font-bold">{percentChange}% {isSpendingMore ? 'more' : 'less'}</span> than February. 
            {isSpendingMore ? " Watch your budget!" : " Great job saving!"}
          </p>
        </div>
      </div>

      {/* Insight 3:*/}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3 shadow-sm">
        <Wallet className="text-blue-600 mt-1 shrink-0" size={20} />
        <div>
          <h4 className="font-bold text-blue-900 text-sm">Savings Rate</h4>
          <p className="text-blue-800 text-xs mt-1">
            You are currently saving <span className="font-bold">{savingsRate}%</span> of your March income. 
            {savingsRate > 20 ? " Excellent financial health!" : " Aim for 20% savings."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Insights;