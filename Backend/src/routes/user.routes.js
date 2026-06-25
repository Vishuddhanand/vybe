const express = require("express")
const userController = require("../controllers/user.controller")
const identifyUser = require("../middlewares/auth.middleware")
const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() })

const userRouter = express.Router()


userRouter.post("/follow/:username", identifyUser, userController.followUserController)
userRouter.post("/unfollow/:username", identifyUser, userController.unfollowUserController)

userRouter.get("/profile/:username", identifyUser, userController.getUserProfileController)
userRouter.put("/profile", identifyUser, express.json(), userController.updateUserProfileController)
userRouter.get("/search", identifyUser, userController.searchUsersController)
userRouter.put("/profile-pic", identifyUser, upload.single("image"), userController.updateProfilePicController)


module.exports = userRouter