import { configureStore } from "@reduxjs/toolkit"
import financeReducer from "./features/financeSlice"
import authReducer from "./features/authSlice"

export const store = configureStore({
    reducer:{
        finance:financeReducer,
        auth: authReducer
    }
})