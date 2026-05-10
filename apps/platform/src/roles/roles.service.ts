import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private permRepo: Repository<Permission>,
  ) {}

  async findAllByTenant(tenantId: string): Promise<Role[]> {
    return this.roleRepo.find({
      where: { tenantId },
      relations: ['permissions'],
    });
  }

  async findOne(id: string): Promise<Role | null> {
    return this.roleRepo.findOne({
      where: { id },
      relations: ['permissions'],
    });
  }

  async create(data: Partial<Role>): Promise<Role> {
    const role = this.roleRepo.create(data);
    return this.roleRepo.save(role);
  }

  async update(id: string, data: Partial<Role>): Promise<Role> {
    await this.roleRepo.update(id, data);
    return this.roleRepo.findOne({ where: { id }, relations: ['permissions'] });
  }

  async delete(id: string): Promise<void> {
    await this.roleRepo.delete(id);
  }

  async assignPermissions(roleId: string, permissionIds: string[]): Promise<Role> {
    const role = await this.roleRepo.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    if (!role) {
      throw new Error('Role not found');
    }

    const permissions = await this.permRepo.findByIds(permissionIds);
    role.permissions = permissions;
    return this.roleRepo.save(role);
  }

  async getAllPermissions(): Promise<Permission[]> {
    return this.permRepo.find({ order: { category: 'ASC', code: 'ASC' } });
  }
}
