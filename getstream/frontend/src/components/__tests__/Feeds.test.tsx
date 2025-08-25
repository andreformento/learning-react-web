import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { StreamProvider } from '../../contexts/StreamContext'
import Feeds from '../Feeds'

// Mock the StreamContext
const mockStreamClient = {
  feed: vi.fn(() => ({
    addActivity: vi.fn(),
    get: vi.fn()
  }))
}

const mockIsAuthenticated = true
const mockCurrentUser = { id: 'testuser' }

vi.mock('../../contexts/StreamContext', () => ({
  useStream: () => ({
    streamClient: mockStreamClient,
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

describe('Feeds Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render feeds title', () => {
    renderWithProviders(<Feeds />)

    expect(screen.getByText('Activity Feeds')).toBeInTheDocument()
  })

  it('should render create activity form', () => {
    renderWithProviders(<Feeds />)

    expect(screen.getByText('Create New Activity')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Activity text')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Post Activity' })).toBeInTheDocument()
  })

  it('should render activities list section', () => {
    renderWithProviders(<Feeds />)

    expect(screen.getByText('Your Activities')).toBeInTheDocument()
  })

  it('should handle activity form submission', async () => {
    const mockAddActivity = vi.fn().mockResolvedValue({ id: 'activity-1' })
    mockStreamClient.feed.mockReturnValue({
      addActivity: mockAddActivity,
      get: vi.fn()
    })

    renderWithProviders(<Feeds />)

    const input = screen.getByPlaceholderText('Activity text')
    const button = screen.getByRole('button', { name: 'Post Activity' })

    fireEvent.change(input, { target: { value: 'Test activity' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockAddActivity).toHaveBeenCalledWith({
        actor: 'user:testuser',
        verb: 'post',
        object: 'activity:Test activity',
        foreign_id: expect.any(String)
      })
    })
  })

  it('should not submit empty activity', () => {
    renderWithProviders(<Feeds />)

    const button = screen.getByRole('button', { name: 'Post Activity' })
    fireEvent.click(button)

    expect(mockStreamClient.feed).not.toHaveBeenCalled()
  })

  it('should not submit whitespace-only activity', () => {
    renderWithProviders(<Feeds />)

    const input = screen.getByPlaceholderText('Activity text')
    const button = screen.getByRole('button', { name: 'Post Activity' })

    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(button)

    expect(mockStreamClient.feed).not.toHaveBeenCalled()
  })

  it('should clear input after successful submission', async () => {
    const mockAddActivity = vi.fn().mockResolvedValue({ id: 'activity-1' })
    mockStreamClient.feed.mockReturnValue({
      addActivity: mockAddActivity,
      get: vi.fn()
    })

    renderWithProviders(<Feeds />)

    const input = screen.getByPlaceholderText('Activity text')
    const button = screen.getByRole('button', { name: 'Post Activity' })

    fireEvent.change(input, { target: { value: 'Test activity' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(input).toHaveValue('')
    })
  })

  it('should handle activity submission error', async () => {
    const mockAddActivity = vi.fn().mockRejectedValue(new Error('Failed to add activity'))
    mockStreamClient.feed.mockReturnValue({
      addActivity: mockAddActivity,
      get: vi.fn()
    })

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    renderWithProviders(<Feeds />)

    const input = screen.getByPlaceholderText('Activity text')
    const button = screen.getByRole('button', { name: 'Post Activity' })

    fireEvent.change(input, { target: { value: 'Test activity' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to add activity:', expect.any(Error))
    })

    consoleSpy.mockRestore()
  })

  it('should load and display activities', async () => {
    const mockActivities = {
      results: [
        { id: 'activity-1', object: 'activity:First activity' },
        { id: 'activity-2', object: 'activity:Second activity' }
      ]
    }

    const mockGet = vi.fn().mockResolvedValue(mockActivities)
    mockStreamClient.feed.mockReturnValue({
      addActivity: vi.fn(),
      get: mockGet
    })

    renderWithProviders(<Feeds />)

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalled()
    })

    expect(screen.getByText('First activity')).toBeInTheDocument()
    expect(screen.getByText('Second activity')).toBeInTheDocument()
  })

  it('should handle activities loading error', async () => {
    const mockGet = vi.fn().mockRejectedValue(new Error('Failed to load activities'))
    mockStreamClient.feed.mockReturnValue({
      addActivity: vi.fn(),
      get: mockGet
    })

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    renderWithProviders(<Feeds />)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load activities:', expect.any(Error))
    })

    consoleSpy.mockRestore()
  })

  it('should show loading state during submission', async () => {
    let resolveActivity: () => void
    const mockAddActivity = vi.fn().mockImplementation(() => new Promise(resolve => {
      resolveActivity = resolve
    }))

    mockStreamClient.feed.mockReturnValue({
      addActivity: mockAddActivity,
      get: vi.fn()
    })

    renderWithProviders(<Feeds />)

    const input = screen.getByPlaceholderText('Activity text')
    const button = screen.getByRole('button', { name: 'Post Activity' })

    fireEvent.change(input, { target: { value: 'Test activity' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(button).toBeDisabled()
      expect(button).toHaveTextContent('Posting...')
    })

    // Resolve the activity promise
    resolveActivity!()

    await waitFor(() => {
      expect(button).not.toBeDisabled()
      expect(button).toHaveTextContent('Post Activity')
    })
  })

  it('should generate unique foreign_id for each activity', async () => {
    const mockAddActivity = vi.fn().mockResolvedValue({ id: 'activity-1' })
    mockStreamClient.feed.mockReturnValue({
      addActivity: mockAddActivity,
      get: vi.fn()
    })

    renderWithProviders(<Feeds />)

    const input = screen.getByPlaceholderText('Activity text')
    const button = screen.getByRole('button', { name: 'Post Activity' })

    fireEvent.change(input, { target: { value: 'First activity' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockAddActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          foreign_id: expect.stringMatching(/^activity:\d+$/)
        })
      )
    })

    // Submit another activity
    fireEvent.change(input, { target: { value: 'Second activity' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockAddActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          foreign_id: expect.stringMatching(/^activity:\d+$/)
        })
      )
    })

    // Check that different foreign_ids were generated
    const calls = mockAddActivity.mock.calls
    expect(calls[0][0].foreign_id).not.toBe(calls[1][0].foreign_id)
  })
})
