const postModel = require("../models/post.model")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")
const jwt = require("jsonwebtoken")
const likeModel = require("../models/like.model")

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})



async function createPostController(req, res) {
    console.log(req.body, req.file)

    const file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), "file"),
        fileName: "Test",
        folder: "insta-clone"
    })


    const post = await postModel.create({
        caption: req.body.caption,
        imgUrl: file.url,
        user: req.user.id
    })

    res.status(201).json({
        message: "post created successfully",
        post
    })


}

async function getPostController(req, res) {


    const userId = req.user.id

    const posts = await postModel.find({
        user: userId
    })


    res.status(200).json({
        message: "Posts fetched successfully",
        posts
    })


}

async function getPostDetailsController(req, res) {

    const userId = req.user.id
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({
            message: "Post not found."
        })
    }

    const isUserValid = post.user.toString() === userId

    if (!isUserValid) {
        return res.status(403).json({
            message: "Forbidden Content"
        })
    }

    return res.status(200).json({
        message: "Post fetched successfully",
        post
    })

}

async function likePostController(req, res) {

    const username = req.user.username
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({
            message: "Post not found."
        })

    }

    const like = await likeModel.create({
        post: postId,
        user: username
    })

    res.status(200).json({
        message: "Post liked successfully",
        like
    })

}

async function unlikePostController(req, res) {
    const username = req.user.username
    const postId = req.params.postId


    const isLiked = await likeModel.findOne({
        post: postId,
        user: username
    })

    if (!isLiked) {
        return res.status(400).json({
            message: "Post is not liked by the user."
        })
    }

    const unlike = await likeModel.findOneAndDelete({
        _id: isLiked._id
    })

    return res.status(200).json({
        message: "Post unliked successfully",
        unlike
    })
}

async function getFeedController(req, res) {

    const user = req.user
    const followModel = require("../models/follow.model")

    const posts = await Promise.all((await postModel.find({}).sort({ _id: -1 }).populate("user").lean())
        .map(async (post) => {

            const isLiked = await likeModel.findOne({
                user: user.username,
                post: post._id
            })
            
            const likeCount = await likeModel.countDocuments({
                post: post._id
            })
            
            const isFollowing = await followModel.findOne({
                follower: user.username,
                followee: post.user.username
            })

            post.isLiked = Boolean(isLiked)
            post.likeCount = likeCount
            post.isFollowing = Boolean(isFollowing)

            return post
        }))



    res.status(200).json({
        message: "Feed fetched successfully",
        posts
    })
}

async function deletePostController(req, res) {
    try {
        const postId = req.params.postId;
        const userId = req.user.id; // user ID from JWT

        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the user is the owner of the post
        if (post.user.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        // Delete associated likes
        await likeModel.deleteMany({ post: postId });

        // Delete the post
        await postModel.findByIdAndDelete(postId);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createPostController,
    getPostController,
    getPostDetailsController,
    likePostController,
    unlikePostController,
    getFeedController,
    deletePostController
}