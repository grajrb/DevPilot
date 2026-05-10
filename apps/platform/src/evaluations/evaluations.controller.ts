import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EvaluationsService } from './evaluations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';

@ApiTags('Evaluations')
@Controller('evaluations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EvaluationsController {
  constructor(private evaluationsService: EvaluationsService) {}

  @Get()
  @Roles('evaluations:read')
  @ApiOperation({ summary: 'List evaluations' })
  findAll(@Req() req) {
    return this.evaluationsService.findAll(req.user.tenantId);
  }

  @Get(':id')
  @Roles('evaluations:read')
  @ApiOperation({ summary: 'Get evaluation' })
  findOne(@Param('id') id: string) {
    return this.evaluationsService.findOne(id);
  }

  @Post()
  @Roles('evaluations:write')
  @ApiOperation({ summary: 'Create evaluation' })
  create(@Body() dto: any, @Req() req) {
    return this.evaluationsService.create({
      ...dto,
      tenantId: req.user.tenantId,
      createdByUserId: req.user.id,
    });
  }

  @Post(':id/run')
  @Roles('evaluations:run')
  @ApiOperation({ summary: 'Run evaluation' })
  run(@Param('id') id: string, @Req() req) {
    return this.evaluationsService.run(id, req.user.id);
  }

  @Get('runs/:runId/results')
  @Roles('evaluations:read')
  @ApiOperation({ summary: 'Get evaluation run results' })
  getResults(@Param('runId') runId: string) {
    return this.evaluationsService.getResults(runId);
  }

  @Get('datasets')
  @Roles('evaluations:read')
  @ApiOperation({ summary: 'List datasets' })
  listDatasets(@Req() req) {
    return this.evaluationsService.listDatasets(req.user.tenantId);
  }
}
