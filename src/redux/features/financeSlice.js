import { createSelector, createSlice } from "@reduxjs/toolkit"
import { initialData } from "../../data/mockData"

const financeSlice = createSlice({
  name: "finance",
  initialState: initialData,
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
    },
    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter(
        (item) => item.id !== action.payload,
      );
    },
    updateTransaction: (state, action) => {
      const index = state.transactions.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
  },
});

export const { addTransaction, deleteTransaction, updateTransaction } = financeSlice.actions;
export default financeSlice.reducer;

// Selectors

export const selectTransactions = (state) => state.finance.transactions;
export const selectUser = (state) => state.finance.user;

export const selectFinanceSummary = createSelector(
  [selectTransactions],

  (transactions) => {
    const income = transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);
    console.log("total income", income);

    const expenses = transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);
    console.log("total expenses", expenses);

    return {
      totalBalance: income - expenses,
      totalIncome: income,
      totalExpenses: expenses,
    };
  },
);
