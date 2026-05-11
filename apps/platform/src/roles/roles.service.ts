import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ) {}

  async findAllByTenant(tenantId: string): Promise<Role[]> {
    return this.roleRepo.find({ where: { tenantId } });
  }

  async findOne(id: string): Promise<Role | null> {
    return this.roleRepo.findOne({ where: { id } });
  }

  async create(data: Partial<Role>): Promise<Role> {
    const role = this.roleRepo.create(data);
    return this.roleRepo.save(role);
  }

  async update(id: string, data: Partial<Role>): Promise<Role> {
    await this.roleRepo.update(id, data);
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) {
      throw new Error(`Role with id ${id} not found`);
    }
    return role;
  }

  async delete(id: string): Promise<void> {
    await this.roleRepo.delete(id);
  }

  async assignPermissions(roleId: string, permissionCodes: string[]): Promise<Role> {
    const role = await this.roleRepo.findOne({ where: { id: roleId } });
    if (!role) {
      throw new Error('Role not found');
    }

    role.permissionCodes = permissionCodes;
    return this.roleRepo.save(role);
  }
}
