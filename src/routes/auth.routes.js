const express = require("express")
const authController = require("../controllers/auth.controller")
const router = express.Router()

// Controller = “What should happen when this API endpoint is called?”
// routes → controllers(logic) → models → database

//           /api/auth/register
router.post("/register",authController.userRegisterController)
router.post("/login",authController.userLoginController)
router.post("/logout",authController.userLogoutController)

module.exports = router