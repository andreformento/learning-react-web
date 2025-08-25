# Stream Feeds & Chat Project

Full-stack app with Node.js backend and React frontend using Stream's Activity Feeds and Chat SDKs.

## Quick Start

### 1. Environment Setup

#### Backend Environment Variables
```bash
cd backend
cp .sample.env .env
# Edit .env with your Stream API credentials:
```

**Required Backend Variables:**
- `STREAM_API_KEY` - Your Stream API key
- `STREAM_API_SECRET` - Your Stream API secret
- `STREAM_APP_ID` - Your Stream app ID
- `STREAM_REGION` - Stream region (default: us-east)
- `PORT` - Backend server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

#### Frontend Environment Variables
```bash
cd frontend
cp env.example .env
# Edit .env with your Stream API credentials:
```

**Required Frontend Variables:**
- `VITE_STREAM_API_KEY` - Your Stream API key (must start with VITE_)
- `VITE_STREAM_API_SECRET` - Your Stream API secret
- `VITE_STREAM_APP_ID` - Your Stream app ID
- `VITE_STREAM_REGION` - Stream region (default: us-east)
- `VITE_BACKEND_URL` - Backend API URL (default: http://localhost:3000)

**Important:** Frontend environment variables MUST start with `VITE_` to be accessible in the browser.

### 2. Backend
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:3000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:3001
```

## Environment Variable References

### Backend (.env)
```bash
# Stream Feeds Configuration
STREAM_API_KEY=your_api_key_here
STREAM_API_SECRET=your_api_secret_here
STREAM_APP_ID=your_app_id_here
STREAM_REGION=us-east

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Frontend (.env)
```bash
# Stream API Configuration
VITE_STREAM_API_KEY=your_stream_api_key
VITE_STREAM_API_SECRET=your_stream_api_secret
VITE_STREAM_APP_ID=your_stream_app_id
VITE_STREAM_REGION=us-east

# Backend API URL
VITE_BACKEND_URL=http://localhost:3000
```

## API Endpoints
- `GET /health` - Health check
- `POST /users` - Create user
- `POST /feeds/:group/:id/activities` - Add activity
- `GET /feeds/:group/:id/activities` - Get activities
- `POST /feeds/:group/:id/follow` - Follow feed
- `POST /feeds/:group/:id/unfollow` - Unfollow feed
- `DELETE /feeds/:group/:id/activities/:activityId` - Remove activity

## Technologies
- **Backend**: Node.js, Express, Stream Node SDK
- **Frontend**: React, TypeScript, Stream JS SDK, Vite

## Stream Dashboard Setup
Before running the app, ensure these feed groups are created in your Stream Dashboard:
- `user` - User-specific feeds
- `flat` - Flat activity feeds
- `timeline` - Timeline feeds
- `aggregated` - Aggregated feeds
