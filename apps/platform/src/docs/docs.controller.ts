import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DocsService } from './docs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';

@ApiTags('Documentation')
@Controller('docs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocsController {
  constructor(private docsService: DocsService) {}

  @Get()
  @Roles('docs:read')
  @ApiOperation({ summary: 'List all docs' })
  findAll(@Req() req) {
    return this.docsService.findByTenant(req.user.tenantId);
  }

  @Get(':id')
  @Roles('docs:read')
  @ApiOperation({ summary: 'Get doc' })
  findOne(@Param('id') id: string) {
    return this.docsService.findById(id);
  }

  @Get('slug/:slug')
  @Roles('docs:read')
  @ApiOperation({ summary: 'Get doc by slug' })
  findBySlug(@Param('slug') slug: string, @Req() req) {
    return this.docsService.findBySlug(req.user.tenantId, slug);
  }

  @Post()
  @Roles('docs:write')
  @ApiOperation({ summary: 'Create doc' })
  create(@Body() dto: any, @Req() req) {
    return this.docsService.create({ ...dto, tenantId: req.user.tenantId, authorId: req.user.id });
  }

  @Patch(':id')
  @Roles('docs:write')
  @ApiOperation({ summary: 'Update doc' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.docsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('docs:delete')
  @ApiOperation({ summary: 'Delete doc' })
  remove(@Param('id') id: string) {
    return this.docsService.delete(id);
  }
}
