#!/bin/bash

curl -s http://localhost:3000/chat/health | jq '.' 2>/dev/null || echo "Health check failed"

TOKEN_RESPONSE=$(curl -s -X POST http://localhost:3000/chat/users/token \
  -H "Content-Type: application/json" \
  -d '{"userId": "john_doe"}')
echo $TOKEN_RESPONSE | jq '.' 2>/dev/null || echo "Token creation failed"

curl -s -X POST http://localhost:3000/chat/users \
  -H "Content-Type: application/json" \
  -d '{"userId": "john_doe", "userData": {"name": "John Doe"}}' | jq '.' 2>/dev/null || echo "User creation failed"

curl -s -X POST http://localhost:3000/chat/channels \
  -H "Content-Type: application/json" \
  -d '{"channelType": "messaging", "channelId": "general-chat", "members": ["john_doe"]}' | jq '.' 2>/dev/null || echo "Channel creation failed"

curl -s -X POST http://localhost:3000/chat/channels/messaging/general-chat/messages \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello everyone! This is my first message!", "userId": "john_doe"}' | jq '.' 2>/dev/null || echo "Message sending failed"

curl -s "http://localhost:3000/chat/channels/messaging/general-chat/messages?limit=10" | jq '.' 2>/dev/null || echo "Message retrieval failed"
