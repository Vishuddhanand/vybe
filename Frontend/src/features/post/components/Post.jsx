import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { AuthContext } from '../../auth/auth.context'

const Post = ({ user, post, handleLikePost, handleUnlikePost, handleDeletePost }) => {
    const { user: currentUser } = useContext(AuthContext);
    const isOwner = currentUser?.username === user.username;
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState(post.isFollowing);

    // Sync state if post prop changes
    useEffect(() => {
        setIsFollowing(post.isFollowing);
    }, [post.isFollowing]);

    return (
        <div className="post">

            <div className="user">
                <div className="user-info" onClick={() => navigate(`/profile/${user.username}`)}>
                    <div className="img-wrapper">
                        <img src={user.profileImage} alt="profile image" />
                    </div>
                    <p>{user.username}</p>
                </div>
                
                <div className="post-actions">
                    {!isOwner && !isFollowing && (
                        <button className="post-follow-btn" onClick={async () => {
                            const { followUser } = await import('../services/user.api');
                            try {
                                setIsFollowing(true);
                                await followUser(user.username);
                            } catch (e) {
                                setIsFollowing(false);
                                console.error(e);
                            }
                        }}>
                            Follow
                        </button>
                    )}
                    {isOwner && handleDeletePost && (
                        <button className="delete-btn" onClick={() => handleDeletePost(post._id)}>
                            <i className="ri-delete-bin-line"></i>
                        </button>
                    )}
                </div>
            </div>
            <img src={post.imgUrl} alt="post image" />

            <div className="icons">
                <div className="left">
                    <button onClick={() => { post.isLiked ? handleUnlikePost(post._id) : handleLikePost(post._id) }}>
                        <i className={`icon ${post.isLiked ? "ri-heart-3-fill like" : "ri-heart-3-line"}`}></i>
                    </button>
                    <button><i className="ri-chat-3-line icon"></i></button>
                    <button><i className="ri-send-plane-line icon"></i></button>
                </div>
                <div className="right">
                    <button><i className="ri-bookmark-line icon"></i></button>
                </div>
            </div>
            <div className="bottom">
                <div className="likes-count">
                    {post.likeCount || 0} {post.likeCount === 1 ? 'like' : 'likes'}
                </div>
                <div className="caption">
                    <strong onClick={() => navigate(`/profile/${user.username}`)} style={{cursor: 'pointer'}}>{user.username}</strong>
                    {" "}{post.caption}
                </div>
            </div>
        </div>
    )
}

export default Post
