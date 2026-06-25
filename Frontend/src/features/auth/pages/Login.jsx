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
    }

    if (loading) {
        return (<main><div className="loading-spinner-container"><div className="loading-spinner"></div></div></main>)
    }


    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        onInput={(e) => setUsername(e.target.value)}
                        type="text"
                        name='username'
                        placeholder='Enter Username' />
                    <input
                        onInput={(e) => setPassword(e.target.value)}
                        type="password"
                        name='password'
                        placeholder='Enter Password' />
                    <button type='submit'>Login</button>
                </form>
                <p>Don't have an account? <Link to='/register'>Register</Link></p>
            </div>
        </main>
    )
}

export default Login
