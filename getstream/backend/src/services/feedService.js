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
    try {
      const user = await getUser(userId).create({
        id: userId,
        ...userData
      })

      // Return only the user data, not the full Stream client object
      return {
        id: user.id,
        created_at: user.created_at,
        updated_at: user.updated_at,
        ...userData
      }
    } catch (error) {
      if (error.message && error.message.includes('already exists')) {
        try {
          const existingUser = await getUser(userId).get()
          // Return only the user data for existing users
          return {
            id: existingUser.id,
            created_at: existingUser.created_at,
            updated_at: existingUser.updated_at,
            ...userData
          }
        } catch (getError) {
          throw new Error(`User exists but cannot be retrieved: ${getError.message}`)
        }
      }
      throw error
    }
  }

  static async updateUser(userId, userData) {
    return await getUser(userId).update(userData);
  }
}

module.exports = FeedService;
