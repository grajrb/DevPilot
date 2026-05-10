import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LLMCall } from './entities/llm-call.entity';
import { Trace } from './entities/trace.entity';

@Injectable()
export class ObservabilityService {
  constructor(
    @InjectRepository(LLMCall)
    private llmCallRepo: Repository<LLMCall>,
    @InjectRepository(Trace)
    private traceRepo: Repository<Trace>,
  ) {}

  async recordCall(data: Partial<LLMCall>) {
    const call = this.llmCallRepo.create(data);
    return this.llmCallRepo.save(call);
  }

  async getCalls(tenantId: string, filters: any) {
    const query = this.llmCallRepo.createQueryBuilder('call')
      .where('call.tenantId = :tenantId', { tenantId });

    if (filters.userId) {
      query.andWhere('call.userId = :userId', { userId: filters.userId });
    }
    if (filters.model) {
      query.andWhere('call.model = :model', { model: filters.model });
    }
    if (filters.startTime) {
      query.andWhere('call.timestamp >= :start', { start: filters.startTime });
    }
    if (filters.endTime) {
      query.andWhere('call.timestamp <= :end', { end: filters.endTime });
    }

    query.orderBy('call.timestamp', 'DESC')
      .limit(filters.limit || 100)
      .offset(filters.offset || 0);

    return query.getManyAndCount();
  }

  async getMetrics(tenantId: string, metricName: string, startTime: Date, endTime: Date, interval: string) {
    // This would use database aggregation functions (timescaleDB style)
    // For now return dummy data
    return [];
  }

  async saveTrace(trace: Partial<Trace>) {
    const t = this.traceRepo.create(trace);
    return this.traceRepo.save(t);
  }

  async findTrace(traceId: string, tenantId: string) {
    return this.traceRepo.findOne({
      where: { traceId, tenantId },
      relations: ['spans'],
    });
  }
}
