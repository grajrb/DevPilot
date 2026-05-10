import { DynamicModule, Global, Module } from '@nestjs/common';
import { RBACService } from './rbac.service';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';

@Global()
@Module({})
export class RBACModule {
  static forRoot(): DynamicModule {
    return {
      module: RBACModule,
      imports: [RolesModule, UsersModule],
      providers: [RBACService, RolesGuard, PermissionsGuard],
      exports: [RBACService, RolesGuard, PermissionsGuard],
    };
  }
}
