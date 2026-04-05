import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectTransactions, deleteTransaction } from "../redux/features/financeSlice";
import { Trash2, Search, Plus, SquarePen, Download, Calendar, Filter } from "lucide-react";
import AddTransactionModal from "./modal/AddTransactionModal";
import UpdateTransactionModal from "./modal/UpdateTransactionModal";

const TransactionTable = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const user = useSelector((state) => state.auth?.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all"); 

  // Export to CSV 
  const downloadCSV = () => {
    const headers = ["Date,Description,Category,Type,Amount\n"];
    const rows = filteredTransactions.map(t => 
      `${t.date},${t.description},${t.category},${t.type},${t.amount}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Transactions_${selectedMonth}.csv`;
    a.click();
  };

  // Filtering Logic (Search + Type + Month)
  const filteredTransactions = transactions.filter((item) => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesMonth = selectedMonth === "all" || item.date.includes(selectedMonth);

    return matchesSearch && matchesType && matchesMonth;
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm mt-6 mx-3">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Transaction History</h2>
          <p className="text-gray-500 text-sm mt-1">
            Showing {filteredTransactions.length} records {selectedMonth !== 'all' ? `for ${selectedMonth}` : 'overall'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Search Bar */}
          <div className="relative grow md:grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2.5 w-full md:w-64 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Month Filter */}
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl bg-gray-50/50">
            <Calendar size={16} className="text-gray-400" />
            <select
              className="bg-transparent text-sm font-medium outline-none cursor-pointer"
              onChange={(e) => setSelectedMonth(e.target.value)}
              value={selectedMonth}
            >
              <option value="all">Overall Data</option>
              <option value="01-2026">Jan 2026</option>
              <option value="02-2026">Feb 2026</option>
              <option value="03-2026">Mar 2026</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl bg-gray-50/50">
            <Filter size={16} className="text-gray-400" />
            <select
              className="bg-transparent text-sm font-medium outline-none cursor-pointer"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Download Button  */}
            <button 
              onClick={downloadCSV}
              className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-100"
              title="Download CSV"
            >
              <Download size={20} />
            </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-gray-400 text-xs uppercase font-bold tracking-widest">
              <th className="pb-4 px-4">Date</th>
              <th className="pb-4 px-4">Description</th>
              <th className="pb-4 px-4">Category</th>
              <th className="pb-4 px-4 text-right">Amount</th>
              {user?.currentRole === "admin" && <th className="pb-4 px-4 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y-0">
            {filteredTransactions.map((item) => (
              <tr key={item.id} className="group bg-white hover:bg-blue-50/30 transition-all duration-200 shadow-sm border border-gray-100">
                <td className="py-4 px-4 text-sm text-gray-500 rounded-l-xl">{item.date}</td>
                <td className="py-4 px-4 text-sm font-bold text-gray-800">{item.description}</td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-lg">
                    {item.category}
                  </span>
                </td>
                <td className={`py-4 px-4 text-sm font-black text-right ${item.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                  {item.type === "income" ? "+" : "-"} ₹{Math.abs(item.amount).toLocaleString("en-IN")}
                </td>

                {user?.currentRole === "admin" && (
                  <td className="py-4 px-4 text-center rounded-r-xl">
                    <div className="flex justify-center gap-2 ">
                      <button onClick={() => handleEditClick(item)} className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-lg">
                        <SquarePen size={18} />
                      </button>
                      <button onClick={() => dispatch(deleteTransaction(item.id))} className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No records found for the selected filters.</p>
          </div>
        )}
      </div>

      {/* Admin Floating Add Button */}
      {user?.currentRole === "admin" && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 active:scale-95"
          >
            <Plus size={20} weight="bold" />
            <span className="font-bold">Add Transaction</span>
          </button>
        </div>
      )}

      {/* Modals */}
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <UpdateTransactionModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        transaction={selectedTransaction} 
        key={selectedTransaction?.id}
      />
    </div>
  );
};

export default TransactionTable;