import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ChatMessage {
  final String id;
  final String text;
  final String userId;
  final String userName;
  final DateTime createdAt;

  ChatMessage({
    required this.id,
    required this.text,
    required this.userId,
    required this.userName,
    required this.createdAt,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id'] ?? '',
      text: json['text'] ?? '',
      userId: json['user_id'] ?? json['user']?['id'] ?? '',
      userName: json['user_name'] ?? json['user']?['name'] ?? '',
      createdAt: DateTime.parse(json['created_at'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'text': text,
      'user_id': userId,
      'user_name': userName,
      'created_at': createdAt.toIso8601String(),
    };
  }
}

class ChatChannel {
  final String id;
  final String name;
  final List<String> members;
  final DateTime createdAt;

  ChatChannel({
    required this.id,
    required this.name,
    required this.members,
    required this.createdAt,
  });

  factory ChatChannel.fromJson(Map<String, dynamic> json) {
    return ChatChannel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      members: List<String>.from(json['members'] ?? []),
      createdAt: DateTime.parse(json['created_at'] ?? DateTime.now().toIso8601String()),
    );
  }
}

class ChatService extends ChangeNotifier {
  static const String _baseUrl = 'http://localhost:3000/chat';

  String? _currentUserId;
  String? _currentUserName;
  String? _currentChannelId;
  List<ChatMessage> _messages = [];
  bool _isConnected = false;
  List<ChatChannel> _channels = [];

  String? get currentUserId => _currentUserId;
  String? get currentUserName => _currentUserName;
  String? get currentChannelId => _currentChannelId;
  List<ChatMessage> get messages => _messages;
  bool get isConnected => _isConnected;
  List<ChatChannel> get channels => _channels;

  // Login user using your backend
  Future<bool> loginUser(String userId, {String? name}) async {
    try {
      debugPrint('Attempting login for user: $userId');

      // Get user token from your backend
      final tokenResponse = await http.post(
        Uri.parse('$_baseUrl/users/token'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'userId': userId}),
      );

      debugPrint('Token response status: ${tokenResponse.statusCode}');

      if (tokenResponse.statusCode == 200 || tokenResponse.statusCode == 201) {
        // Create or update user on your backend
        final userResponse = await http.post(
          Uri.parse('$_baseUrl/users'),
          headers: {'Content-Type': 'application/json'},
          body: json.encode({
            'userId': userId,
            'userData': {'name': name ?? userId}
          }),
        );

        debugPrint('User creation response status: ${userResponse.statusCode}');

        if (userResponse.statusCode == 200 || userResponse.statusCode == 201) {
          _currentUserId = userId;
          _currentUserName = name ?? userId;
          _isConnected = true;
          notifyListeners();
          debugPrint('Login successful for user: $userId');
          return true;
        } else {
          debugPrint('User creation failed with status: ${userResponse.statusCode}');
          return false;
        }
      } else {
        debugPrint('Token generation failed with status: ${tokenResponse.statusCode}');
        return false;
      }
    } catch (e) {
      debugPrint('Login error: $e');
      return false;
    }
  }

  // Create a channel
  Future<bool> createChannel(String channelId, List<String> members) async {
    try {
      if (_currentUserId == null) return false;

      final response = await http.post(
        Uri.parse('$_baseUrl/channels'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'channelType': 'messaging',
          'channelId': channelId,
          'members': members,
          'createdBy': _currentUserId,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        _currentChannelId = channelId;
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      debugPrint('Create channel error: $e');
      return false;
    }
  }

  // Send message to channel
  Future<bool> sendMessage(String text) async {
    try {
      if (_currentChannelId == null || _currentUserId == null) {
        debugPrint('Cannot send message: channelId=$_currentChannelId, userId=$_currentUserId');
        return false;
      }

      debugPrint('Sending message: "$text" to channel: $_currentChannelId');

      final response = await http.post(
        Uri.parse('$_baseUrl/channels/messaging/$_currentChannelId/messages'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'text': text,
          'userId': _currentUserId,
        }),
      );

      debugPrint('Send message response status: ${response.statusCode}');
      debugPrint('Send message response body: ${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        debugPrint('Message sent successfully, refreshing messages...');
        // Refresh messages
        await getMessages();
        return true;
      } else {
        debugPrint('Failed to send message with status: ${response.statusCode}');
        return false;
      }
    } catch (e) {
      debugPrint('Send message error: $e');
      return false;
    }
  }

  // Get messages from channel
  Future<void> getMessages() async {
    try {
      if (_currentChannelId == null) {
        debugPrint('Cannot get messages: no channel selected');
        return;
      }

      debugPrint('Getting messages for channel: $_currentChannelId');

      final response = await http.get(
        Uri.parse('$_baseUrl/channels/messaging/$_currentChannelId/messages'),
      );

      debugPrint('Get messages response status: ${response.statusCode}');
      debugPrint('Get messages response body: ${response.body}');

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        final List<dynamic> messagesJson = responseData['messages'] ?? [];
        _messages = messagesJson.map((json) => ChatMessage.fromJson(json)).toList();
        debugPrint('Retrieved ${_messages.length} messages');
        notifyListeners();
      } else {
        debugPrint('Failed to get messages with status: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('Get messages error: $e');
    }
  }

  // List all channels for the current user
  Future<void> listChannels() async {
    try {
      if (_currentUserId == null) {
        debugPrint('Cannot list channels: no user logged in');
        return;
      }

      debugPrint('Listing channels for user: $_currentUserId');

      final response = await http.get(
        Uri.parse('$_baseUrl/channels?userId=$_currentUserId'),
      );

      debugPrint('List channels response status: ${response.statusCode}');
      debugPrint('List channels response body: ${response.body}');

      if (response.statusCode == 200) {
        final List<dynamic> channelsJson = json.decode(response.body);
        _channels = channelsJson.map((json) => ChatChannel.fromJson(json)).toList();
        debugPrint('Retrieved ${_channels.length} channels');
        notifyListeners();
      } else {
        debugPrint('Failed to list channels with status: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('List channels error: $e');
    }
  }

  // Switch to a different channel
  Future<void> switchChannel(String channelId) async {
    _currentChannelId = channelId;
    _messages.clear();
    notifyListeners();
    await getMessages();
  }

  // Disconnect user
  Future<void> logout() async {
    _currentUserId = null;
    _currentUserName = null;
    _currentChannelId = null;
    _messages.clear();
    _isConnected = false;
    notifyListeners();
  }
}
