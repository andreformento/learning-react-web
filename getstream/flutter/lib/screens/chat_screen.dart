import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/stream_service.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _channelIdController = TextEditingController();
  final _messageController = TextEditingController();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    // Channels will be loaded automatically when user is available
  }

  @override
  void dispose() {
    _channelIdController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  Future<void> _loadChannels() async {
    debugPrint('Loading channels...');
    final chatService = context.read<ChatService>();
    if (chatService.currentUserId != null) {
      await chatService.listChannels();
      debugPrint('Channels loaded');
    } else {
      debugPrint('Cannot load channels: user not logged in');
    }
  }

  Future<void> _loadMessages() async {
    await context.read<ChatService>().getMessages();
  }

  Future<void> _switchChannel(String channelId) async {
    await context.read<ChatService>().switchChannel(channelId);
  }

  Future<void> _createChannel() async {
    if (_channelIdController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a channel ID')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final chatService = context.read<ChatService>();
      final currentUserId = chatService.currentUserId;

      if (currentUserId == null) return;

      final success = await chatService.createChannel(
        _channelIdController.text,
        [currentUserId],
      );

              if (success && mounted) {
          _channelIdController.clear();
          await _loadChannels();
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Channel created successfully!')),
          );
        } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Failed to create channel')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _sendMessage() async {
    if (_messageController.text.isEmpty) return;

    final success = await context.read<ChatService>().sendMessage(
      _messageController.text,
    );

    if (success && mounted) {
      _messageController.clear();
      await _loadMessages();
    }
  }

  Future<void> _logout() async {
    await context.read<ChatService>().logout();
    if (mounted) {
      Navigator.of(context).pushReplacementNamed('/');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Consumer<ChatService>(
          builder: (context, chatService, child) {
            return Text(chatService.currentChannelId ?? 'Stream Chat');
          },
        ),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _logout,
          ),
        ],
      ),
      body: Column(
        children: [
                    // Channel list and creation section
          Consumer<ChatService>(
            builder: (context, chatService, child) {
              // Auto-load channels when user is available
              if (chatService.currentUserId != null && chatService.channels.isEmpty) {
                WidgetsBinding.instance.addPostFrameCallback((_) {
                  _loadChannels();
                });
              }

              return Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Channel creation
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _channelIdController,
                            decoration: const InputDecoration(
                              labelText: 'New Channel ID',
                              hintText: 'Enter channel ID (e.g., general-chat)',
                              border: OutlineInputBorder(),
                              prefixIcon: Icon(Icons.add_circle),
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        ElevatedButton(
                          onPressed: _isLoading ? null : _createChannel,
                          child: _isLoading
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(strokeWidth: 2),
                                )
                              : const Text('Create'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Channel list
                    if (chatService.channels.isNotEmpty) ...[
                      const Text(
                        'Your Channels:',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      SizedBox(
                        height: 60,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: chatService.channels.length,
                          itemBuilder: (context, index) {
                            final channel = chatService.channels[index];
                            final isSelected = channel.id == chatService.currentChannelId;

                            return Padding(
                              padding: const EdgeInsets.only(right: 8.0),
                              child: InkWell(
                                onTap: () => _switchChannel(channel.id),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 8,
                                  ),
                                  decoration: BoxDecoration(
                                    color: isSelected ? Colors.blue : Colors.grey[200],
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(
                                      color: isSelected ? Colors.blue : Colors.grey[300]!,
                                      width: 2,
                                    ),
                                  ),
                                  child: Center(
                                    child: Text(
                                      channel.name,
                                      style: TextStyle(
                                        color: isSelected ? Colors.white : Colors.black87,
                                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                    ] else ...[
                      const Text(
                        'No channels yet. Create your first channel above!',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ],
                ),
              );
            },
          ),

          // Messages section
          Expanded(
            child: Consumer<ChatService>(
              builder: (context, chatService, child) {
                if (chatService.currentChannelId == null) {
                  return const Center(
                    child: Text('Create a channel to start chatting'),
                  );
                }

                if (chatService.messages.isEmpty) {
                  return const Center(
                    child: Text('No messages yet. Start the conversation!'),
                  );
                }

                return ListView.builder(
                  padding: const EdgeInsets.all(16.0),
                  itemCount: chatService.messages.length,
                  itemBuilder: (context, index) {
                    final message = chatService.messages[index];
                    final isCurrentUser = message.userId == chatService.currentUserId;

                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4.0),
                      child: Row(
                        mainAxisAlignment: isCurrentUser
                            ? MainAxisAlignment.end
                            : MainAxisAlignment.start,
                        children: [
                          if (!isCurrentUser) ...[
                            CircleAvatar(
                              radius: 16,
                              child: Text(
                                message.userName.isNotEmpty
                                    ? message.userName[0].toUpperCase()
                                    : '?',
                                style: const TextStyle(fontSize: 14),
                              ),
                            ),
                            const SizedBox(width: 8),
                          ],
                          Flexible(
                            child: Container(
                              padding: const EdgeInsets.all(12.0),
                              decoration: BoxDecoration(
                                color: isCurrentUser
                                    ? Colors.blue[100]
                                    : Colors.grey[200],
                                borderRadius: BorderRadius.circular(16.0),
                              ),
                              child: Column(
                                crossAxisAlignment: isCurrentUser
                                    ? CrossAxisAlignment.end
                                    : CrossAxisAlignment.start,
                                children: [
                                  if (!isCurrentUser)
                                    Text(
                                      message.userName,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 12,
                                      ),
                                    ),
                                  Text(
                                    message.text,
                                    style: const TextStyle(fontSize: 16),
                                  ),
                                  Text(
                                    _formatTime(message.createdAt),
                                    style: TextStyle(
                                      fontSize: 10,
                                      color: Colors.grey[600],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          if (isCurrentUser) ...[
                            const SizedBox(width: 8),
                            CircleAvatar(
                              radius: 16,
                              backgroundColor: Colors.blue,
                              child: Text(
                                message.userName.isNotEmpty
                                    ? message.userName[0].toUpperCase()
                                    : '?',
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                    );
                  },
                );
              },
            ),
          ),

          // Message input
          Consumer<ChatService>(
            builder: (context, chatService, child) {
              if (chatService.currentChannelId == null) {
                return const SizedBox.shrink();
              }

              return Container(
                padding: const EdgeInsets.all(16.0),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.3),
                      spreadRadius: 1,
                      blurRadius: 3,
                      offset: const Offset(0, -1),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _messageController,
                        decoration: const InputDecoration(
                          hintText: 'Type a message...',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.all(Radius.circular(25)),
                          ),
                          contentPadding: EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                        ),
                        onSubmitted: (_) => _sendMessage(),
                      ),
                    ),
                    const SizedBox(width: 8),
                    IconButton(
                      onPressed: _sendMessage,
                      icon: const Icon(Icons.send),
                      style: IconButton.styleFrom(
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                        shape: const CircleBorder(),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  String _formatTime(DateTime time) {
    final now = DateTime.now();
    final difference = now.difference(time);

    if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'now';
    }
  }
}
