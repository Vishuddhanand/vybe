import React from 'react'
import AppRoutes from './routes/AppRoutes'
import './style.scss'
import { AuthProvider } from './features/auth/auth.context'
import { PostContextProvider } from './features/post/post.context'

const App = () => {
  return (

    <AuthProvider>
      <PostContextProvider>
        <AppRoutes />
      </PostContextProvider>
    </AuthProvider>
  )
}

export default App
