import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,
  ) {}

  async findByTenant(tenantId: string) {
    return this.serviceRepo.find({ where: { tenantId }, relations: ['endpoints'] });
  }

  async findById(id: string) {
    return this.serviceRepo.findOne({ where: { id }, relations: ['endpoints', 'tenant'] });
  }

  async create(data: any) {
    const service = this.serviceRepo.create(data);
    return this.serviceRepo.save(service);
  }

  async update(id: string, data: any) {
    await this.serviceRepo.update(id, data);
    return this.serviceRepo.findOne({ where: { id } });
  }

  async delete(id: string) {
    await this.serviceRepo.delete(id);
  }
}
