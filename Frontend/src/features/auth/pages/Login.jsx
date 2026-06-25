import React, { useState } from 'react'
import { Link } from 'react-router'
import '../style/form.scss'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'

const Login = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const { handleLogin, loading } = useAuth()
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault()

        handleLogin(username, password)
            .then(res => {
                console.log(res)
                navigate('/')
            })
            .catch(err => {
                alert(err.response?.data?.message || 'Login failed');
            })
    }

    if (loading) {
        return (<main className="auth-page"><div className="loading-spinner-container"><div className="loading-spinner"></div></div></main>)
    }


    return (
        <main className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">Vybe</div>
                <p className="auth-tagline">Connect with the people you love.</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <i className="ri-user-line"></i>
                        <input
                            onInput={(e) => setUsername(e.target.value)}
                            type="text"
                            name='username'
                            placeholder='Username' />
                    </div>
                    <div className="input-group">
                        <i className="ri-lock-line"></i>
                        <input
                            onInput={(e) => setPassword(e.target.value)}
                            type="password"
                            name='password'
                            placeholder='Password' />
                    </div>
                    <button type='submit'>Log In</button>
                </form>
            </div>
            <div className="auth-switch">
                <p>Don't have an account? <Link to='/register'>Sign up</Link></p>
            </div>
        </main>
    )
}

export default Login
