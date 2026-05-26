const express = require("express")
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware")
const transactionController = require("../controllers/transaction.controller")

router.post("/add-transaction", authMiddleware.authMiddleware, transactionController.addTransactionController)
router.get("/get-transaction", authMiddleware.authMiddleware, transactionController.getTransactionsController)
router.put("/edit-transaction/:id", authMiddleware.authMiddleware, transactionController.editTransactionController)
router.delete("/delete-transaction/:id", authMiddleware.authMiddleware, transactionController.deleteTransactionController)

module.exports = router;