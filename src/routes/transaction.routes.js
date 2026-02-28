const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")

const transactionRoutes = express.Router()
const transactionController = require("../controllers/transaction.controller")

/**
 * - POST /api/transactions/
 * - Create a new transaction
 */

transactionRoutes.post("/",authMiddleware.authMiddleware,transactionController.createTransaction)


/**
 * - POST /api/transactions/system/initial-funds
 * - Create initial funds transaction from system user
 */
transactionRoutes.post("/system/initial-funds",authMiddleware.authSystemUserMiddleware,transactionController.createInitialFundsTransaction)

module.exports = transactionRoutes;