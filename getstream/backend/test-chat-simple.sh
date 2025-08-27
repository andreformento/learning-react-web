#!/bin/bash

curl -s http://localhost:3000/chat/health

curl -s -X POST http://localhost:3000/chat/users/token \
  -H "Content-Type: application/json" \
  -d '{"userId": "john_doe"}'

curl -s -X POST http://localhost:3000/chat/users \
  -H "Content-Type: application/json" \
  -d '{"userId": "john_doe", "userData": {"name": "John Doe"}}'

curl -s -X POST http://localhost:3000/chat/channels \
  -H "Content-Type: application/json" \
  -d '{"channelType": "messaging", "channelId": "general-chat", "members": ["john_doe"], "createdBy": "john_doe"}'

curl -s -X POST http://localhost:3000/chat/channels/messaging/general-chat/messages \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello everyone! This is my first message!", "userId": "john_doe"}'

curl -s "http://localhost:3000/chat/channels/messaging/general-chat/messages?limit=10"
