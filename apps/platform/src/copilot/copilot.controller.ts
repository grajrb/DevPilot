import { Controller, Get, Post, Body, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CopilotService } from './copilot.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';

@ApiTags('Copilot')
@Controller('copilot')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CopilotController {
  constructor(private copilotService: CopilotService) {}

  @Get('sessions')
  @Roles('copilot:manage_sessions')
  @ApiOperation({ summary: 'List chat sessions' })
  @ApiBearerAuth()
  getSessions(@Req() req) {
    return this.copilotService.getSessions(req.user.id, req.user.tenantId);
  }

  @Get('sessions/:id')
  @Roles('copilot:manage_sessions')
  @ApiOperation({ summary: 'Get session with messages' })
  @ApiBearerAuth()
  getSession(@Param('id') id: string, @Req() req) {
    return this.copilotService.getSession(id, req.user.id);
  }

  @Post('sessions')
  @Roles('copilot:use')
  @ApiOperation({ summary: 'Create new session' })
  @ApiBearerAuth()
  createSession(@Body() dto: { title?: string }, @Req() req) {
    return this.copilotService.createSession(req.user.id, req.user.tenantId, dto.title);
  }

  @Post('sessions/:id/messages')
  @Roles('copilot:use')
  @ApiOperation({ summary: 'Add message to session' })
  @ApiBearerAuth()
  addMessage(@Param('id') sessionId: string, @Body() dto: { role: 'system' | 'user' | 'assistant'; content: string; tokenCount?: number }) {
    return this.copilotService.addMessage(sessionId, dto.role, dto.content, dto.tokenCount);
  }

  @Delete('sessions/:id')
  @Roles('copilot:manage_sessions')
  @ApiOperation({ summary: 'Delete session' })
  @ApiBearerAuth()
  deleteSession(@Param('id') id: string, @Req() req) {
    return this.copilotService.deleteSession(id, req.user.id);
  }
}
