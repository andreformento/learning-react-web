# Stream Frontend

React frontend application demonstrating Stream's Activity Feeds and Chat functionality.

## Features

- **User Authentication**: Login with Stream user tokens
- **Activity Feeds**: Create, read, and interact with activity feeds
- **Real-time Chat**: Connect with other users through chat
- **Modern UI**: Responsive design with React and TypeScript
- **Stream SDK Integration**: Uses Stream's JavaScript SDK for feeds and chat

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your Stream API credentials
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## Environment Variables

- `VITE_STREAM_API_KEY`: Your Stream API key
- `VITE_STREAM_API_SECRET`: Your Stream API secret
- `VITE_STREAM_APP_ID`: Your Stream app ID
- `VITE_STREAM_REGION`: Stream region (default: us-east)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/          # React components
│   ├── Navbar.tsx      # Navigation bar
│   ├── Home.tsx        # Home page with login
│   ├── Feeds.tsx       # Activity feeds
│   └── Chat.tsx        # Chat functionality
├── contexts/            # React contexts
│   └── StreamContext.tsx # Stream client context
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## Stream SDK Usage

The frontend integrates with Stream's JavaScript SDK for:

- **Activity Feeds**: `streamClient.feed()` for feed operations
- **Chat**: `StreamChat` for real-time messaging
- **User Management**: User authentication and tokens

## Development

The app uses:
- **Vite** for fast development and building
- **React Router** for navigation
- **TypeScript** for type safety
- **CSS** for styling (no external UI libraries)
