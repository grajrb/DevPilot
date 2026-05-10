import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { EvaluationsController } from './evaluations.controller';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsProcessor } from './processors/evaluations.processor';
import { Evaluation } from './entities/evaluation.entity';
import { Dataset } from './entities/dataset.entity';
import { EvaluationRun } from './entities/evaluation-run.entity';
import { EvaluationResult } from './entities/evaluation-result.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evaluation, Dataset, EvaluationRun, EvaluationResult]),
    BullModule.registerQueue({ name: 'evaluations' }),
  ],
  controllers: [EvaluationsController],
  providers: [EvaluationsService, EvaluationsProcessor],
  exports: [EvaluationsService],
})
export class EvaluationsModule {}
