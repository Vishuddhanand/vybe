const express = require("express")
const authController = require("../controllers/auth.controller")
const authRouter = express.Router()
const identifyUser = require("../middlewares/auth.middleware")



authRouter.post("/register", authController.registerController)


authRouter.post("/login", authController.loginController)


/**
 * @route GET /api/auth/ get-me
 * @desc Get the user details of the logged in user
 * @access Private
 */

authRouter.get("/get-me", identifyUser, authController.getMeController)

authRouter.post("/logout", authController.logoutController)

module.exports = authRouter
