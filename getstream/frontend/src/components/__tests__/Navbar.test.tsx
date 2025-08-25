import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Navbar from '../Navbar'

// Mock the StreamContext
const mockLogout = vi.fn()
const mockIsAuthenticated = vi.fn(() => false)
const mockCurrentUser = vi.fn(() => null)

vi.mock('../../contexts/StreamContext', () => ({
  useStream: () => ({
    logout: mockLogout,
    isAuthenticated: mockIsAuthenticated(),
    currentUser: mockCurrentUser()
  })
}))

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsAuthenticated.mockReturnValue(false)
    mockCurrentUser.mockReturnValue(null)
  })

  it('should render app title', () => {
    renderWithProviders(<Navbar />)

    expect(screen.getByText('Stream App')).toBeInTheDocument()
  })

  it('should render navigation links', () => {
    renderWithProviders(<Navbar />)

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Feeds' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Chat' })).toBeInTheDocument()
  })

  it('should show "Not logged in" when not authenticated', () => {
    renderWithProviders(<Navbar />)

    expect(screen.getByText('Not logged in')).toBeInTheDocument()
  })

  it('should show user ID when authenticated', () => {
    mockIsAuthenticated.mockReturnValue(true)
    mockCurrentUser.mockReturnValue({ id: 'testuser' })

    renderWithProviders(<Navbar />)

    expect(screen.getByText('testuser')).toBeInTheDocument()
  })

  it('should show logout button when authenticated', () => {
    mockIsAuthenticated.mockReturnValue(true)
    mockCurrentUser.mockReturnValue({ id: 'testuser' })

    renderWithProviders(<Navbar />)

    const logoutButton = screen.getByRole('button', { name: 'Logout' })
    expect(logoutButton).toBeInTheDocument()
  })

  it('should not show logout button when not authenticated', () => {
    renderWithProviders(<Navbar />)

    expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument()
  })

  it('should call logout when logout button is clicked', () => {
    mockIsAuthenticated.mockReturnValue(true)
    mockCurrentUser.mockReturnValue({ id: 'testuser' })

    renderWithProviders(<Navbar />)

    const logoutButton = screen.getByRole('button', { name: 'Logout' })
    fireEvent.click(logoutButton)

    expect(mockLogout).toHaveBeenCalledTimes(1)
  })

  it('should have correct navigation links with proper hrefs', () => {
    renderWithProviders(<Navbar />)

    const homeLink = screen.getByRole('link', { name: 'Home' })
    const feedsLink = screen.getByRole('link', { name: 'Feeds' })
    const chatLink = screen.getByRole('link', { name: 'Chat' })

    expect(homeLink).toHaveAttribute('href', '/')
    expect(feedsLink).toHaveAttribute('href', '/feeds')
    expect(chatLink).toHaveAttribute('href', '/chat')
  })

  it('should have proper CSS classes for styling', () => {
    renderWithProviders(<Navbar />)

    const navbar = screen.getByRole('navigation')
    expect(navbar).toHaveClass('navbar')
  })

  it('should handle multiple logout clicks', () => {
    mockIsAuthenticated.mockReturnValue(true)
    mockCurrentUser.mockReturnValue({ id: 'testuser' })

    renderWithProviders(<Navbar />)

    const logoutButton = screen.getByRole('button', { name: 'Logout' })

    fireEvent.click(logoutButton)
    fireEvent.click(logoutButton)
    fireEvent.click(logoutButton)

    expect(mockLogout).toHaveBeenCalledTimes(3)
  })

  it('should render with different user IDs', () => {
    mockIsAuthenticated.mockReturnValue(true)
    mockCurrentUser.mockReturnValue({ id: 'another-user' })

    renderWithProviders(<Navbar />)

    expect(screen.getByText('another-user')).toBeInTheDocument()
  })
})
