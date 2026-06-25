import React from 'react'
import "../style/feed.scss"
import Post from '../components/Post'
import { usePost } from '../hooks/usePost'
import { useEffect } from 'react'
import Sidebar from '../components/Sidebar'

const Feed = () => {

    const { loading, handleGetFeed, feed, handleLikePost, handleUnlikePost, handleDeletePost } = usePost()

    useEffect(function () {
        handleGetFeed()
    }, [])

    if (loading || !feed) {
        return (
            <main className="feed-page page-layout">
                <Sidebar />
                <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                </div>
            </main>
        )
    }

    console.log(feed)


    return (
        <main className="feed-page page-layout">
            <Sidebar />
            <div className="feed">
                <div className="posts">
                    {feed.map(post => {
                        return <Post key={post._id} user={post.user} post={post} loading={loading} handleLikePost={handleLikePost} handleUnlikePost={handleUnlikePost} handleDeletePost={handleDeletePost} />
                    })}
                </div>

            </div>
        </main>
    )
}

export default Feed
