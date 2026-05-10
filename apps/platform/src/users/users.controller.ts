import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles('users:read')
  @ApiOperation({ summary: 'List all users' })
  @ApiBearerAuth()
  findAll(@Req() req) {
    return this.usersService.findByTenant(req.user.tenantId);
  }

  @Get(':id')
  @Roles('users:read')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @Roles('users:write')
  @ApiOperation({ summary: 'Create user' })
  @ApiBearerAuth()
  create(@Body() dto: any) {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  @Roles('users:write')
  @ApiOperation({ summary: 'Update user' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: any) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Roles('users:delete')
  @ApiOperation({ summary: 'Delete user' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
