import React, { useContext } from 'react';
import { AuthContext } from '../../auth/auth.context';
import { Link } from 'react-router';
import '../style/sidebar.scss';


const Sidebar = () => {
 
    const { user, handleLogout } = useContext(AuthContext);

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <Link to="/">Vybe</Link>
            </div>
            
            <div className="sidebar-nav">
                <Link to="/" className="sidebar-link">
                    <i className="ri-home-5-line icon"></i>
                    <span className="text">Home</span>
                </Link>
                <Link to="/search" className="sidebar-link">
                    <i className="ri-search-line icon"></i>
                    <span className="text">Search</span>
            
                </Link>
                <Link to="/create-post" className="sidebar-link">
                    <i className="ri-add-box-line icon"></i>
                    <span className="text">Create</span>
                </Link>
                <Link to={`/profile/${user?.username}`} className="sidebar-link">
                    <img src={user?.profileImage || "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png"} alt="profile" className="sidebar-profile-pic" />
                    <span className="text">Profile</span>
                </Link>
            </div>

            <div className="sidebar-bottom">
                <button className="logout-btn" onClick={async () => {
                    await handleLogout();
                    window.location.href = '/login';
                }}>
                    <i className="ri-logout-box-r-line icon"></i>
                    <span className="text">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
