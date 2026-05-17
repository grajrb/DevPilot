import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deployment } from './entities/deployment.entity';
import { CreateDeploymentDto } from './dto/create-deployment.dto';
import { UpdateDeploymentDto } from './dto/update-deployment.dto';
import { TenantsService } from '../tenants/tenants.service';
import { ServicesService } from '../services/services.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class DeploymentsService {
  constructor(
    @InjectRepository(Deployment)
    private deploymentRepo: Repository<Deployment>,
    private tenantsService: TenantsService,
    private servicesService: ServicesService,
    private usersService: UsersService,
  ) {}

  async create(dto: CreateDeploymentDto): Promise<Deployment> {
    // Validate that the service exists and get its tenantId
    const service = await this.servicesService.findById(dto.serviceId);
    if (!service) {
      throw new NotFoundException(`Service with id ${dto.serviceId} not found`);
    }

    // Validate deployedBy user if provided
    let deployedBy = null;
    if (dto.deployedById) {
      deployedBy = await this.usersService.findById(dto.deployedById);
      if (!deployedBy) {
        throw new NotFoundException(`User with id ${dto.deployedById} not found`);
      }
      // Ensure user belongs to same tenant as service
      if (deployedBy.tenantId !== service.tenantId) {
        throw new Error('User does not belong to the same tenant as the service');
      }
    }

    const deployment = this.deploymentRepo.create({
      ...dto,
      tenantId: service.tenantId,
      serviceId: dto.serviceId,
      deployedById: dto.deployedById || null,
    });

    return this.deploymentRepo.save(deployment);
  }

  async findById(id: string): Promise<Deployment | null> {
    return this.deploymentRepo.findOne({
      where: { id },
      relations: ['tenant', 'service', 'deployedBy'],
    });
  }

  async findByTenant(tenantId: string): Promise<Deployment[]> {
    return this.deploymentRepo.find({
      where: { tenantId },
      relations: ['service'],
    });
  }

  async findByService(serviceId: string): Promise<Deployment[]> {
    return this.deploymentRepo.find({
      where: { serviceId },
      relations: ['tenant'],
    });
  }

  async update(id: string, dto: UpdateDeploymentDto): Promise<Deployment> {
    await this.deploymentRepo.update(id, dto);
    const deployment = await this.deploymentRepo.findOne({ where: { id } });
    if (!deployment) {
      throw new NotFoundException(`Deployment with id ${id} not found`);
    }
    return deployment;
  }

  async delete(id: string): Promise<void> {
    const result = await this.deploymentRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Deployment with id ${id} not found`);
    }
  }
}