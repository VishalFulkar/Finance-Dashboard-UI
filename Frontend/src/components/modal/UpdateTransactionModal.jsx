import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTransactionAPI } from '../../redux/features/financeSlice';
import { X } from 'lucide-react';

const CATEGORIES = ['Food', 'Housing', 'Salary', 'Shopping', 'Utilities', 'Transport', 'Health', 'Entertainment', 'Income', 'Other'];

const UpdateTransactionModal = ({ isOpen, onClose, transaction }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(transaction ? {
    description: transaction.description,
    amount: transaction.amount,
    category: transaction.category,
    type: transaction.type,
    // Convert ISO date to YYYY-MM-DD for the date input
    date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : '',
  } : {});

  if (!isOpen || !transaction) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await dispatch(updateTransactionAPI({
      id: transaction._id,
      data: { ...formData, amount: parseFloat(formData.amount) }
    }));
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Transaction</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              required
              type="text"
              value={formData.description}
              className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
              <input
                required
                type="number"
                min="1"
                value={formData.amount}
                className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                className="w-full border rounded-lg p-2.5 bg-white"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              className="w-full border rounded-lg p-2.5 bg-white outline-none"
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              required
              type="date"
              value={formData.date}
              className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors mt-4"
          >
            {loading ? 'Saving...' : 'Update Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateTransactionModal;
