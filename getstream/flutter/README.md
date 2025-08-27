# Stream Chat Flutter Example

A complete Flutter chat application that integrates with your Stream Chat backend.

## 🚀 Features

- **User Authentication**: Login with user ID and optional display name
- **Channel Management**: Create new chat channels
- **Real-time Messaging**: Send and receive messages in real-time
- **Stream Chat Integration**: Uses official Stream Chat Flutter SDK
- **Backend Integration**: Connects to your NestJS Stream Chat backend

## 📱 Screenshots

- **Login Screen**: Simple user authentication
- **Chat Screen**: Full-featured chat interface with Stream Chat widgets

## 🛠️ Setup Instructions

### Prerequisites

1. **Flutter SDK**: Make sure you have Flutter installed and configured
2. **Backend Running**: Your Stream Chat backend must be running on `localhost:3000`
3. **Dependencies**: Run `flutter pub get` to install packages

### Installation

1. **Navigate to the flutter directory**:
   ```bash
   cd flutter
   ```

2. **Install dependencies**:
   ```bash
   flutter pub get
   ```

3. **Run the app**:
   ```bash
   flutter run
   ```

## 🔧 Configuration

### Backend Connection

The app is configured to connect to your backend at `http://localhost:3000/chat`. If you need to change this:

1. Open `lib/services/stream_service.dart`
2. Update the `_baseUrl` constant:
   ```dart
   static const String _baseUrl = 'http://your-backend-url:port/chat';
   ```

### Stream API Key

The app uses your Stream API key. To update it:

1. Open `lib/services/stream_service.dart`
2. Update the `_apiKey` constant:
   ```dart
   static const String _apiKey = 'your-stream-api-key';
   ```

## 📖 Usage

### 1. Login
- Enter a user ID (e.g., `john_doe`)
- Optionally enter a display name
- Tap "Login to Chat"

### 2. Create Channel
- Enter a channel ID (e.g., `general-chat`)
- Tap "Create Channel"

### 3. Start Chatting
- Use the message input at the bottom
- Messages are sent in real-time
- All Stream Chat features are available

## 🏗️ Architecture

### Services
- **StreamService**: Manages Stream Chat client and backend communication
- **HTTP Integration**: Connects to your NestJS backend API
- **State Management**: Uses Provider for app state

### Screens
- **LoginScreen**: User authentication
- **ChatScreen**: Main chat interface with Stream Chat widgets

### Key Components
- **StreamChatClient**: Core Stream Chat functionality
- **StreamChannel**: Channel management
- **StreamMessageListView**: Message display
- **StreamMessageInput**: Message input

## 🔗 API Endpoints Used

The Flutter app communicates with your backend using these endpoints:

- `POST /chat/users/token` - Get user authentication token
- `POST /chat/users` - Create/update user
- `POST /chat/channels` - Create new channel
- `POST /chat/channels/:type/:id/messages` - Send message
- `GET /chat/channels/:type/:id/messages` - Get messages

## 🧪 Testing

1. **Start your backend**: `npm run start:dev` (from backend directory)
2. **Run Flutter app**: `flutter run` (from flutter directory)
3. **Test flow**:
   - Login with user ID `john_doe`
   - Create channel `general-chat`
   - Send messages
   - Verify real-time updates

## 📚 Dependencies

- **stream_chat_flutter**: Full Stream Chat UI components
- **stream_chat_flutter_core**: Core business logic
- **stream_chat**: Low-level Stream Chat client
- **http**: HTTP requests to your backend
- **provider**: State management

## 🚨 Troubleshooting

### Common Issues

1. **Connection Error**: Ensure your backend is running on port 3000
2. **API Key Error**: Verify your Stream API key in the service
3. **Flutter Dependencies**: Run `flutter clean && flutter pub get`

### Debug Mode

Enable debug logging in the StreamService:
```dart
logLevel: Level.DEBUG,
```

## 🎯 Next Steps

- **Custom UI**: Modify Stream Chat widgets for your design
- **Push Notifications**: Add push notification support
- **Offline Support**: Implement offline message caching
- **User Management**: Add user profile management
- **Channel Types**: Support different channel types (team, gaming, etc.)

## 📄 License

This example is provided as-is for educational purposes.
