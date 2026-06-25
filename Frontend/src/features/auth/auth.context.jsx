/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import { register, login, getMe } from "./services/auth.api";

export const AuthContext = createContext()

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const response = await getMe()
                setUser(response.user)
            } catch (err) {
                console.log("Not logged in or error:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchMe()
    }, [])

    const handleRegister = async (username, email, password) => {
        setLoading(true)
        try {
            const response = await register(username, email, password)
            setUser(response.user)
        }
        catch (err) {
            console.log(err)
            throw err;
        }
        finally {
            setLoading(false)
        }
    }

    const handleLogin = async (username, password) => {
        setLoading(true)
        try {
            const response = await login(username, password)
            setUser(response.user)
        }
        catch (err) {
            console.log(err)
            throw err;
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, handleRegister, handleLogin }}>
            {children}
        </AuthContext.Provider>
    )

}