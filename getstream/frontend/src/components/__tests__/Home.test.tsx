import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Home from '../Home'

// Mock the StreamContext
const mockLogin = vi.fn()
const mockIsAuthenticated = vi.fn(() => false)

vi.mock('../../contexts/StreamContext', () => ({
  useStream: () => ({
    login: mockLogin,
    isAuthenticated: mockIsAuthenticated()
  })
}))

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsAuthenticated.mockReturnValue(false)
  })

  it('should render welcome message', () => {
    renderWithProviders(<Home />)
    
    expect(screen.getByText('Welcome to Stream Feeds & Chat')).toBeInTheDocument()
    expect(screen.getByText('This application demonstrates Stream\'s Activity Feeds and Chat functionality.')).toBeInTheDocument()
  })

  it('should render login section when not authenticated', () => {
    renderWithProviders(<Home />)
    
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter User ID')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByText('Enter any user ID to test the application. The user will be created automatically.')).toBeInTheDocument()
  })

  it('should render welcome section when authenticated', () => {
    mockIsAuthenticated.mockReturnValue(true)
    
    renderWithProviders(<Home />)
    
    expect(screen.getByText('You\'re logged in!')).toBeInTheDocument()
    expect(screen.getByText('Navigate to Feeds or Chat to start using the application.')).toBeInTheDocument()
  })

  it('should render features section', () => {
    renderWithProviders(<Home />)
    
    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText('Activity Feeds')).toBeInTheDocument()
    expect(screen.getByText('Real-time Chat')).toBeInTheDocument()
    expect(screen.getByText('User Management')).toBeInTheDocument()
  })

  it('should handle login form submission', async () => {
    mockLogin.mockResolvedValue(undefined)
    
    renderWithProviders(<Home />)
    
    const input = screen.getByPlaceholderText('Enter User ID')
    const button = screen.getByRole('button', { name: 'Login' })
    
    fireEvent.change(input, { target: { value: 'testuser' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser')
    })
  })

  it('should not submit login with empty user ID', () => {
    renderWithProviders(<Home />)
    
    const button = screen.getByRole('button', { name: 'Login' })
    
    fireEvent.click(button)
    
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('should not submit login with whitespace-only user ID', () => {
    renderWithProviders(<Home />)
    
    const input = screen.getByPlaceholderText('Enter User ID')
    const button = screen.getByRole('button', { name: 'Login' })
    
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(button)
    
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('should disable login button when loading', async () => {
    mockLogin.mockImplementation(() => new Promise(() => {})) // Never resolves
    
    renderWithProviders(<Home />)
    
    const input = screen.getByPlaceholderText('Enter User ID')
    const button = screen.getByRole('button', { name: 'Login' })
    
    fireEvent.change(input, { target: { value: 'testuser' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(button).toBeDisabled()
      expect(button).toHaveTextContent('Logging in...')
    })
  })

  it('should handle login error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    
    mockLogin.mockRejectedValue(new Error('Login failed'))
    
    renderWithProviders(<Home />)
    
    const input = screen.getByPlaceholderText('Enter User ID')
    const button = screen.getByRole('button', { name: 'Login' })
    
    fireEvent.change(input, { target: { value: 'testuser' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Login failed:', expect.any(Error))
      expect(alertSpy).toHaveBeenCalledWith('Login failed. Please check your Stream configuration.')
    })
    
    consoleSpy.mockRestore()
    alertSpy.mockRestore()
  })

  it('should show loading state during login', async () => {
    let resolveLogin: () => void
    mockLogin.mockImplementation(() => new Promise(resolve => {
      resolveLogin = resolve
    }))
    
    renderWithProviders(<Home />)
    
    const input = screen.getByPlaceholderText('Enter User ID')
    const button = screen.getByRole('button', { name: 'Login' })
    
    fireEvent.change(input, { target: { value: 'testuser' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(button).toBeDisabled()
      expect(button).toHaveTextContent('Logging in...')
      expect(input).toBeDisabled()
    })
    
    // Resolve the login promise
    resolveLogin!()
    
    await waitFor(() => {
      expect(button).not.toBeDisabled()
      expect(button).toHaveTextContent('Login')
      expect(input).not.toBeDisabled()
    })
  })
})
