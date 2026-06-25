const express = require("express")
const postRouter = express.Router()
const postController = require("../controllers/post.controller")
const multer = require("multer")
const identifyUser = require("../middlewares/auth.middleware")
const upload = multer({ storage: multer.memoryStorage() })

postRouter.post("/", upload.single("image"), identifyUser, postController.createPostController)

postRouter.get("/", identifyUser, postController.getPostController)

postRouter.get("/details/:postId", identifyUser, postController.getPostDetailsController)

postRouter.post("/like/:postId", identifyUser, postController.likePostController)
postRouter.post("/unlike/:postId", identifyUser, postController.unlikePostController)
    
/**
 * @route GET /api/posts/feed
 * @desc Get the feed of posts for the authenticated user
 * @access Private
 */

postRouter.get("/feed", identifyUser, postController.getFeedController)
postRouter.delete("/:postId", identifyUser, postController.deletePostController)

module.exports = postRouter