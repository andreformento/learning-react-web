const express = require('express');
const cors = require('cors');
require('dotenv').config();

const FeedService = require('./services/feedService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Stream Feeds Server is running' });
});

// Create a user
app.post('/users', async (req, res) => {
  try {
    const { userId, userData } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const user = await FeedService.createUser(userId, userData);
    res.json({
      success: true,
      user,
      message: user.created_at ? 'User created successfully' : 'User logged in successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add activity to a feed
app.post('/feeds/:feedGroup/:feedId/activities', async (req, res) => {
  try {
    const { feedGroup, feedId } = req.params;
    const activity = req.body;

    if (!activity.actor || !activity.verb || !activity.object) {
      return res.status(400).json({
        error: 'Activity must include actor, verb, and object'
      });
    }

    const result = await FeedService.addActivity(feedGroup, feedId, activity);
    res.json({ success: true, activity: result });
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get activities from a feed
app.get('/feeds/:feedGroup/:feedId/activities', async (req, res) => {
  try {
    const { feedGroup, feedId } = req.params;
    const options = req.query;

    const activities = await FeedService.getActivities(feedGroup, feedId, options);
    res.json({ success: true, activities });
  } catch (error) {
    console.error('Error getting activities:', error);
    res.status(500).json({ error: error.message });
  }
});

// Follow a feed
app.post('/feeds/:followerGroup/:followerId/follow', async (req, res) => {
  try {
    const { followerGroup, followerId } = req.params;
    const { targetGroup, targetId } = req.body;

    if (!targetGroup || !targetId) {
      return res.status(400).json({
        error: 'targetGroup and targetId are required'
      });
    }

    const result = await FeedService.followFeed(
      followerGroup,
      followerId,
      targetGroup,
      targetId
    );
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error following feed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Unfollow a feed
app.post('/feeds/:followerGroup/:followerId/unfollow', async (req, res) => {
  try {
    const { followerGroup, followerId } = req.params;
    const { targetGroup, targetId } = req.body;

    if (!targetGroup || !targetId) {
      return res.status(400).json({
        error: 'targetGroup and targetId are required'
      });
    }

    const result = await FeedService.unfollowFeed(
      followerGroup,
      followerId,
      targetGroup,
      targetId
    );
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error unfollowing feed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Remove activity from a feed
app.delete('/feeds/:feedGroup/:feedId/activities/:activityId', async (req, res) => {
  try {
    const { feedGroup, feedId, activityId } = req.params;

    const result = await FeedService.removeActivity(feedGroup, feedId, activityId);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error removing activity:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Stream Feeds Server running on port ${PORT}`);
    console.log(`📖 API Documentation available at http://localhost:${PORT}/health`);
  });
}
