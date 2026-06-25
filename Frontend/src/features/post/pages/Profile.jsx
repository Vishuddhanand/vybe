import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { AuthContext } from '../../auth/auth.context';
import { getUserProfile, followUser, unfollowUser, updateProfilePic, updateUserProfile } from '../services/user.api';
import { deletePost } from '../services/post.api';
import Sidebar from '../components/Sidebar';
import '../style/profile.scss';

const Profile = () => {
    const { username } = useParams();
    const { user: currentUser, setUser } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    
    // Edit Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ username: '', bio: '' });

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const isOwnProfile = currentUser?.username === username;

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await getUserProfile(username);
            setProfile(data.profile);
            setPosts(data.posts || []);
            setEditForm({ username: data.profile.username, bio: data.profile.bio || '' });
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (username) {
            fetchProfile();
            setIsEditing(false);
        }
    }, [username]);

    const handleFollowToggle = async () => {
        try {
            if (profile.isFollowing) {
                await unfollowUser(username);
                setProfile({ ...profile, isFollowing: false, followersCount: profile.followersCount - 1 });
            } else {
                await followUser(username);
                setProfile({ ...profile, isFollowing: true, followersCount: profile.followersCount + 1 });
            }
        } catch (error) {
            console.error("Failed to toggle follow", error);
        }
    };

    const handleProfilePicChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const data = await updateProfilePic(file);
            setProfile({ ...profile, profileImage: data.user.profileImage });
        
        } catch (error) {
            console.error("Failed to update profile picture", error);
        } finally {
            setUploading(false);
        }
    };

    const handleEditProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await updateUserProfile(editForm);
            setProfile({ ...profile, username: data.user.username, bio: data.user.bio });
            setIsEditing(false);
            if (data.user.username !== currentUser.username) {
                // Update auth context and navigate to new username URL
                setUser({ ...currentUser, username: data.user.username });
                navigate(`/profile/${data.user.username}`);
            }
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile. Username might be taken.");
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        
        setPosts(posts.filter(p => p._id !== postId));
        setProfile(prev => ({ ...prev, postsCount: prev.postsCount - 1 }));
        
        try {
            await deletePost(postId);
        } catch (error) {
            console.error("Failed to delete post", error);
            fetchProfile();
        }
    };

    if (loading) {
        return (
            <main className="profile-page page-layout">
                <Sidebar />
                <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                </div>
            </main>
        );
    }

    if (!profile) {
        return (
            <main className="profile-page page-layout">
                <Sidebar />
                <div className="error-container">User not found.</div>
            </main>
        );
    }

    return (
        <main className="profile-page page-layout">
            <Sidebar />
            <div className="profile-container">
                <header className="profile-header">
                    <div className="profile-pic-container">
                        <img 
                            src={profile.profileImage || "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png"} 
                            alt={profile.username} 
                            className="profile-pic"
                        />
                        {isOwnProfile && (
                            <div className="edit-pic-overlay" onClick={() => fileInputRef.current.click()}>
                                <span>{uploading ? 'Uploading...' : 'Change'}</span>
                            </div>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            hidden 
                            accept="image/*"
                            onChange={handleProfilePicChange}
                        />
                    </div>
                    
                    <div className="profile-info">
                        {!isEditing ? (
                            <>
                                <div className="profile-actions">
                                    <h2>{profile.username}</h2>
                                    {isOwnProfile ? (
                                        <div className="action-buttons">
                                            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                                        </div>
                                    ) : (
                                        <button 
                                            className={`follow-btn ${profile.isFollowing ? 'following' : ''}`}
                                            onClick={handleFollowToggle}
                                        >
                                            {profile.isFollowing ? 'Unfollow' : 'Follow'}
                                        </button>
                                    )}
                                </div>
                                
                                <div className="profile-stats">
                                    <span><strong>{profile.postsCount}</strong> posts</span>
                                    <span><strong>{profile.followersCount}</strong> followers</span>
                                    <span><strong>{profile.followingCount}</strong> following</span>
                                </div>
                                
                                <div className="profile-bio">
                                    <p>{profile.bio || ""}</p>
                                </div>
                            </>
                        ) : (
                            <form className="edit-profile-form" onSubmit={handleEditProfileSubmit}>
                                <div className="form-change-photo">
                                    <img src={profile.profileImage || "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png"} alt="profile" className="form-profile-pic" />
                                    <button type="button" className="change-photo-btn" onClick={() => fileInputRef.current.click()}>
                                        {uploading ? 'Uploading...' : 'Change Photo'}
                                    </button>
                                </div>
                                <input 
                                    type="text" 
                                    value={editForm.username} 
                                    onChange={(e) => setEditForm({...editForm, username: e.target.value})} 
                                    placeholder="Username"
                                    required 
                                />
                                <textarea 
                                    value={editForm.bio} 
                                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})} 
                                    placeholder="Bio"
                                    rows="3"
                                />
                                <div className="form-actions">
                                    <button type="button" className="cancel-btn" onClick={() => {
                                        setIsEditing(false);
                                        setEditForm({ username: profile.username, bio: profile.bio || '' });
                                    }}>Cancel</button>
                                    <button type="submit" className="save-btn">Save</button>
                                </div>
                            </form>
                        )}
                    </div>
                </header>

                <div className="profile-posts-grid">
                    {posts.length === 0 ? (
                        <div className="no-posts">
                            {isOwnProfile ? (
                                <div>
                                    <h3>Share Photos</h3>
                                    <p>When you share photos, they will appear on your profile.</p>
                                    <button onClick={() => navigate('/create-post')}>Share your first photo</button>
                                </div>
                            ) : (
                                <h3>No posts yet.</h3>
                            )}
                        </div>
                    ) : (
                        posts.map(post => (
                            <div key={post._id} className="grid-item">
                                <img src={post.imgUrl} alt={post.caption || 'Post'} />
                                {isOwnProfile && (
                                    <button className="grid-delete-btn" onClick={() => handleDeletePost(post._id)}>
                                        <i className="ri-delete-bin-line"></i>
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
};

export default Profile;
