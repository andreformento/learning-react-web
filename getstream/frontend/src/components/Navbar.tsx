import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useStream } from '../contexts/StreamContext'

const Navbar: React.FC = () => {
  const { isAuthenticated, currentUser, logout } = useStream()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Stream App</Link>
      </div>
      <div className="nav-links">
        <Link to="/" className={isActive('/') ? 'active' : ''}>
          Home
        </Link>
        <Link to="/feeds" className={isActive('/feeds') ? 'active' : ''}>
          Feeds
        </Link>
        <Link to="/chat" className={isActive('/chat') ? 'active' : ''}>
          Chat
        </Link>
      </div>
      <div className="nav-auth">
        {isAuthenticated ? (
          <div className="user-info">
            <span>Welcome, {currentUser?.id}</span>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <span>Not logged in</span>
        )}
      </div>
    </nav>
  )
}

export default Navbar
