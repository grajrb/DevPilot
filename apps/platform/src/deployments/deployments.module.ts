import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeploymentsController } from './deployments.controller';
import { DeploymentsService } from './deployments.service';
import { Deployment } from './entities/deployment.entity';
import { TenantsModule } from '../tenants/tenants.module';
import { ServicesModule } from '../services/services.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Deployment]),
    TenantsModule,
    ServicesModule,
    UsersModule,
  ],
  controllers: [DeploymentsController],
  providers: [DeploymentsService],
  exports: [DeploymentsService],
})
export class DeploymentsModule {}
