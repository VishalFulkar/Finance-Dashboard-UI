import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api";

// ─── Async Thunks ───────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await api.post('/auth/login', credentials);
            return data.user;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (formData, { rejectWithValue }) => {
        try {
            const data = await api.postForm('/auth/register', formData);
            return data.user;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await api.get('/auth/logout');
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const getMe = createAsyncThunk(
    'auth/getMe',
    async (_, { rejectWithValue }) => {
        try {
            const data = await api.get('/auth/me');
            return data.user;
        } catch {
            return rejectWithValue('Not authenticated');
        }
    }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
        initialized: false, // true once getMe resolves (success or fail)
    },
    reducers: {
        clearError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending,   (state) => { state.loading = true;  state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
            .addCase(loginUser.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

            // Register
            .addCase(registerUser.pending,   (state) => { state.loading = true;  state.error = null; })
            .addCase(registerUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
            .addCase(registerUser.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

            // Logout
            .addCase(logoutUser.fulfilled, (state) => { state.user = null; })

            // Get current user (on page refresh)
            .addCase(getMe.pending,   (state) => { state.loading = true; })
            .addCase(getMe.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.initialized = true;
            })
            .addCase(getMe.rejected, (state) => {
                state.loading = false;
                state.initialized = true; // Still initialized, just not logged in
            })
    }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
