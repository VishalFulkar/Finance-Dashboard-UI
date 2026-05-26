const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser')

const authRoutes = require("./routes/auth.routes")
const transactionRoutes = require("./routes/transaction.routes")

const app = express();

//Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/auth",authRoutes)
app.use("/api/transaction",transactionRoutes)

module.exports = app;