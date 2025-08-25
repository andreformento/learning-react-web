import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { StreamProvider } from '../../contexts/StreamContext'
import Chat from '../Chat'

// Mock the StreamContext
const mockChatClient = {
  channel: vi.fn(() => ({
    sendMessage: vi.fn(),
    watch: vi.fn()
  }))
}

const mockIsAuthenticated = true
const mockCurrentUser = { id: 'testuser' }

vi.mock('../../contexts/StreamContext', () => ({
  useStream: () => ({
    chatClient: mockChatClient,
    isAuthenticated: mockIsAuthenticated,
    currentUser: mockCurrentUser
  })
}))

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <StreamProvider>
        {component}
      </StreamProvider>
    </BrowserRouter>
  )
}

describe('Chat Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render chat title', () => {
    renderWithProviders(<Chat />)
    
    expect(screen.getByText('Real-time Chat')).toBeInTheDocument()
  })

  it('should render general channel info', () => {
    renderWithProviders(<Chat />)
    
    expect(screen.getByText('Channel: general')).toBeInTheDocument()
  })

  it('should render messages section', () => {
    renderWithProviders(<Chat />)
    
    expect(screen.getByText('Messages')).toBeInTheDocument()
  })

  it('should render message input form', () => {
    renderWithProviders(<Chat />)
    
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument()
  })

  it('should initialize chat channel on mount', async () => {
    const mockChannel = {
      watch: vi.fn().mockResolvedValue(undefined),
      sendMessage: vi.fn()
    }
    
    mockChatClient.channel.mockReturnValue(mockChannel)
    
    renderWithProviders(<Chat />)
    
    await waitFor(() => {
      expect(mockChatClient.channel).toHaveBeenCalledWith('messaging', 'general')
      expect(mockChannel.watch).toHaveBeenCalled()
    })
  })

  it('should handle message submission', async () => {
    const mockSendMessage = vi.fn().mockResolvedValue({ id: 'msg-1' })
    const mockChannel = {
      watch: vi.fn().mockResolvedValue(undefined),
      sendMessage: mockSendMessage
    }
    
    mockChatClient.channel.mockReturnValue(mockChannel)
    
    renderWithProviders(<Chat />)
    
    const input = screen.getByPlaceholderText('Type your message...')
    const button = screen.getByRole('button', { name: 'Send' })
    
    fireEvent.change(input, { target: { value: 'Hello world!' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        text: 'Hello world!'
      })
    })
  })

  it('should not submit empty message', () => {
    renderWithProviders(<Chat />)
    
    const button = screen.getByRole('button', { name: 'Send' })
    fireEvent.click(button)
    
    expect(mockChatClient.channel).not.toHaveBeenCalled()
  })

  it('should not submit whitespace-only message', () => {
    renderWithProviders(<Chat />)
    
    const input = screen.getByPlaceholderText('Type your message...')
    const button = screen.getByRole('button', { name: 'Send' })
    
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(button)
    
    expect(mockChatClient.channel).not.toHaveBeenCalled()
  })

  it('should clear input after successful message submission', async () => {
    const mockSendMessage = vi.fn().mockResolvedValue({ id: 'msg-1' })
    const mockChannel = {
      watch: vi.fn().mockResolvedValue(undefined),
      sendMessage: mockSendMessage
    }
    
    mockChatClient.channel.mockReturnValue(mockChannel)
    
    renderWithProviders(<Chat />)
    
    const input = screen.getByPlaceholderText('Type your message...')
    const button = screen.getByRole('button', { name: 'Send' })
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(input).toHaveValue('')
    })
  })

  it('should handle message submission error', async () => {
    const mockSendMessage = vi.fn().mockRejectedValue(new Error('Failed to send message'))
    const mockChannel = {
      watch: vi.fn().mockResolvedValue(undefined),
      sendMessage: mockSendMessage
    }
    
    mockChatClient.channel.mockReturnValue(mockChannel)
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    renderWithProviders(<Chat />)
    
    const input = screen.getByPlaceholderText('Type your message...')
    const button = screen.getByRole('button', { name: 'Send' })
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to send message:', expect.any(Error))
    })
    
    consoleSpy.mockRestore()
  })

  it('should show loading state during message submission', async () => {
    let resolveMessage: () => void
    const mockSendMessage = vi.fn().mockImplementation(() => new Promise(resolve => {
      resolveMessage = resolve
    }))
    
    const mockChannel = {
      watch: vi.fn().mockResolvedValue(undefined),
      sendMessage: mockSendMessage
    }
    
    mockChatClient.channel.mockReturnValue(mockChannel)
    
    renderWithProviders(<Chat />)
    
    const input = screen.getByPlaceholderText('Type your message...')
    const button = screen.getByRole('button', { name: 'Send' })
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(button).toBeDisabled()
      expect(button).toHaveTextContent('Sending...')
    })
    
    // Resolve the message promise
    resolveMessage!()
    
    await waitFor(() => {
      expect(button).not.toBeDisabled()
      expect(button).toHaveTextContent('Send')
    })
  })

  it('should handle channel initialization error', async () => {
    const mockChannel = {
      watch: vi.fn().mockRejectedValue(new Error('Failed to initialize channel')),
      sendMessage: vi.fn()
    }
    
    mockChatClient.channel.mockReturnValue(mockChannel)
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    renderWithProviders(<Chat />)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to initialize chat:', expect.any(Error))
    })
    
    consoleSpy.mockRestore()
  })

  it('should handle Enter key press for message submission', async () => {
    const mockSendMessage = vi.fn().mockResolvedValue({ id: 'msg-1' })
    const mockChannel = {
      watch: vi.fn().mockResolvedValue(undefined),
      sendMessage: mockSendMessage
    }
    
    mockChatClient.channel.mockReturnValue(mockChannel)
    
    renderWithProviders(<Chat />)
    
    const input = screen.getByPlaceholderText('Type your message...')
    
    fireEvent.change(input, { target: { value: 'Enter key message' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' })
    
    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        text: 'Enter key message'
      })
    })
  })

  it('should not submit on other key presses', () => {
    renderWithProviders(<Chat />)
    
    const input = screen.getByPlaceholderText('Type your message...')
    
    fireEvent.change(input, { target: { value: 'Other key message' } })
    fireEvent.keyPress(input, { key: 'Space', code: 'Space' })
    
    expect(mockChatClient.channel).not.toHaveBeenCalled()
  })

  it('should display messages from channel', async () => {
    const mockMessages = [
      { id: 'msg-1', text: 'First message', user: { id: 'user1' } },
      { id: 'msg-2', text: 'Second message', user: { id: 'user2' } }
    ]
    
    const mockChannel = {
      watch: vi.fn().mockResolvedValue({
        messages: mockMessages
      }),
      sendMessage: vi.fn()
    }
    
    mockChatClient.channel.mockReturnValue(mockChannel)
    
    renderWithProviders(<Chat />)
    
    await waitFor(() => {
      expect(screen.getByText('First message')).toBeInTheDocument()
      expect(screen.getByText('Second message')).toBeInTheDocument()
    })
  })

  it('should handle empty messages array', async () => {
    const mockChannel = {
      watch: vi.fn().mockResolvedValue({
        messages: []
      }),
      sendMessage: vi.fn()
    }
    
    mockChatClient.channel.mockReturnValue(mockChannel)
    
    renderWithProviders(<Chat />)
    
    await waitFor(() => {
      expect(screen.getByText('No messages yet')).toBeInTheDocument()
    })
  })
})
