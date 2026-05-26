import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api";

// ─── Async Thunks ───────────────────────────────────────────────────────────

export const fetchTransactions = createAsyncThunk(
    'finance/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await api.get('/transaction/get-transaction');
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const createTransaction = createAsyncThunk(
    'finance/create',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            await api.post('/transaction/add-transaction', data);
            dispatch(fetchTransactions()); // Refresh list after adding
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateTransactionAPI = createAsyncThunk(
    'finance/update',
    async ({ id, data }, { dispatch, rejectWithValue }) => {
        try {
            await api.put(`/transaction/edit-transaction/${id}`, data);
            dispatch(fetchTransactions());
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const deleteTransactionAPI = createAsyncThunk(
    'finance/delete',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            await api.del(`/transaction/delete-transaction/${id}`);
            dispatch(fetchTransactions());
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const financeSlice = createSlice({
    name: 'finance',
    initialState: {
        transactions: [],
        totalBalance: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending,   (state) => { state.loading = true; state.error = null; })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload.transactions;
                state.totalBalance = action.payload.totalBalance;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export default financeSlice.reducer;

// ─── Selectors ───────────────────────────────────────────────────────────────

export const selectTransactions = (state) => state.finance.transactions;
export const selectLoading = (state) => state.finance.loading;

export const selectFinanceSummary = createSelector(
    [selectTransactions],
    (transactions) => {
        const income   = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        return { totalBalance: income - expenses, totalIncome: income, totalExpenses: expenses };
    }
);
