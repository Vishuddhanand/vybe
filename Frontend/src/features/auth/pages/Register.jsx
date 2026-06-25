import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import '../style/form.scss'

const Register = () => {

    const { loading, handleRegister } = useAuth()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            await handleRegister(username, email, password)
            navigate('/')
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed');
        }
    }

    if (loading) {
        return (<main className="auth-page"><div className="loading-spinner-container"><div className="loading-spinner"></div></div></main>)
    }

    return (
        <main className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">Vybe</div>
                <p className="auth-tagline">Sign up to see photos from your friends.</p>
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
                        <i className="ri-mail-line"></i>
                        <input
                            onInput={(e) => setEmail(e.target.value)}
                            type="email"
                            name='email'
                            placeholder='Email' />
                    </div>
                    <div className="input-group">
                        <i className="ri-lock-line"></i>
                        <input
                            onInput={(e) => setPassword(e.target.value)}
                            type="password"
                            name='password'
                            placeholder='Password' />
                    </div>
                    <button type='submit'>Sign Up</button>
                </form>
            </div>
            <div className="auth-switch">
                <p>Already have an account? <Link to='/login'>Log in</Link></p>
            </div>
        </main>
    )
}

export default Register
