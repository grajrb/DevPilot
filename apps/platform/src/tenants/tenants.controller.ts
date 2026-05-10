import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';
import { Tenant } from './entities/tenant.entity';

@ApiTags('Tenants')
@Controller('tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  @Get()
  @Roles('tenant:manage')
  @ApiOperation({ summary: 'List all tenants' })
  @ApiBearerAuth()
  findAll() {
    return this.tenantsService.getAll();
  }

  @Get(':id')
  @Roles('tenant:manage')
  @ApiOperation({ summary: 'Get tenant by ID' })
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @Post()
  @Roles('tenant:manage')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new tenant' })
  @ApiBearerAuth()
  create(@Body() data: Partial<Tenant>) {
    return this.tenantsService.create(data);
  }

  @Patch(':id')
  @Roles('tenant:manage')
  @ApiOperation({ summary: 'Update tenant' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() data: Partial<Tenant>) {
    return this.tenantsService.update(id, data);
  }

  @Delete(':id')
  @Roles('tenant:manage')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete tenant' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.tenantsService.delete(id);
  }
}
