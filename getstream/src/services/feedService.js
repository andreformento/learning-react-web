const { getFeed, getUser } = require('../config/stream');

class FeedService {
  static getUserFeed(userId) {
    return getFeed('user', userId);
  }

  static getFlatFeed(feedId) {
    return getFeed('flat', feedId);
  }

  static getAggregatedFeed(feedId) {
    return getFeed('aggregated', feedId);
  }

  static async addActivity(feedGroup, feedId, activity) {
    const feed = getFeed(feedGroup, feedId);
    return await feed.addActivity(activity);
  }

  static async getActivities(feedGroup, feedId, options = {}) {
    const feed = getFeed(feedGroup, feedId);
    return await feed.get(options);
  }

  static async followFeed(followerGroup, followerId, targetGroup, targetId) {
    const followerFeed = getFeed(followerGroup, followerId);
    return await followerFeed.follow(targetGroup, targetId);
  }

  static async unfollowFeed(followerGroup, followerId, targetGroup, targetId) {
    const followerFeed = getFeed(followerGroup, followerId);
    return await followerFeed.unfollow(targetGroup, targetId);
  }

  static async removeActivity(feedGroup, feedId, activityId) {
    const feed = getFeed(feedGroup, feedId);
    return await feed.removeActivity(activityId);
  }

  static async createUser(userId, userData = {}) {
    return await getUser(userId).create({
      id: userId,
      ...userData
    });
  }

  static async updateUser(userId, userData) {
    return await getUser(userId).update(userData);
  }
}

module.exports = FeedService;
