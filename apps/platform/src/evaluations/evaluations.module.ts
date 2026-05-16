import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { EvaluationsController } from './evaluations.controller';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsProcessor } from './evaluations.processor';
import { Evaluation, EvaluationRun, EvaluationResult, Dataset } from './entities/evaluation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evaluation, EvaluationRun, EvaluationResult, Dataset]),
    BullModule.registerQueue({ name: 'evaluations' }),
  ],
  controllers: [EvaluationsController],
  providers: [EvaluationsService, EvaluationsProcessor],
  exports: [EvaluationsService],
})
export class EvaluationsModule {}