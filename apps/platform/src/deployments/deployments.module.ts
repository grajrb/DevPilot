import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeploymentsController } from './deployments.controller';
import { DeploymentsService } from './deployments.service';
import { Deployment } from './entities/deployment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deployment])],
  controllers: [DeploymentsController],
  providers: [DeploymentsService],
  exports: [DeploymentsService],
})
export class DeploymentsModule {}