# Stream Feeds Node.js Project

This project demonstrates how to use the Stream Feeds Node SDK to build activity feeds and social features.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Stream account and API credentials

## Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd getstream
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Fill in your Stream API credentials:
     - `STREAM_API_KEY`: Your Stream API key
     - `STREAM_API_SECRET`: Your Stream API secret
     - `STREAM_APP_ID`: Your Stream app ID
     - `PORT`: Server port (default: 3000)

4. **Get your Stream credentials**
   - Sign up at [getstream.io](https://getstream.io)
   - Create a new app
   - Copy your API key, secret, and app ID from the dashboard

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Run examples
```bash
node examples/basic-feeds.js
node examples/user-activities.js
```

## Project Structure

```
getstream/
├── src/
│   ├── config/
│   │   └── stream.js          # Stream SDK configuration
│   ├── services/
│   │   └── feedService.js     # Feed operations service
│   └── server.js              # Express server setup
├── examples/
│   ├── basic-feeds.js         # Basic feed operations
│   └── user-activities.js     # User activity examples
├── .env                       # Environment variables
├── package.json               # Project dependencies
└── README.md                  # This file
```

## Features

- ✅ Stream Feeds SDK integration
- ✅ Environment configuration
- ✅ Basic feed operations
- ✅ User activity management
- ✅ Express server setup
- ✅ Development tools (nodemon)

## API Examples

### Creating a feed
```javascript
const { StreamChat } = require('getstream');

const client = StreamChat.getInstance(apiKey, apiSecret);
const userFeed = client.feed('user', 'user-id');
```

### Adding activities
```javascript
await userFeed.addActivity({
  actor: 'user:123',
  verb: 'post',
  object: 'post:456',
  foreign_id: 'post:456'
});
```

## Documentation

- [Stream Feeds Node.js Documentation](https://getstream.io/activity-feeds/docs/node/installation.md)
- [Stream Dashboard](https://dashboard.getstream.io/)
- [API Reference](https://getstream.io/activity-feeds/docs/node/)

## License

ISC
