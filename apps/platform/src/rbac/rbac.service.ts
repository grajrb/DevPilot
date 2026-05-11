import { Injectable } from '@nestjs/common';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class RBACService {
  constructor(private rolesService: RolesService) {}

  async getUserPermissions(userId: string): Promise<string[]> {
    return [];
  }
}