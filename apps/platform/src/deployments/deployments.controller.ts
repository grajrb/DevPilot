import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DeploymentsService } from './deployments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';
import { CreateDeploymentDto } from './dto/create-deployment.dto';
import { UpdateDeploymentDto } from './dto/update-deployment.dto';

@ApiTags('Deployments')
@Controller('deployments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeploymentsController {
  constructor(private deploymentsService: DeploymentsService) {}

  @Get()
  @Roles('deployments:read')
  @ApiOperation({ summary: 'List all deployments' })
  @ApiBearerAuth()
  findAll(@Req() req) {
    return this.deploymentsService.findByTenant(req.user.tenantId);
  }

  @Get(':id')
  @Roles('deployments:read')
  @ApiOperation({ summary: 'Get deployment by ID' })
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.deploymentsService.findById(id);
  }

  @Post()
  @Roles('deployments:write')
  @ApiOperation({ summary: 'Create deployment' })
  @ApiBearerAuth()
  create(@Body() dto: CreateDeploymentDto, @Req() req) {
    return this.deploymentsService.create({ ...dto, tenantId: req.user.tenantId });
  }

  @Patch(':id')
  @Roles('deployments:write')
  @ApiOperation({ summary: 'Update deployment' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateDeploymentDto) {
    return this.deploymentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('deployments:delete')
  @ApiOperation({ summary: 'Delete deployment' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.deploymentsService.delete(id);
  }
}