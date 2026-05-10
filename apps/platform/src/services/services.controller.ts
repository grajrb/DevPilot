import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';

@ApiTags('Services')
@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  @Roles('services:read')
  @ApiOperation({ summary: 'List all services' })
  findAll(@Req() req) {
    return this.servicesService.findByTenant(req.user.tenantId);
  }

  @Get(':id')
  @Roles('services:read')
  @ApiOperation({ summary: 'Get service' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findById(id);
  }

  @Post()
  @Roles('services:write')
  @ApiOperation({ summary: 'Register service' })
  create(@Body() dto: any, @Req() req) {
    return this.servicesService.create({ ...dto, tenantId: req.user.tenantId });
  }

  @Patch(':id')
  @Roles('services:write')
  @ApiOperation({ summary: 'Update service' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('services:delete')
  @ApiOperation({ summary: 'Delete service' })
  remove(@Param('id') id: string) {
    return this.servicesService.delete(id);
  }
}
