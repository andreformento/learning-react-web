import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StreamProvider, useStream } from '../StreamContext'

// Mock the modules
vi.mock('getstream', () => ({
  connect: vi.fn(() => ({
    createUserToken: vi.fn(() => 'mock-user-token'),
    feed: vi.fn(() => ({
      addActivity: vi.fn(),
      get: vi.fn(),
      follow: vi.fn(),
      unfollow: vi.fn(),
      removeActivity: vi.fn()
    })),
    user: vi.fn(() => ({
      create: vi.fn(),
      get: vi.fn(),
      update: vi.fn()
    }))
  })),
  StreamChat: {
    getInstance: vi.fn(() => ({
      connectUser: vi.fn(),
      disconnectUser: vi.fn(),
      channel: vi.fn(() => ({
        sendMessage: vi.fn(),
        watch: vi.fn()
      }))
    }))
  }
}))

// Test component to access context
const TestComponent = () => {
  const { 
    streamClient, 
    chatClient, 
    currentUser, 
    login, 
    logout, 
    isAuthenticated 
  } = useStream()

  return (
    <div>
      <div data-testid="stream-client">{streamClient ? 'has-client' : 'no-client'}</div>
      <div data-testid="chat-client">{chatClient ? 'has-chat' : 'no-chat'}</div>
      <div data-testid="current-user">{currentUser ? currentUser.id : 'no-user'}</div>
      <div data-testid="is-authenticated">{isAuthenticated ? 'true' : 'false'}</div>
      <button onClick={() => login('test-user')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('StreamContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock fetch to return success
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, user: { id: 'test-user' } })
      })
    ) as any
  })

  it('should provide Stream context to children', () => {
    render(
      <StreamProvider>
        <TestComponent />
      </StreamProvider>
    )

    expect(screen.getByTestId('stream-client')).toHaveTextContent('has-client')
    expect(screen.getByTestId('chat-client')).toHaveTextContent('no-chat')
    expect(screen.getByTestId('current-user')).toHaveTextContent('no-user')
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false')
  })

  it('should initialize stream client on mount', () => {
    render(
      <StreamProvider>
        <TestComponent />
      </StreamProvider>
    )

    // The connect function should be called with the mocked API key
    expect(vi.mocked(require('getstream').connect)).toHaveBeenCalled()
  })

  it('should handle login successfully', async () => {
    const mockConnectUser = vi.fn().mockResolvedValue(undefined)
    const mockStreamChat = {
      getInstance: vi.fn(() => ({
        connectUser: mockConnectUser,
        disconnectUser: vi.fn(),
        channel: vi.fn()
      }))
    }

    vi.mocked(require('getstream').StreamChat.getInstance).mockReturnValue(mockStreamChat.getInstance() as any)

    render(
      <StreamProvider>
        <TestComponent />
      </StreamProvider>
    )

    const loginButton = screen.getByText('Login')
    loginButton.click()

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'test-user' })
      })
    })

    await waitFor(() => {
      expect(mockConnectUser).toHaveBeenCalledWith(
        { id: 'test-user' },
        'mock-user-token'
      )
    })
  })

  it('should handle logout', async () => {
    const mockDisconnectUser = vi.fn()
    const mockStreamChat = {
      getInstance: vi.fn(() => ({
        connectUser: vi.fn().mockResolvedValue(undefined),
        disconnectUser: mockDisconnectUser,
        channel: vi.fn()
      }))
    }

    vi.mocked(require('getstream').StreamChat.getInstance).mockReturnValue(mockStreamChat.getInstance() as any)

    render(
      <StreamProvider>
        <TestComponent />
      </StreamProvider>
    )

    // First login
    const loginButton = screen.getByText('Login')
    loginButton.click()

    await waitFor(() => {
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true')
    })

    // Then logout
    const logoutButton = screen.getByText('Logout')
    logoutButton.click()

    await waitFor(() => {
      expect(mockDisconnectUser).toHaveBeenCalled()
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false')
    })
  })

  it('should handle login error gracefully', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' })
      })
    ) as any

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <StreamProvider>
        <TestComponent />
      </StreamProvider>
    )

    const loginButton = screen.getByText('Login')
    loginButton.click()

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Login error:', expect.any(Error))
    })

    consoleSpy.mockRestore()
  })
})
