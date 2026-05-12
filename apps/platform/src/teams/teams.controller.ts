import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@ApiTags('Teams')
@Controller('teams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Get()
  @Roles('teams:read')
  @ApiOperation({ summary: 'List all teams' })
  @ApiBearerAuth()
  findAll(@Req() req) {
    return this.teamsService.findByTenant(req.user.tenantId);
  }

  @Get(':id')
  @Roles('teams:read')
  @ApiOperation({ summary: 'Get team by ID' })
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.teamsService.findById(id);
  }

  @Post()
  @Roles('teams:write')
  @ApiOperation({ summary: 'Create team' })
  @ApiBearerAuth()
  create(@Body() dto: CreateTeamDto, @Req() req) {
    // Ensure the team owner belongs to the same tenant
    return this.teamsService.create({ ...dto, tenantId: req.user.tenantId });
  }

  @Patch(':id')
  @Roles('teams:write')
  @ApiOperation({ summary: 'Update team' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateTeamDto) {
    return this.teamsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('teams:delete')
  @ApiOperation({ summary: 'Delete team' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.teamsService.delete(id);
  }

  @Post(':id/members')
  @Roles('teams:write')
  @ApiOperation({ summary: 'Add member to team' })
  @ApiBearerAuth()
  addMember(@Param('id') id: string, @Body('userId') userId: string) {
    return this.teamsService.addMember(id, userId);
  }

  @Delete(':id/members/:userId')
  @Roles('teams:write')
  @ApiOperation({ summary: 'Remove member from team' })
  @ApiBearerAuth()
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.teamsService.removeMember(id, userId);
  }
}