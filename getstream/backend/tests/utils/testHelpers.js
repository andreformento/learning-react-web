/**
 * Test utility functions for Stream Feeds testing
 */

// Mock Stream API responses
const mockStreamResponses = {
  user: {
    id: 'user-123',
    name: 'Test User',
    profile: 'Test Profile'
  },

  activity: {
    id: 'activity-123',
    actor: 'user:user-123',
    verb: 'post',
    object: 'post:post-456',
    foreign_id: 'post:post-456',
    timestamp: new Date().toISOString()
  },

  feed: {
    results: [
      {
        id: 'activity-1',
        actor: 'user:user-1',
        verb: 'post',
        object: 'post:post-1'
      },
      {
        id: 'activity-2',
        actor: 'user:user-2',
        verb: 'comment',
        object: 'post:post-1'
      }
    ],
    next: null,
    unread: 0
  }
};

// Create mock activity data
const createMockActivity = (overrides = {}) => ({
  actor: 'user:user-123',
  verb: 'post',
  object: 'post:post-456',
  foreign_id: 'post:post-456',
  timestamp: new Date().toISOString(),
  ...overrides
});

// Create mock user data
const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  name: 'Test User',
  profile: 'Test Profile',
  ...overrides
});

// Create mock feed response
const createMockFeedResponse = (overrides = {}) => ({
  results: [],
  next: null,
  unread: 0,
  ...overrides
});

// Mock console methods
const mockConsole = () => {
  const originalLog = console.log;
  const originalError = console.error;

  const mockLog = jest.fn();
  const mockError = jest.fn();

  console.log = mockLog;
  console.error = mockError;

  return {
    log: mockLog,
    error: mockError,
    restore: () => {
      console.log = originalLog;
      console.error = originalError;
    }
  };
};

// Wait for async operations
const waitFor = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

// Create test environment variables
const createTestEnv = () => {
  const originalEnv = { ...process.env };

  return {
    restore: () => {
      process.env = originalEnv;
    }
  };
};

module.exports = {
  mockStreamResponses,
  createMockActivity,
  createMockUser,
  createMockFeedResponse,
  mockConsole,
  waitFor,
  createTestEnv
};
