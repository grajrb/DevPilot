import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';
import { UpsertSettingDto } from './dto/upsert-setting.dto';
import { SettingResponseDto } from './dto/setting-response.dto';

@ApiTags('Settings')
@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  @Roles('settings:read')
  @ApiOperation({ summary: 'List settings' })
  @ApiBearerAuth()
  async findAll(@Req() req) {
    // Get tenant-specific and system settings
    const tenantSettings = await this.settingsService.listByTenant(req.user.tenantId);
    // Note: In a real implementation, you might want to combine tenant and user settings
    return tenantSettings;
  }

  @Get('user')
  @Roles('settings:read')
  @ApiOperation({ summary: 'List user settings' })
  @ApiBearerAuth()
  async findUserSettings(@Req() req) {
    return this.settingsService.listByUser(req.user.id);
  }

  @Get(':id')
  @Roles('settings:read')
  @ApiOperation({ summary: 'Get setting by ID' })
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<SettingResponseDto> {
    return this.settingsService.findById(id);
  }

  @Post()
  @Roles('settings:write')
  @ApiOperation({ summary: 'Create setting' })
  @ApiBearerAuth()
  async create(@Body() dto: UpsertSettingDto, @Req() req): Promise<SettingResponseDto> {
    // For tenant-scoped settings, use current tenant
    if (!dto.scope) {
      dto.scope = 'tenant';
    }
    
    if (dto.scope === 'tenant') {
      dto.tenantId = req.user.tenantId;
    } else if (dto.scope === 'user') {
      dto.userId = req.user.id;
    }
    
    return this.settingsService.create(dto);
  }

  @Patch(':id')
  @Roles('settings:write')
  @ApiOperation({ summary: 'Update setting' })
  @ApiBearerAuth()
  async update(
    @Param('id') id: string, 
    @Body() dto: UpsertSettingDto,
  ): Promise<SettingResponseDto> {
    return this.settingsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('settings:delete')
  @ApiOperation({ summary: 'Delete setting' })
  @ApiBearerAuth()
  async remove(@Param('id') id: string): Promise<void> {
    return this.settingsService.delete(id);
  }
}