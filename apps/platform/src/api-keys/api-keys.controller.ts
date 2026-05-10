import { Controller, Get, Post, Body, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApiKeysService } from './api-keys.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';

@ApiTags('API Keys')
@Controller('api-keys')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApiKeysController {
  constructor(private apiKeysService: ApiKeysService) {}

  @Get()
  @Roles('apiKeys:read')
  @ApiOperation({ summary: 'List API keys' })
  @ApiBearerAuth()
  findAll(@Req() req) {
    return this.apiKeysService.findAllByTenant(req.user.tenantId);
  }

  @Post()
  @Roles('apiKeys:write')
  @ApiOperation({ summary: 'Create API key' })
  @ApiBearerAuth()
  create(@Body() dto: any, @Req() req) {
    return this.apiKeysService.create({
      ...dto,
      userId: req.user.id,
      tenantId: req.user.tenantId,
    });
  }

  @Delete(':id')
  @Roles('apiKeys:delete')
  @ApiOperation({ summary: 'Revoke API key' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.apiKeysService.revoke(id);
  }
}
