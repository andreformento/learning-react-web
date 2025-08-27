import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { StreamChatService } from './stream-chat.service';

@Controller('chat')
export class StreamChatController {
  constructor(private readonly streamChatService: StreamChatService) {}

  @Post('users/token')
  async createUserToken(@Body() body: { userId: string }) {
    const token = this.streamChatService.createUserToken(body.userId);
    return {
      success: true,
      userId: body.userId,
      token,
      apiKey: process.env.STREAM_API_KEY,
      appId: process.env.STREAM_APP_ID,
    };
  }

  @Post('users')
  async createUser(@Body() body: { userId: string; userData?: any }) {
    return await this.streamChatService.createUser(body.userId, body.userData);
  }

  @Post('channels')
  async createChannel(@Body() body: { channelType: string; channelId: string; members: string[]; createdBy: string }) {
    return await this.streamChatService.createChannel(
      body.channelType,
      body.channelId,
      body.members,
      body.createdBy,
    );
  }

  @Post('channels/:channelType/:channelId/messages')
  async sendMessage(
    @Param('channelType') channelType: string,
    @Param('channelId') channelId: string,
    @Body() body: { text: string; userId: string },
  ) {
    return await this.streamChatService.sendMessage(
      channelType,
      channelId,
      { text: body.text },
      body.userId,
    );
  }

  @Get('channels/:channelType/:channelId/messages')
  async getMessages(
    @Param('channelType') channelType: string,
    @Param('channelId') channelId: string,
    @Query('limit') limit?: string,
  ) {
    return await this.streamChatService.getMessages(
      channelType,
      channelId,
      limit ? parseInt(limit) : 50,
    );
  }

  @Get('health')
  async health() {
    return {
      status: 'OK',
      message: 'Stream Chat Server is running',
      timestamp: new Date().toISOString(),
    };
  }
}
