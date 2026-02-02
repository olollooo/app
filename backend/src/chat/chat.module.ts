import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { OpenAIService } from './openai/openai.service';
import { UsageModule } from '../usage/usage.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService, OpenAIService],
  imports: [UsageModule],
})
export class ChatModule {}
