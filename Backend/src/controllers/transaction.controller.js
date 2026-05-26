const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const transactionModel = require("../models/transaction.model")

async function addTransactionController(req, res) {
    try {
        const { date, description, amount, category, type } = req.body;
        if (!date || !description || !amount || !category || !type) {
            return res.status(400).json({
                message: "All fields are required",
                status: "failed"
            })
        }
        const user = req.user;
        const transaction = await transactionModel.create({
            date,
            description,
            amount,
            category,
            type,
            user: user._id
        })
        return res.status(201).json({
            transaction,
            message: "Transaction added successfully",
            status: "success"
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: "failed"
        })
    }
}

async function getTransactionsController(req, res) {
    try {
        const user = req.user;
        const transactions = await transactionModel.find({
            user: user._id
        })

        const totalBalance = transactions.reduce((acc, t) => {
            return t.type === "income" ? acc + t.amount : acc - t.amount
        }, 0)

        return res.status(200).json({
            transactions,
            totalBalance,
            message: "Transactions fetched successfully",
            status: "success"
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: "failed"
        })
    }
}

async function editTransactionController(req, res) {
    try {
        const { date, description, amount, category, type } = req.body;
        if (!date || !description || !amount || !category || !type) {
            return res.status(400).json({
                message: "All fields are required",
                status: "failed"
            })
        }

        // Check transaction exists and belongs to the user
        const existing = await transactionModel.findById(req.params.id)
        if (!existing) {
            return res.status(404).json({ message: "Transaction not found", status: "failed" })
        }
        if (existing.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to edit this transaction", status: "failed" })
        }

        const transaction = await transactionModel.findByIdAndUpdate(
            req.params.id,
            { date, description, amount, category, type },
            { new: true, runValidators: true }
        )
        return res.status(200).json({
            transaction,
            message: "Transaction updated successfully",
            status: "success"
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: "failed"
        })
    }
}

async function deleteTransactionController(req, res) {
    try {
        // Check transaction exists and belongs to the user
        const existing = await transactionModel.findById(req.params.id)
        if (!existing) {
            return res.status(404).json({ message: "Transaction not found", status: "failed" })
        }
        if (existing.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this transaction", status: "failed" })
        }

        await transactionModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({
            message: "Transaction deleted successfully",
            status: "success"
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: "failed"
        })
    }
}

module.exports = { addTransactionController, getTransactionsController, editTransactionController, deleteTransactionController }