import { Injectable, OnModuleInit } from '@nestjs/common';
import { StreamChat } from 'stream-chat';

@Injectable()
export class StreamChatService implements OnModuleInit {
  private serverClient: StreamChat;

  constructor() {
    console.log('🔧 Initializing Stream Chat Service...');
  }

  onModuleInit() {
    console.log('🚀 Setting up Stream Chat client...');

    const apiKey = process.env.STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;
    const appId = process.env.STREAM_APP_ID;

    if (!apiKey || !apiSecret || !appId) {
      console.error('❌ Missing environment variables: STREAM_API_KEY, STREAM_API_SECRET, or STREAM_APP_ID');
      throw new Error('STREAM_API_KEY, STREAM_API_SECRET, and STREAM_APP_ID must be set in environment variables');
    }

    this.serverClient = StreamChat.getInstance(apiKey, apiSecret);
    console.log(`✅ Stream Chat client initialized successfully with App ID: ${appId}`);
  }

  createUserToken(userId: string): string {
    console.log(`🔑 Generating token for user: ${userId}`);
    const token = this.serverClient.createToken(userId);
    console.log(`✅ Token generated successfully for user: ${userId}`);
    return token;
  }

  async createUser(userId: string, userData?: any) {
    try {
      console.log(`👤 Creating/updating user: ${userId}`);

      await this.serverClient.upsertUser({
        id: userId,
        ...userData,
      });

      console.log(`✅ User ${userId} created/updated successfully`);
      return { success: true, userId };
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`ℹ️ User ${userId} already exists`);
        return { success: true, userId, message: 'User already exists' };
      }
      const errorMsg = error.response?.data?.message || error.message;
      console.error(`❌ Failed to create user ${userId}: ${errorMsg}`);
      throw new Error(`User creation failed: ${errorMsg}`);
    }
  }

  async createChannel(channelType: string, channelId: string, members: string[], createdBy: string) {
    try {
      console.log(`📝 Creating channel: ${channelType}/${channelId} with members: ${members.join(', ')} and created by: ${createdBy}`);

      const channel = this.serverClient.channel(channelType, channelId, {
        members,
        created_by_id: createdBy,
      });
      await channel.create();

      console.log(`✅ Channel created successfully: ${channelType}/${channelId}`);
      return {
        success: true,
        channel: {
          id: channelId,
          type: channelType,
          members: members,
          created_by: createdBy,
          cid: `${channelType}:${channelId}`
        }
      };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error(`❌ Failed to create channel ${channelType}/${channelId}: ${errorMsg}`);
      throw new Error(`Channel creation failed: ${errorMsg}`);
    }
  }

  async sendMessage(channelType: string, channelId: string, message: any, userId: string) {
    try {
      console.log(`💬 Sending message to ${channelType}/${channelId} from user: ${userId}`);

      const channel = this.serverClient.channel(channelType, channelId);
      const response = await channel.sendMessage({
        ...message,
        user_id: userId,
      });

      console.log(`✅ Message sent successfully to ${channelType}/${channelId}`);
      return { success: true, message: response.message };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error(`❌ Failed to send message to ${channelType}/${channelId}: ${errorMsg}`);
      throw new Error(`Message sending failed: ${errorMsg}`);
    }
  }

  async getMessages(channelType: string, channelId: string, limit = 50) {
    try {
      console.log(`📖 Getting messages from ${channelType}/${channelId} (limit: ${limit})`);

      const channel = this.serverClient.channel(channelType, channelId);
      const response = await channel.query({ messages: { limit } });

      console.log(`✅ Retrieved ${response.messages.length} messages from ${channelType}/${channelId}`);
      return { success: true, messages: response.messages };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error(`❌ Failed to get messages from ${channelType}/${channelId}: ${errorMsg}`);
      throw new Error(`Message retrieval failed: ${errorMsg}`);
    }
  }
}
