import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {


    const { loading, handleRegister } = useAuth()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        await handleRegister(username, email, password)

        navigate('/')

    }

    if (loading) {
        return (<main><div className="loading-spinner-container"><div className="loading-spinner"></div></div></main>)
    }

    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        onInput={(e) => setUsername(e.target.value)}
                        type="text"
                        name='username'
                        placeholder='Enter Username' />
                    <input
                        onInput={(e) => setEmail(e.target.value)}
                        type="email"
                        name='email'
                        placeholder='Enter Email' />
                    <input
                        onInput={(e) => setPassword(e.target.value)}
                        type="password"
                        name='password'
                        placeholder='Enter Password' />
                    <button type='submit'>Register</button>
                </form>

                <p>Already have an account? <Link to='/login'>Login</Link></p>
            </div>
        </main>
    )
}

export default Register
