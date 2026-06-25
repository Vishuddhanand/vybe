import { getFeed, createPost, likePost, unlikePost, deletePost } from "../services/post.api";
import { useContext } from "react";
import { PostContext } from "../post.context";
import { useEffect } from "react";

export const usePost = () => {
    const context = useContext(PostContext)

    const { loading, setLoading,post, feed, setFeed } = context

    const handleGetFeed = async () => {
        setLoading(true)
        const data = await getFeed()
        setFeed(data.posts)
        setLoading(false)
    }

    const handleCreatePost = async (postImage, caption) => {
        setLoading(true)
        const data = await createPost(postImage, caption)
        setFeed([data.post, ...feed])
        setLoading(false)

    }

    const handleLikePost = async (postId) => {
        
        setFeed(prevFeed => prevFeed.map(p => {
            if (p._id === postId) {
                return { ...p, isLiked: true, likeCount: (p.likeCount || 0) + 1 }
            }
            return p;
        }));

        try {
            await likePost(postId)
        } catch (error) {
            console.error(error);
            
            setFeed(prevFeed => prevFeed.map(p => {
                if (p._id === postId) {
                    return { ...p, isLiked: false, likeCount: Math.max(0, (p.likeCount || 0) - 1) }
                }
                return p;
            }));
        }
    }


    const handleUnlikePost = async (postId) => {
        
        setFeed(prevFeed => prevFeed.map(p => {
            if (p._id === postId) {
                return { ...p, isLiked: false, likeCount: Math.max(0, (p.likeCount || 0) - 1) }
            }
            return p;
        }));

        try {
            await unlikePost(postId)
        } catch (error) {
            console.error(error);
            setFeed(prevFeed => prevFeed.map(p => {
                if (p._id === postId) {
                    return { ...p, isLiked: true, likeCount: (p.likeCount || 0) + 1 }
                }
                return p;
                
            }));
        }
    }
    
    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        

        setFeed(prevFeed => prevFeed.filter(p => p._id !== postId));
        
        try {
            await deletePost(postId);
        } catch (error) {
            console.error(error);
            await handleGetFeed();
        }
    }

    useEffect(function () {
        handleGetFeed()

    }, [])

    return { loading, post, feed, handleGetFeed, handleCreatePost, handleLikePost, handleUnlikePost, handleDeletePost }

}