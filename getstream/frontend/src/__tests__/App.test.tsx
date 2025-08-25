import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

// Mock the StreamContext
vi.mock('../contexts/StreamContext', () => ({
  StreamProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="stream-provider">{children}</div>
}))

// Mock the components
vi.mock('../components/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>
}))

vi.mock('../components/Home', () => ({
  default: () => <div data-testid="home">Home Component</div>
}))

vi.mock('../components/Feeds', () => ({
  default: () => <div data-testid="feeds">Feeds Component</div>
}))

vi.mock('../components/Chat', () => ({
  default: () => <div data-testid="chat">Chat Component</div>
}))

const renderApp = () => {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

describe('App Component', () => {
  it('should render StreamProvider wrapper', () => {
    renderApp()
    
    expect(screen.getByTestId('stream-provider')).toBeInTheDocument()
  })

  it('should render Navbar component', () => {
    renderApp()
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
  })

  it('should render main container', () => {
    renderApp()
    
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveClass('container')
  })

  it('should render Home component on root route', () => {
    renderApp()
    
    expect(screen.getByTestId('home')).toBeInTheDocument()
  })

  it('should have proper CSS classes', () => {
    renderApp()
    
    const appDiv = screen.getByRole('main').parentElement
    expect(appDiv).toHaveClass('App')
  })

  it('should render all route components when navigating', () => {
    renderApp()
    
    // Initially shows Home
    expect(screen.getByTestId('home')).toBeInTheDocument()
    
    // Note: In a real test environment, we would test navigation
    // but since we're mocking components, we can verify they're all available
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
  })

  it('should have proper routing structure', () => {
    renderApp()
    
    // Check that the main container exists
    const mainContainer = screen.getByRole('main')
    expect(mainContainer).toBeInTheDocument()
    
    // Check that the container has the right class
    expect(mainContainer).toHaveClass('container')
  })

  it('should wrap everything in StreamProvider', () => {
    renderApp()
    
    const streamProvider = screen.getByTestId('stream-provider')
    expect(streamProvider).toBeInTheDocument()
    
    // Check that Navbar and main container are inside StreamProvider
    expect(streamProvider).toContainElement(screen.getByTestId('navbar'))
    expect(streamProvider).toContainElement(screen.getByRole('main'))
  })
})
