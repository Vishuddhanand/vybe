import React, { useState, useRef } from 'react'
import "../style/createPost.scss"
import { usePost } from '../hooks/usePost'
import { useNavigate } from 'react-router'
import Sidebar from '../components/Sidebar'

const CreatePost = () => {
    const [caption, setCaption] = useState("")
    const [previewUrl, setPreviewUrl] = useState(null)
    const postImageRef = useRef(null)

    const navigate = useNavigate()

    const { loading, handleCreatePost } = usePost()

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };


    async function handleSubmit(e) {
        e.preventDefault()

        const file = postImageRef.current.files[0]
        if (!file) return;

        await handleCreatePost(file, caption)
        navigate('/')
    }

    if (loading) {
        return (
            <main className="create-post-page page-layout">
                <Sidebar />
                <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                </div>
            </main>
        )
    }

    return (
        <main className="create-post-page page-layout">
            <Sidebar />
            <div className="content">
                <h1>Create Post</h1>
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        {!previewUrl ? (
                            <label className="select-postImage-label" htmlFor="postImage">
                                <i className="ri-image-add-line"></i> Select Image
                            </label>
                        ) : (
                            <div className="image-preview" onClick={() => postImageRef.current.click()}>
                                <img src={previewUrl} alt="Preview" />
                                <div className="overlay"><i className="ri-image-edit-line"></i> Change Image</div>
                            </div>
                        )}
                        <input onChange={handleImageChange} ref={postImageRef} accept="image/*" type="file" hidden name='postImage' id='postImage' />
                        <input
                            value={caption}
                            onInput={(e) => setCaption(e.target.value)}
                            type="text" name='caption' id='caption' placeholder='Enter caption' />
                        <button disabled={!previewUrl}>Create Post</button>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default CreatePost
