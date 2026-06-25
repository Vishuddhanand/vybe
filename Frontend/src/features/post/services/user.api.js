import axios from 'axios'

const api = axios.create({
    baseURL: "https://vybe-vn1e.onrender.com",
    withCredentials: true
})

export async function getUserProfile(username) {
    const response = await api.get(`/api/users/profile/${username}`)
    return response.data
}

export async function searchUsers(query) {
    const response = await api.get(`/api/users/search?q=${query}`)
    return response.data
}

export async function getAllUsers() {
    const response = await api.get(`/api/users/all`)
    return response.data
}

export async function followUser(username) {
    const response = await api.post(`/api/users/follow/${username}`)
    return response.data
}

export async function unfollowUser(username) {
    const response = await api.post(`/api/users/unfollow/${username}`)
    return response.data
}

export async function updateProfilePic(file) {
    const formData = new FormData()
    formData.append("image", file)
    const response = await api.put(`/api/users/profile-pic`, formData)
    return response.data
}

export async function updateUserProfile(data) {
    const response = await api.put(`/api/users/profile`, data)
    return response.data
}
