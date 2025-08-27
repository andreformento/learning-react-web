# Stream Chat Project

NestJS backend + Flutter frontend for Stream Chat.

## Quick Start

### Backend
```bash
cd backend
cp .env.sample .env  # Add your Stream credentials
npm install
npm run start:dev    # Runs on port 3000
```

### Flutter App
```bash
cd flutter
flutter pub get
flutter run -d chrome --web-port 8080  # Runs on port 8080
```

## Usage

1. Start backend and Flutter app
2. Login with any user ID (e.g., "john_doe")
3. Create a channel (e.g., "general-chat")
4. Start chatting!

## Test Backend

```bash
cd backend
./test-chat-simple.sh
```
