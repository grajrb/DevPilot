import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { UpsertSettingDto } from './dto/upsert-setting.dto';
import { SettingResponseDto } from './dto/setting-response.dto';
import { TenantsService } from '../tenants/tenants.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingRepo: Repository<Setting>,
    private tenantsService: TenantsService,
    private usersService: UsersService,
  ) {}

  async create(dto: UpsertSettingDto): Promise<SettingResponseDto> {
    // Validate references if provided
    if (dto.scope === 'tenant' && dto.tenantId) {
      await this.tenantsService.findOne(dto.tenantId);
    }
    
    if (dto.scope === 'user' && dto.userId) {
      await this.usersService.findById(dto.userId);
    }

    // Ensure tenantId/userId match scope
    const setting = this.settingRepo.create({
      key: dto.key,
      value: dto.value,
      scope: dto.scope || 'tenant',
      tenantId: dto.scope === 'tenant' ? dto.tenantId : null,
      userId: dto.scope === 'user' ? dto.userId : null,
    });

    const saved = await this.settingRepo.save(setting);
    return this.toResponseDto(saved);
  }

  async findById(id: string): Promise<SettingResponseDto> {
    const setting = await this.settingRepo.findOne({
      where: { id },
      relations: ['tenant', 'user'],
    });
    
    if (!setting) {
      throw new NotFoundException(`Setting with id ${id} not found`);
    }
    
    return this.toResponseDto(setting);
  }

  async findByKeyAndScope(
    key: string, 
    scope: 'tenant' | 'user' | 'system',
    tenantId?: string,
    userId?: string
  ): Promise<Setting | null> {
    const where: any = { key, scope };
    
    if (scope === 'tenant' && tenantId) {
      where.tenantId = tenantId;
    }
    
    if (scope === 'user' && userId) {
      where.userId = userId;
    }
    
    if (scope === 'system') {
      where.tenantId = null;
      where.userId = null;
    }
    
    return this.settingRepo.findOne({ where });
  }

  async update(id: string, dto: UpsertSettingDto): Promise<SettingResponseDto> {
    const setting = await this.settingRepo.findOne({ where: { id } });
    
    if (!setting) {
      throw new NotFoundException(`Setting with id ${id} not found`);
    }
    
    // Validate references if provided
    if (dto.scope === 'tenant' && dto.tenantId) {
      await this.tenantsService.findOne(dto.tenantId);
    }
    
    if (dto.scope === 'user' && dto.userId) {
      await this.usersService.findById(dto.userId);
    }
    
    // Update fields
    setting.key = dto.key;
    setting.value = dto.value;
    setting.scope = dto.scope || setting.scope;
    
    // Handle tenantId/userId based on scope
    if (dto.scope === 'tenant') {
      setting.tenantId = dto.tenantId || null;
      setting.userId = null;
    } else if (dto.scope === 'user') {
      setting.tenantId = null;
      setting.userId = dto.userId || null;
    } else if (dto.scope === 'system') {
      setting.tenantId = null;
      setting.userId = null;
    }
    
    const updated = await this.settingRepo.save(setting);
    return this.toResponseDto(updated);
  }

  async delete(id: string): Promise<void> {
    const result = await this.settingRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Setting with id ${id} not found`);
    }
  }

  async listByTenant(tenantId: string): Promise<SettingResponseDto[]> {
    const settings = await this.settingRepo.find({
      where: [{ tenantId }, { tenantId: null, userId: null }], // tenant-specific + system
      order: { key: 'ASC' },
    });
    
    return settings.map(setting => this.toResponseDto(setting));
  }

  async listByUser(userId: string): Promise<SettingResponseDto[]> {
    const settings = await this.settingRepo.find({
      where: [{ userId }, { userId: null, tenantId: null }], // user-specific + system
      order: { key: 'ASC' },
    });
    
    return settings.map(setting => this.toResponseDto(setting));
  }

  private toResponseDto(setting: Setting): SettingResponseDto {
    return {
      id: setting.id,
      key: setting.key,
      value: setting.value,
      scope: setting.scope,
      tenantId: setting.tenantId,
      userId: setting.userId,
      createdAt: setting.createdAt,
      updatedAt: setting.updatedAt,
    };
  }
}