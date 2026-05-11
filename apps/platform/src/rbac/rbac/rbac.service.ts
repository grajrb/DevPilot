import { Injectable } from '@nestjs/common';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class RBACService {
  constructor(
    private rolesService: RolesService,
    private usersService: UsersService,
  ) {}

  async userHasPermission(userId: string, permission: string): Promise<boolean> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      return false;
    }
    return user.permissions.includes(permission);
  }

  async userHasRole(userId: string, role: string): Promise<boolean> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      return false;
    }
    return user.roles.some(r => r.name === role);
  }

  async assignRoleToUser(userId: string, roleId: string) {
    const user = await this.usersService.findById(userId);
    // Implementation would add role to user's roles
    return true;
  }

  async revokeRoleFromUser(userId: string, roleId: string) {
    // Implementation would remove role from user's roles
    return true;
  }
}
