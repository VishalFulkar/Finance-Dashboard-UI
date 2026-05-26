const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser')

const authRoutes = require("./routes/auth.routes")
const transactionRoutes = require("./routes/transaction.routes")

const app = express();

//Middleware
let frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
if (frontendUrl.endsWith('/')) {
    frontendUrl = frontendUrl.slice(0, -1);
}

app.use(cors({
    origin: frontendUrl,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

//Routes
app.get("/", (req, res) => {
    res.json({
        status: "healthy",
        message: "FinFlow Backend API is running successfully!"
    });
});

app.use("/api/auth",authRoutes)
app.use("/api/transaction",transactionRoutes)

module.exports = app;