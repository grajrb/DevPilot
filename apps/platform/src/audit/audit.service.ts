import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepo: Repository<AuditLog>,
  ) {}

  async log(data: {
    tenantId: string;
    userId: string;
    action: string;
    resourceType: string;
    resourceId: string;
    ipAddress: string;
    userAgent: string;
    changes?: Record<string, { from: any; to: any }>;
    metadata?: Record<string, any>;
  }) {
    const log = this.auditRepo.create(data);
    await this.auditRepo.save(log);
    return log;
  }

  async query(tenantId: string, filters: any = {}) {
    const query = this.auditRepo.createQueryBuilder('audit')
      .where('audit.tenantId = :tenantId', { tenantId });

    if (filters.userId) {
      query.andWhere('audit.userId = :userId', { userId: filters.userId });
    }
    if (filters.action) {
      query.andWhere('audit.action = :action', { action: filters.action });
    }
    if (filters.startDate) {
      query.andWhere('audit.createdAt >= :startDate', { startDate: filters.startDate });
    }
    if (filters.endDate) {
      query.andWhere('audit.createdAt <= :endDate', { endDate: filters.endDate });
    }

    query.orderBy('audit.createdAt', 'DESC')
      .limit(filters.limit || 100)
      .offset(filters.offset || 0);

    return query.getManyAndCount();
  }
}
