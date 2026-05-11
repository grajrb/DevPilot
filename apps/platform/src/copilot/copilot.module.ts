import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CopilotController } from './copilot.controller';
import { CopilotService } from './copilot.service';
import { ChatSession, ChatMessage } from './entities/chat-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatSession, ChatMessage])],
  controllers: [CopilotController],
  providers: [CopilotService],
  exports: [CopilotService],
})
export class CopilotModule {}
