import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

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
    const service = await this.serviceRepo.findOne({ where: { id }, relations: ['endpoints', 'tenant'] });
    if (!service) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }
    return service;
  }

  async create(dto: CreateServiceDto) {
    const service = this.serviceRepo.create(dto);
    return this.serviceRepo.save(service);
  }

  async update(id: string, dto: UpdateServiceDto) {
    await this.serviceRepo.update(id, dto);
    const service = await this.serviceRepo.findOne({ where: { id }, relations: ['endpoints'] });
    if (!service) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }
    return service;
  }

  async delete(id: string) {
    const result = await this.serviceRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }
  }
}
