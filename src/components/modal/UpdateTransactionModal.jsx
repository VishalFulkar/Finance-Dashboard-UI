import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTransaction } from '../../redux/features/financeSlice';
import { X } from 'lucide-react';

const UpdateTransactionModal = ({ isOpen, onClose, transaction }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(transaction || {
    description: '',
    amount: '',
    category: '',
    type: '',
    date: ''
  });

  if (!isOpen || !transaction) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateTransaction({
      ...formData,
      amount: parseFloat(formData.amount)
    }));
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
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
              <input
                required
                type="number"
                value={formData.amount}
                className="w-full border rounded-lg p-2.5 outline-none"
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select 
                value={formData.type}
                className="w-full border rounded-lg p-2.5 bg-white"
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors mt-4">
            Update Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateTransactionModal;
