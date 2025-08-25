import React, { useState } from 'react'
import { useStream } from '../contexts/StreamContext'

const Home: React.FC = () => {
  const { login, isAuthenticated } = useStream()
  const [userId, setUserId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId.trim()) return

    setIsLoading(true)
    try {
      await login(userId)
    } catch (error) {
      console.error('Login failed:', error)
      alert('Login failed. Please check your Stream configuration.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="home">
      <h1>Welcome to Stream Feeds & Chat</h1>
      <p>This application demonstrates Stream's Activity Feeds and Chat functionality.</p>

      {!isAuthenticated ? (
        <div className="login-section">
          <h2>Login</h2>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="text"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !userId.trim()}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="login-note">
            Enter any user ID to test the application. The user will be created automatically.
          </p>
        </div>
      ) : (
        <div className="welcome-section">
          <h2>You're logged in!</h2>
          <p>Navigate to Feeds or Chat to start using the application.</p>
        </div>
      )}

      <div className="features">
        <h2>Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Activity Feeds</h3>
            <p>Create, read, and interact with activity feeds using Stream's JavaScript SDK.</p>
          </div>
          <div className="feature-card">
            <h3>Real-time Chat</h3>
            <p>Connect with other users through real-time chat functionality.</p>
          </div>
          <div className="feature-card">
            <h3>User Management</h3>
            <p>Authenticate users and manage their profiles and relationships.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
