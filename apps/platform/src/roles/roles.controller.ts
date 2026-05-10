import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  @Roles('roles:read')
  @ApiOperation({ summary: 'List all roles' })
  @ApiBearerAuth()
  findAll(@Req() req) {
    return this.rolesService.findAllByTenant(req.user.tenantId);
  }

  @Get('permissions')
  @Roles('roles:read')
  @ApiOperation({ summary: 'List all permissions' })
  @ApiBearerAuth()
  getAllPermissions() {
    return this.rolesService.getAllPermissions();
  }

  @Get(':id')
  @Roles('roles:read')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @Roles('roles:write')
  @ApiOperation({ summary: 'Create role' })
  @ApiBearerAuth()
  create(@Body() data: Partial<Role>) {
    return this.rolesService.create(data);
  }

  @Patch(':id')
  @Roles('roles:write')
  @ApiOperation({ summary: 'Update role' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() data: Partial<Role>) {
    return this.rolesService.update(id, data);
  }

  @Delete(':id')
  @Roles('roles:delete')
  @ApiOperation({ summary: 'Delete role' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.rolesService.delete(id);
  }

  @Post(':id/permissions')
  @Roles('roles:write')
  @ApiOperation({ summary: 'Assign permissions to role' })
  @ApiBearerAuth()
  assignPermissions(@Param('id') roleId: string, @Body('permissionIds') permissionIds: string[]) {
    return this.rolesService.assignPermissions(roleId, permissionIds);
  }
}
