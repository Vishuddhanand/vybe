import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { searchUsers } from '../services/user.api';
import Sidebar from '../components/Sidebar';
import '../style/search.scss';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        
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

    return (
        <main className="search-page page-layout">
            <Sidebar />
            <div className="search-container">
                <h1>Search Users</h1>
                <form onSubmit={handleSearch} className="search-form">
                    <input 
                        type="text" 
                        placeholder="Search by username..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>

                <div className="search-results">
                    {loading && <div style={{display: 'flex', justifyContent: 'center', padding: '20px'}}><div className="loading-spinner loading-spinner--sm"></div></div>}
                    {!loading && results.length === 0 && query && <p>No users found.</p>}
                    
                    {results.map(user => (
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
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Search;
