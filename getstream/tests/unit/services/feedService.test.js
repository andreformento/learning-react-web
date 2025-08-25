jest.mock('../../../src/config/stream', () => ({
  getFeed: jest.fn((feedGroup, feedId) => ({
    addActivity: jest.fn().mockResolvedValue({ id: 'test-activity-id' }),
    get: jest.fn().mockResolvedValue({ results: [] }),
    follow: jest.fn().mockResolvedValue({}),
    unfollow: jest.fn().mockResolvedValue({}),
    removeActivity: jest.fn().mockResolvedValue({}),
    id: `${feedGroup}:${feedId}`
  })),
  getUser: jest.fn((userId) => ({
    create: jest.fn().mockResolvedValue({ id: userId }),
    update: jest.fn().mockResolvedValue({ id: userId })
  }))
}));

const FeedService = require('../../../src/services/feedService');
const { getFeed, getUser } = require('../../../src/config/stream');

describe('FeedService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserFeed', () => {
    test('should return user feed instance', () => {
      const feed = FeedService.getUserFeed('user-123');

      expect(getFeed).toHaveBeenCalledWith('user', 'user-123');
      expect(feed).toBeDefined();
      expect(feed.id).toBe('user:user-123');
    });
  });

  describe('getFlatFeed', () => {
    test('should return flat feed instance', () => {
      const feed = FeedService.getFlatFeed('timeline-123');

      expect(getFeed).toHaveBeenCalledWith('flat', 'timeline-123');
      expect(feed).toBeDefined();
      expect(feed.id).toBe('flat:timeline-123');
    });
  });

  describe('getAggregatedFeed', () => {
    test('should return aggregated feed instance', () => {
      const feed = FeedService.getAggregatedFeed('aggregated-123');

      expect(getFeed).toHaveBeenCalledWith('aggregated', 'aggregated-123');
      expect(feed).toBeDefined();
      expect(feed.id).toBe('aggregated:aggregated-123');
    });
  });

  describe('addActivity', () => {
    test('should add activity to feed', async () => {
      const activity = {
        actor: 'user:user-123',
        verb: 'post',
        object: 'post:post-456'
      };

      const result = await FeedService.addActivity('user', 'user-123', activity);

      expect(getFeed).toHaveBeenCalledWith('user', 'user-123');
      expect(result).toEqual({ id: 'test-activity-id' });
    });
  });

  describe('getActivities', () => {
    test('should get activities from feed with default options', async () => {
      const result = await FeedService.getActivities('user', 'user-123');

      expect(getFeed).toHaveBeenCalledWith('user', 'user-123');
      expect(result).toEqual({ results: [] });
    });

    test('should get activities from feed with custom options', async () => {
      const options = { limit: 20, offset: 10 };
      const result = await FeedService.getActivities('user', 'user-123', options);

      expect(getFeed).toHaveBeenCalledWith('user', 'user-123');
      expect(result).toEqual({ results: [] });
    });
  });

  describe('followFeed', () => {
    test('should follow target feed', async () => {
      const result = await FeedService.followFeed(
        'user', 'follower-123',
        'user', 'target-456'
      );

      expect(getFeed).toHaveBeenCalledWith('user', 'follower-123');
      expect(result).toEqual({});
    });
  });

  describe('unfollowFeed', () => {
    test('should unfollow target feed', async () => {
      const result = await FeedService.unfollowFeed(
        'user', 'follower-123',
        'user', 'target-456'
      );

      expect(getFeed).toHaveBeenCalledWith('user', 'follower-123');
      expect(result).toEqual({});
    });
  });

  describe('removeActivity', () => {
    test('should remove activity from feed', async () => {
      const result = await FeedService.removeActivity(
        'user', 'user-123', 'activity-789'
      );

      expect(getFeed).toHaveBeenCalledWith('user', 'user-123');
      expect(result).toEqual({});
    });
  });

  describe('createUser', () => {
    test('should create user with minimal data', async () => {
      const result = await FeedService.createUser('user-123');

      expect(getUser).toHaveBeenCalledWith('user-123');
      expect(result).toEqual({ id: 'user-123' });
    });

    test('should create user with additional data', async () => {
      const userData = { name: 'John Doe', profile: 'Developer' };
      const result = await FeedService.createUser('user-123', userData);

      expect(getUser).toHaveBeenCalledWith('user-123');
      expect(result).toEqual({ id: 'user-123' });
    });
  });

  describe('updateUser', () => {
    test('should update user data', async () => {
      const userData = { name: 'Jane Doe' };
      const result = await FeedService.updateUser('user-123', userData);

      expect(getUser).toHaveBeenCalledWith('user-123');
      expect(result).toEqual({ id: 'user-123' });
    });
  });
});
