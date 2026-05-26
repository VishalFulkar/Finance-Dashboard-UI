const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, "Date is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Transaction amount cannot be negative"]
    },
    category: {
        type: String,
        enum: {
            values: ["Food", "Income", "Housing", "Shopping", "Transport", "Entertainment", "Utilities", "Health"],
            message: "Category must be one of the following: Food, Income, Housing, Shopping, Transport, Entertainment, Utilities, Health"
        },
        required: [true, "Category is required"]
    },
    type: {
        type: String,
        enum: {
            values: ["income", "expense"],
            message: "Type must be income or expense"
        },
        required: [true, "Type is required"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User is required"]
    }
})

const transactionModel = mongoose.model("transactions", transactionSchema)
module.exports = transactionModel;