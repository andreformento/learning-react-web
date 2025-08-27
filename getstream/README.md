# Stream Chat Backend

Simple NestJS backend for Stream Chat functionality.

## Setup

1. Copy `.env.sample` to `.env` and fill in your Stream credentials:
```bash
cp .env.sample .env
```

2. Edit `.env` with your actual Stream credentials:
```
STREAM_API_KEY=your_actual_api_key
STREAM_API_SECRET=your_actual_api_secret
STREAM_APP_ID=your_actual_app_id
STREAM_REGION=us-east
PORT=3000
```

## Run Application

```bash
# Development mode with auto-reload
npm run start:dev

# Production mode
npm run start
```

## Test the Backend

Run the test script to verify all endpoints work:

```bash
# Simple test (no dependencies)
./test-chat-simple.sh

# Test with jq formatting (requires jq)
./test-chat.sh
```

## Manual Testing with curl

```bash
# Health check
curl http://localhost:3000/chat/health

# Create user token
curl -X POST http://localhost:3000/chat/users/token \
  -H "Content-Type: application/json" \
  -d '{"userId": "testuser123"}'

# Create user
curl -X POST http://localhost:3000/chat/users \
  -H "Content-Type: application/json" \
  -d '{"userId": "testuser123", "userData": {"name": "Test User"}}'

# Create channel
curl -X POST http://localhost:3000/chat/channels \
  -H "Content-Type: application/json" \
  -d '{"channelType": "messaging", "channelId": "test-channel", "members": ["testuser123"]}'

# Send message
curl -X POST http://localhost:3000/chat/channels/messaging/test-channel/messages \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello World!", "userId": "testuser123"}'

# Get messages
curl http://localhost:3000/chat/channels/messaging/test-channel/messages?limit=10
```

## API Endpoints

- `GET /chat/health` - Health check
- `POST /chat/users/token` - Generate user token
- `POST /chat/users` - Create/update user
- `POST /chat/channels` - Create channel
- `POST /chat/channels/:channelType/:channelId/messages` - Send message
- `GET /chat/channels/:channelType/:channelId/messages` - Get messages
