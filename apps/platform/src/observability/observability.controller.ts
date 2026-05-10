import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ObservabilityService } from './observability.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';

@ApiTags('Observability')
@Controller('observability')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ObservabilityController {
  constructor(private observabilityService: ObservabilityService) {}

  @Get('llm-calls')
  @Roles('observability:read')
  @ApiOperation({ summary: 'Get LLM calls' })
  list(@Req() req, @Query() filters: any) {
    return this.observabilityService.getCalls(req.user.tenantId, filters);
  }

  @Get('metrics')
  @Roles('observability:read')
  @ApiOperation({ summary: 'Get aggregated metrics' })
  getMetrics(@Query() params: any) {
    return this.observabilityService.getMetrics(
      params.tenantId,
      params.metricName,
      new Date(params.startTime),
      new Date(params.endTime),
      params.interval,
    );
  }

  @Post('traces')
  @Roles('observability:write')
  @ApiOperation({ summary: 'Ingest trace data' })
  ingest(@Body() trace: any, @Req() req) {
    return this.observabilityService.saveTrace({
      ...trace,
      tenantId: req.user.tenantId,
    });
  }

  @Get('traces/:traceId')
  @Roles('observability:read')
  @ApiOperation({ summary: 'Get trace by ID' })
  findTrace(@Param('traceId') traceId: string, @Req() req) {
    return this.observabilityService.findTrace(traceId, req.user.tenantId);
  }
}
