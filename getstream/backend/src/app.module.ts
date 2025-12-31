import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StreamChatService } from './stream-chat.service';
import { StreamChatController } from './stream-chat.controller';

@Module({
  imports: [],
  controllers: [AppController, StreamChatController],
  providers: [AppService, StreamChatService],
})
export class AppModule {}
