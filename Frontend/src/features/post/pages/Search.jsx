import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { searchUsers, getAllUsers } from '../services/user.api';
import Sidebar from '../components/Sidebar';
import '../style/search.scss';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const data = await getAllUsers();
                setAllUsers(data.users || []);
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchAllUsers();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            setResults([]);
            return;
        }
        
        setLoading(true);
        try {
            const data = await searchUsers(query);
            setResults(data.users || []);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    const displayUsers = query.trim() ? results : allUsers;
    const hasSearched = query.trim().length > 0;

    return (
        <main className="search-page page-layout">
            <Sidebar />
            <div className="search-container">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-wrapper">
                        <i className="ri-search-line"></i>
                        <input 
                            type="text" 
                            placeholder="Search" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </form>

                {initialLoading ? (
                    <div className="loading-spinner-container" style={{minHeight: '30vh'}}>
                        <div className="loading-spinner"></div>
                    </div>
                ) : (
                    <>
                        {!hasSearched && (
                            <div className="section-header">
                                <h2>Suggested</h2>
                            </div>
                        )}

                        {hasSearched && (
                            <div className="section-header">
                                <h2>Results</h2>
                            </div>
                        )}

                        <div className="search-results">
                            {loading && <div style={{display: 'flex', justifyContent: 'center', padding: '20px'}}><div className="loading-spinner loading-spinner--sm"></div></div>}
                            {!loading && hasSearched && results.length === 0 && <p className="no-results">No users found.</p>}
                            
                            {!loading && displayUsers.map(user => (
                                <div 
                                    key={user._id} 
                                    className="search-result-item"
                                    onClick={() => navigate(`/profile/${user.username}`)}
                                >
                                    <img 
                                        src={user.profileImage || "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png"} 
                                        alt={user.username} 
                                    />
                                    <div className="user-info">
                                        <strong>{user.username}</strong>
                                        {user.bio && <span>{user.bio}</span>}
                                    </div>
                                    <i className="ri-arrow-right-s-line chevron"></i>
                                </div>
                            ))}

                            {!loading && !hasSearched && allUsers.length === 0 && (
                                <p className="no-results">No other users on the platform yet.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};

export default Search;
