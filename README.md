# Stream Chat Backend

A simple Stream Chat backend server for testing chat functionality. This project focuses exclusively on implementing and testing Stream's Chat API.

## Features

- **User Token Generation**: Create user tokens for chat authentication
- **Channel Management**: Create and manage chat channels
- **Message Operations**: Send and retrieve messages from channels
- **Simple API**: Clean REST endpoints for testing

## Prerequisites

- Node.js (v16 or higher)
- Stream.io account with API credentials

## Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd getstream/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `backend/` folder:
   ```env
   # Stream Chat Configuration
   STREAM_API_KEY=your_stream_api_key
   STREAM_API_SECRET=your_stream_api_secret
   STREAM_APP_ID=your_stream_app_id
   
   # Optional: Stream Region (defaults to us-east)
   # STREAM_REGION=us-east
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Get your Stream credentials**
   - Go to [Stream Dashboard](https://dashboard.getstream.io/)
   - Create a new app or use existing one
   - Copy your API Key, API Secret, and App ID

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 3000 (or the port specified in your `.env` file).

## API Endpoints

### Health Check
```bash
GET /health
```

### Get Configuration
```bash
GET /config
```

### Create User Token
```bash
POST /users/token
Content-Type: application/json

{
  "userId": "user123"
}
```

### Create Channel
```bash
POST /channels
Content-Type: application/json

{
  "channelType": "messaging",
  "channelId": "general",
  "members": ["user1", "user2"],
  "name": "General Chat"
}
```

### Send Message
```bash
POST /channels/messaging/general/messages
Content-Type: application/json

{
  "userId": "user1",
  "text": "Hello, world!"
}
```

### Get Messages
```bash
GET /channels/messaging/general/messages?limit=20&offset=0
```

## Testing the Chat Backend

Here are some curl commands to test the chat functionality:

### 1. Check if server is running
```bash
curl http://localhost:3000/health
```

### 2. Get server configuration
```bash
curl http://localhost:3000/config
```

### 3. Create a user token
```bash
curl -X POST http://localhost:3000/users/token \
  -H "Content-Type: application/json" \
  -d '{"userId": "testuser123"}'
```

### 4. Create a chat channel
```bash
curl -X POST http://localhost:3000/channels \
  -H "Content-Type: application/json" \
  -d '{
    "channelType": "messaging",
    "channelId": "test-channel",
    "members": ["testuser123", "testuser456"],
    "name": "Test Chat Room"
  }'
```

### 5. Send a message
```bash
curl -X POST http://localhost:3000/channels/messaging/test-channel/messages \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "testuser123",
    "text": "Hello from curl! This is a test message."
  }'
```

### 6. Get messages from the channel
```bash
curl "http://localhost:3000/channels/messaging/test-channel/messages?limit=10"
```

## Complete Test Flow

Run this sequence to test the entire chat flow:

```bash
# Start the server first
npm run dev

# In another terminal, run these commands:

# 1. Health check
curl http://localhost:3000/health

# 2. Create user token
curl -X POST http://localhost:3000/users/token \
  -H "Content-Type: application/json" \
  -d '{"userId": "alice"}'

# 3. Create channel
curl -X POST http://localhost:3000/channels \
  -H "Content-Type: application/json" \
  -d '{
    "channelType": "messaging",
    "channelId": "demo-room",
    "members": ["alice", "bob"],
    "name": "Demo Chat Room"
  }'

# 4. Send message
curl -X POST http://localhost:3000/channels/messaging/demo-room/messages \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "alice",
    "text": "Hi Bob! How are you doing?"
  }'

# 5. Get messages
curl "http://localhost:3000/channels/messaging/demo-room/messages"
```

## Troubleshooting

- **Port already in use**: Change the `PORT` in your `.env` file
- **Stream API errors**: Verify your API credentials in the `.env` file
- **CORS issues**: The server includes CORS middleware for testing

## Next Steps

This backend is designed to be simple and testable. You can:
- Use it as a foundation for a Flutter app
- Extend it with additional chat features
- Add authentication and user management
- Implement real-time features using Stream's WebSocket connections

## License

ISC
