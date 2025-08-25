import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock environment variables
vi.mock('import.meta.env', () => ({
  env: {
    VITE_STREAM_API_KEY: 'test-api-key',
    VITE_STREAM_API_SECRET: 'test-api-secret',
    VITE_STREAM_APP_ID: 'test-app-id',
    VITE_STREAM_REGION: 'us-east',
    VITE_BACKEND_URL: 'http://localhost:3000'
  }
}))

// Mock getstream
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

// Mock fetch
global.fetch = vi.fn()

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
}
