import { Injectable, OnModuleInit } from '@nestjs/common';
import { StreamChat } from 'stream-chat';

@Injectable()
export class StreamChatService implements OnModuleInit {
  private serverClient: StreamChat;

  constructor() {
    // Service initialized
  }

  onModuleInit() {
    const apiKey = process.env.STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;
    const appId = process.env.STREAM_APP_ID;

    if (!apiKey || !apiSecret || !appId) {
      console.error('Missing environment variables: STREAM_API_KEY, STREAM_API_SECRET, or STREAM_APP_ID');
      throw new Error('STREAM_API_KEY, STREAM_API_SECRET, and STREAM_APP_ID must be set in environment variables');
    }

    this.serverClient = StreamChat.getInstance(apiKey, apiSecret);
  }

  createUserToken(userId: string): string {
    const token = this.serverClient.createToken(userId);
    return token;
  }

  async createUser(userId: string, userData?: any) {
    try {
      await this.serverClient.upsertUser({
        id: userId,
        ...userData,
      });

      return { success: true, userId };
    } catch (error) {
      if (error.message.includes('already exists')) {
        return { success: true, userId, message: 'User already exists' };
      }
      const errorMsg = error.response?.data?.message || error.message;
      console.error(`Failed to create user ${userId}: ${errorMsg}`);
      throw new Error(`User creation failed: ${errorMsg}`);
    }
  }

  async createChannel(channelType: string, channelId: string, members: string[], createdBy: string) {
    try {
      const channel = this.serverClient.channel(channelType, channelId, {
        members,
        created_by_id: createdBy,
      });
      await channel.create();

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
      console.error(`Failed to create channel ${channelType}/${channelId}: ${errorMsg}`);
      throw new Error(`Channel creation failed: ${errorMsg}`);
    }
  }

  async sendMessage(channelType: string, channelId: string, message: any, userId: string) {
    try {
      const channel = this.serverClient.channel(channelType, channelId);
      const response = await channel.sendMessage({
        ...message,
        user_id: userId,
      });

      return { success: true, message: response.message };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error(`Failed to send message to ${channelType}/${channelId}: ${errorMsg}`);
      throw new Error(`Message sending failed: ${errorMsg}`);
    }
  }

  async getMessages(channelType: string, channelId: string, limit = 50) {
    try {
      const channel = this.serverClient.channel(channelType, channelId);
      const response = await channel.query({ messages: { limit } });

      return { success: true, messages: response.messages };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error(`Failed to get messages from ${channelType}/${channelId}: ${errorMsg}`);
      throw new Error(`Message retrieval failed: ${errorMsg}`);
    }
  }

  async listChannels(userId: string) {
    try {
      const response = await this.serverClient.queryChannels(
        { members: { $in: [userId] } },
        undefined,
        { limit: 100 }
      );

      return response.map(channel => ({
        id: channel.id,
        name: channel.id,
        members: [userId],
        created_at: new Date().toISOString()
      }));
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error(`Failed to list channels for user ${userId}: ${errorMsg}`);
      throw new Error(`Channel listing failed: ${errorMsg}`);
    }
  }
}
