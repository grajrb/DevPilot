import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documentation } from './entities/documentation.entity';

@Injectable()
export class DocsService {
  constructor(
    @InjectRepository(Documentation)
    private docRepo: Repository<Documentation>,
  ) {}

  async findByTenant(tenantId: string) {
    return this.docRepo.find({ where: { tenantId }, order: { updatedAt: 'DESC' } });
  }

  async findById(id: string) {
    return this.docRepo.findOne({ where: { id } });
  }

  async create(data: Partial<Documentation>) {
    const doc = this.docRepo.create(data);
    return this.docRepo.save(doc);
  }

  async update(id: string, data: Partial<Documentation>) {
    await this.docRepo.update(id, data);
    return this.docRepo.findOne({ where: { id } });
  }

  async delete(id: string) {
    await this.docRepo.delete(id);
  }

  async findBySlug(tenantId: string, slug: string, version?: string) {
    const where = { tenantId, slug };
    if (version) {
      (where as any).version = version;
    }
    return this.docRepo.findOne({
      where,
      order: version ? undefined : { createdAt: 'DESC' },
    });
  }
}
