import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationsController } from './evaluations.controller';
import { EvaluationsService } from './evaluations.service';
import { Evaluation, EvaluationRun, EvaluationResult, Dataset } from './entities/evaluation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evaluation, Dataset, EvaluationRun, EvaluationResult]),
  ],
  controllers: [EvaluationsController],
  providers: [EvaluationsService],
  exports: [EvaluationsService],
})
export class EvaluationsModule {}
