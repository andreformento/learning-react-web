const mockConnect = jest.fn(() => ({
  feed: jest.fn((feedGroup, feedId) => ({
    id: `${feedGroup}:${feedId}`
  })),
  user: jest.fn((userId) => ({
    id: userId
  }))
}));

jest.mock('getstream', () => ({
  connect: mockConnect
}));

jest.mock('dotenv', () => ({
  config: jest.fn()
}));

const { connect } = require('getstream');



describe('Stream Configuration', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };

    process.env.STREAM_API_KEY = 'test-api-key';
    process.env.STREAM_API_SECRET = 'test-api-secret';
    process.env.STREAM_APP_ID = 'test-app-id';
    process.env.STREAM_REGION = 'us-east';

    jest.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.resetModules();
  });

  describe('Configuration validation', () => {
    test('should throw error when STREAM_API_KEY is missing', () => {
      delete process.env.STREAM_API_KEY;

      expect(() => {
        require('../../../src/config/stream');
      }).toThrow('Missing required Stream configuration. Please check your .env file.');
    });

    test('should throw error when STREAM_API_SECRET is missing', () => {
      delete process.env.STREAM_API_SECRET;

      expect(() => {
        require('../../../src/config/stream');
      }).toThrow('Missing required Stream configuration. Please check your .env file.');
    });

    test('should throw error when STREAM_APP_ID is missing', () => {
      delete process.env.STREAM_APP_ID;

      expect(() => {
        require('../../../src/config/stream');
      }).toThrow('Missing required Stream configuration. Please check your .env file.');
    });

    test('should use default region when STREAM_REGION is not set', () => {
      delete process.env.STREAM_REGION;

      const { config } = require('../../../src/config/stream');
      expect(config.region).toBe('us-east');
    });

    test('should use custom region when STREAM_REGION is set', () => {
      process.env.STREAM_REGION = 'eu-west';

      const { config } = require('../../../src/config/stream');
      expect(config.region).toBe('eu-west');
    });
  });

  describe('Stream client initialization', () => {
    test('should initialize connect with correct parameters', () => {
      const { streamClient } = require('../../../src/config/stream');

      expect(mockConnect).toHaveBeenCalledWith(
        'test-api-key',
        'test-api-secret',
        'test-app-id',
        { location: 'us-east' }
      );
      expect(streamClient).toBeDefined();
    });
  });

  describe('Helper functions', () => {
    let streamModule;

    beforeEach(() => {
      streamModule = require('../../../src/config/stream');
    });

    test('getFeed should return feed instance', () => {
      const feed = streamModule.getFeed('user', 'user-123');

      expect(feed).toBeDefined();
      expect(feed.id).toBe('user:user-123');
    });

    test('getUser should return user instance', () => {
      const user = streamModule.getUser('user-123');

      expect(user).toBeDefined();
    });

    test('config should contain all required properties', () => {
      const { config } = streamModule;

      expect(config).toHaveProperty('apiKey');
      expect(config).toHaveProperty('apiSecret');
      expect(config).toHaveProperty('appId');
      expect(config).toHaveProperty('region');

      expect(config.apiKey).toBe('test-api-key');
      expect(config.apiSecret).toBe('test-api-secret');
      expect(config.appId).toBe('test-app-id');
      expect(config.region).toBe('us-east');
    });
  });
});
