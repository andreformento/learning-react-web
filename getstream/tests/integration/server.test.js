const request = require('supertest');
const express = require('express');

jest.mock('../../src/services/feedService', () => ({
  createUser: jest.fn(),
  addActivity: jest.fn(),
  getActivities: jest.fn(),
  followFeed: jest.fn(),
  unfollowFeed: jest.fn(),
  removeActivity: jest.fn()
}));

jest.mock('dotenv', () => ({
  config: jest.fn()
}));

process.env.STREAM_API_KEY = 'test-api-key';
process.env.STREAM_API_SECRET = 'test-api-secret';
process.env.STREAM_APP_ID = 'test-app-id';
process.env.PORT = '3001';

const FeedService = require('../../src/services/feedService');
let app;

describe('Server Integration Tests', () => {
  let server;

  beforeAll(async () => {
    app = require('../../src/server');
    server = app.listen(0);
  });

  afterAll(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'OK',
        message: 'Stream Feeds Server is running'
      });
    });
  });

  describe('POST /users', () => {
    test('should create user successfully', async () => {
      const userData = { name: 'John Doe', profile: 'Developer' };
      const mockUser = { id: 'user-123', ...userData };

      FeedService.createUser.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/users')
        .send({ userId: 'user-123', userData })
        .expect(200);

      expect(FeedService.createUser).toHaveBeenCalledWith('user-123', userData);
      expect(response.body).toEqual({
        success: true,
        user: mockUser
      });
    });

    test('should return 400 when userId is missing', async () => {
      const response = await request(app)
        .post('/users')
        .send({ userData: { name: 'John Doe' } })
        .expect(400);

      expect(response.body).toEqual({
        error: 'userId is required'
      });
    });

    test('should return 500 when service throws error', async () => {
      FeedService.createUser.mockRejectedValue(new Error('Service error'));

      const response = await request(app)
        .post('/users')
        .send({ userId: 'user-123' })
        .expect(500);

      expect(response.body).toEqual({
        error: 'Service error'
      });
    });
  });

  describe('POST /feeds/:feedGroup/:feedId/activities', () => {
    test('should add activity successfully', async () => {
      const activity = {
        actor: 'user:user-123',
        verb: 'post',
        object: 'post:post-456'
      };
      const mockResult = { id: 'activity-123', ...activity };

      FeedService.addActivity.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/feeds/user/user-123/activities')
        .send(activity)
        .expect(200);

      expect(FeedService.addActivity).toHaveBeenCalledWith('user', 'user-123', activity);
      expect(response.body).toEqual({
        success: true,
        activity: mockResult
      });
    });

    test('should return 400 when required fields are missing', async () => {
      const activity = { actor: 'user:user-123' };

      const response = await request(app)
        .post('/feeds/user/user-123/activities')
        .send(activity)
        .expect(400);

      expect(response.body).toEqual({
        error: 'Activity must include actor, verb, and object'
      });
    });

    test('should return 500 when service throws error', async () => {
      FeedService.addActivity.mockRejectedValue(new Error('Service error'));

      const activity = {
        actor: 'user:user-123',
        verb: 'post',
        object: 'post:post-456'
      };

      const response = await request(app)
        .post('/feeds/user/user-123/activities')
        .send(activity)
        .expect(500);

      expect(response.body).toEqual({
        error: 'Service error'
      });
    });
  });

  describe('GET /feeds/:feedGroup/:feedId/activities', () => {
    test('should get activities successfully', async () => {
      const mockActivities = { results: [{ id: 'activity-1' }, { id: 'activity-2' }] };

      FeedService.getActivities.mockResolvedValue(mockActivities);

      const response = await request(app)
        .get('/feeds/user/user-123/activities')
        .query({ limit: 10 })
        .expect(200);

      expect(FeedService.getActivities).toHaveBeenCalledWith('user', 'user-123', { limit: '10' });
      expect(response.body).toEqual({
        success: true,
        activities: mockActivities
      });
    });

    test('should return 500 when service throws error', async () => {
      FeedService.getActivities.mockRejectedValue(new Error('Service error'));

      const response = await request(app)
        .get('/feeds/user/user-123/activities')
        .expect(500);

      expect(response.body).toEqual({
        error: 'Service error'
      });
    });
  });

  describe('POST /feeds/:followerGroup/:followerId/follow', () => {
    test('should follow feed successfully', async () => {
      const mockResult = { success: true };

      FeedService.followFeed.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/feeds/user/follower-123/follow')
        .send({ targetGroup: 'user', targetId: 'target-456' })
        .expect(200);

      expect(FeedService.followFeed).toHaveBeenCalledWith('user', 'follower-123', 'user', 'target-456');
      expect(response.body).toEqual({
        success: true,
        result: mockResult
      });
    });

    test('should return 400 when targetGroup is missing', async () => {
      const response = await request(app)
        .post('/feeds/user/follower-123/follow')
        .send({ targetId: 'target-456' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'targetGroup and targetId are required'
      });
    });

    test('should return 400 when targetId is missing', async () => {
      const response = await request(app)
        .post('/feeds/user/follower-123/follow')
        .send({ targetGroup: 'user' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'targetGroup and targetId are required'
      });
    });
  });

  describe('POST /feeds/:followerGroup/:followerId/unfollow', () => {
    test('should unfollow feed successfully', async () => {
      const mockResult = { success: true };

      FeedService.unfollowFeed.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/feeds/user/follower-123/unfollow')
        .send({ targetGroup: 'user', targetId: 'target-456' })
        .expect(200);

      expect(FeedService.unfollowFeed).toHaveBeenCalledWith('user', 'follower-123', 'user', 'target-456');
      expect(response.body).toEqual({
        success: true,
        result: mockResult
      });
    });
  });

  describe('DELETE /feeds/:feedGroup/:feedId/activities/:activityId', () => {
    test('should remove activity successfully', async () => {
      const mockResult = { success: true };

      FeedService.removeActivity.mockResolvedValue(mockResult);

      const response = await request(app)
        .delete('/feeds/user/user-123/activities/activity-456')
        .expect(200);

      expect(FeedService.removeActivity).toHaveBeenCalledWith('user', 'user-123', 'activity-456');
      expect(response.body).toEqual({
        success: true,
        result: mockResult
      });
    });
  });

  describe('404 handler', () => {
    test('should return 404 for unknown endpoints', async () => {
      const response = await request(app)
        .get('/unknown-endpoint')
        .expect(404);

      expect(response.body).toEqual({
        error: 'Endpoint not found'
      });
    });
  });
});
