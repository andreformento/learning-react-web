const { connect, StreamFeed, StreamUser } = require('getstream');
require('dotenv').config();

const config = {
  apiKey: process.env.STREAM_API_KEY,
  apiSecret: process.env.STREAM_API_SECRET,
  appId: process.env.STREAM_APP_ID,
  region: process.env.STREAM_REGION || 'us-east'
};

if (!config.apiKey || !config.apiSecret || !config.appId) {
  throw new Error('Missing required Stream configuration. Please check your .env file.');
}

const streamClient = connect(config.apiKey, config.apiSecret, config.appId, {
  location: config.region
});

const getFeed = (feedGroup, feedId) => {
  return streamClient.feed(feedGroup, feedId);
};

const getUser = (userId) => {
  return streamClient.user(userId);
};

module.exports = {
  streamClient,
  getFeed,
  getUser,
  config
};
