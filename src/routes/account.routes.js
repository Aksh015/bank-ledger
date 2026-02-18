const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const accountController = require("../controllers/account.controller")

const router = express.Router()

/**
* FORMAT :   router.METHOD("route", middlewareFunction, controllerFunction)   {middleware is optional}
 */

/**
 * - POST /api/accounts/
 * - Create a new account
 * - Protected Route  =>means token verify needed on each req
 */
router.post("/", authMiddleware.authMiddleware, accountController.createAccountController)


module.exports = router