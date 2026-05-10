import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatSession } from './entities/chat-session.entity';
import { ChatMessage } from './entities/chat-message.entity';

@Injectable()
export class CopilotService {
  constructor(
    @InjectRepository(ChatSession)
    private sessionRepo: Repository<ChatSession>,
    @InjectRepository(ChatMessage)
    private messageRepo: Repository<ChatMessage>,
  ) {}

  async createSession(userId: string, tenantId: string, title?: string) {
    const session = this.sessionRepo.create({ userId, tenantId, title });
    return this.sessionRepo.save(session);
  }

  async getSessions(userId: string, tenantId: string) {
    return this.sessionRepo.find({
      where: { userId, tenantId },
      relations: ['messages'],
      order: { updatedAt: 'DESC' },
    });
  }

  async getSession(id: string, userId: string) {
    return this.sessionRepo.findOne({
      where: { id, userId },
      relations: ['messages'],
    });
  }

  async addMessage(sessionId: string, role: string, content: string, tokenCount?: number) {
    const message = this.messageRepo.create({
      sessionId,
      role,
      content,
      tokenCount,
    });
    return this.messageRepo.save(message);
  }

  async deleteSession(id: string, userId: string) {
    const session = await this.sessionRepo.findOne({ where: { id, userId } });
    if (!session) {
      throw new Error('Session not found');
    }
    await this.messageRepo.delete({ sessionId: id });
    await this.sessionRepo.delete(id);
  }
}
