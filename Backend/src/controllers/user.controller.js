const followModel = require("../models/follow.model")
const userModel = require("../models/user.model")
const postModel = require("../models/post.model")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

async function followUserController(req, res) {

    const followerUsername = req.user.username
    const followeeUsername = req.params.username


    if (followerUsername == followeeUsername) {
        return res.status(400).json({
            message: "You cannot follow yourself"
        })
    }

    const isFolloweeExists = await userModel.findOne({
        username: followeeUsername
    })

    if(!isFolloweeExists){
        return res.status(404).json({
            message: "The user you are trying to follow does not exist"
        })
    }

    let isUserAlreadyFollowing = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if(isUserAlreadyFollowing){
        return res.status(200).json({
            message: `You are already following ${followeeUsername}`,
            follow: isUserAlreadyFollowing
        })
    }

    const followRecord = await followModel.create({
        follower: followerUsername,
        followee: followeeUsername
    })

    res.status(201).json({
        message: `${followerUsername} is now following ${followeeUsername}`,
        follow: followRecord
    })



}

async function unfollowUserController(req, res) {

    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    const isUserFollowing = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if (!isUserFollowing) {
        return res.status(400).json({
            message: `You are not following ${followeeUsername}`
        })
    }

    await followModel.findByIdAndDelete(isUserFollowing._id)

    res.status(200).json({
        message: `You have unfollowed ${followeeUsername}`
    })
}

async function getUserProfileController(req, res) {
    try {
        const username = req.params.username;
        const requestingUser = req.user.username;
        
        const user = await userModel.findOne({ username }).lean();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const followersCount = await followModel.countDocuments({ followee: username });
        const followingCount = await followModel.countDocuments({ follower: username });
        
        let posts = await postModel.find({ user: user._id }).sort({ _id: -1 }).lean();
        
        posts = await Promise.all(posts.map(async (post) => {
            const isLiked = await followModel.db.model('likes').findOne({
                user: requestingUser,
                post: post._id
            });
            const likeCount = await followModel.db.model('likes').countDocuments({
                post: post._id
            });
            return { ...post, isLiked: Boolean(isLiked), likeCount };
        }));

        let isFollowing = false;
        if (requestingUser !== username) {
            const followRecord = await followModel.findOne({ follower: requestingUser, followee: username });
            isFollowing = !!followRecord;
        }

        res.status(200).json({
            message: "Profile fetched successfully",
            profile: {
                ...user,
                followersCount,
                followingCount,
                postsCount: posts.length,
                isFollowing
            },
            posts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function searchUsersController(req, res) {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const users = await userModel.find({
            username: { $regex: query, $options: "i" }
        }).select("username profileImage name bio").lean();

        res.status(200).json({
            message: "Users fetched successfully",
            users
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getAllUsersController(req, res) {
    try {
        const currentUsername = req.user.username;
        const users = await userModel.find({
            username: { $ne: currentUsername }
        }).select("username profileImage bio").sort({ _id: -1 }).lean();

        res.status(200).json({
            message: "All users fetched successfully",
            users
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateProfilePicController(req, res) {
    try {
        const username = req.user.username;
        
        if (!req.file) {
            return res.status(400).json({ message: "No image provided" });
        }

        const file = await imagekit.files.upload({
            file: await toFile(Buffer.from(req.file.buffer), "file"),
            fileName: `${username}-profile-pic`,
            folder: "insta-clone-profiles"
        });

        const user = await userModel.findOneAndUpdate(
            { username },
            { profileImage: file.url },
            { new: true }
        );

        res.status(200).json({
            message: "Profile picture updated successfully",
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateUserProfileController(req, res) {
    try {
        const oldUsername = req.user.username;
        const { username, bio } = req.body;

        if (username && username !== oldUsername) {
            const existingUser = await userModel.findOne({ username });
            if (existingUser) {
                return res.status(409).json({ message: "Username already exists" });
            }
        }

        const user = await userModel.findOneAndUpdate(
            { username: oldUsername },
            { username: username || oldUsername, bio },
            { new: true }
        );

        let token = req.cookies.token;

        if (username && username !== oldUsername) {
            const jwt = require("jsonwebtoken");
            token = jwt.sign(
                { id: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );
            res.cookie("token", token);
            
            // Also update likes and follows to use new username
            const likeModel = require("../models/like.model");
            await likeModel.updateMany({ user: oldUsername }, { user: username });
            await followModel.updateMany({ follower: oldUsername }, { follower: username });
            await followModel.updateMany({ followee: oldUsername }, { followee: username });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                username: user.username,
                email: user.email,
                bio: user.bio,
                profileImage: user.profileImage
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    followUserController,
    unfollowUserController,
    getUserProfileController,
    searchUsersController,
    getAllUsersController,
    updateProfilePicController,
    updateUserProfileController
}