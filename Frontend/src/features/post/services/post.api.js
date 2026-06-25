import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export async function getFeed() {
    const response = await api.get("/api/posts/feed")
    return response.data

}

export async function createPost(postImage, caption) {

    const formData = new FormData()
    formData.append("image", postImage)
    formData.append("caption", caption)

    const response = await api.post("/api/posts", formData)

    return response.data
}

export async function likePost(postId) {
    const response = await api.post(`/api/posts/like/${postId}`)
    
    return response.data
}

export async function unlikePost(postId) {
    const response = await api.post(`/api/posts/unlike/${postId}`)
    return response.data
}

export async function deletePost(postId) {
    const response = await api.delete(`/api/posts/${postId}`)
    return response.data
}