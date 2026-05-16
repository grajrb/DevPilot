import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluation, EvaluationRun, EvaluationResult } from './entities/evaluation.entity';

@Injectable()
@Processor('evaluations')
export class EvaluationsProcessor {
  private readonly logger = new Logger(EvaluationsProcessor.name);

  constructor(
    @InjectRepository(Evaluation)
    private evalRepo: Repository<Evaluation>,
    @InjectRepository(EvaluationRun)
    private runRepo: Repository<EvaluationRun>,
    @InjectRepository(EvaluationResult)
    private resultRepo: Repository<EvaluationResult>,
  ) {}

  @Process('run-evaluation')
  async handleEvaluationRun(job: Job<{ evaluationId: string; runId: string; tenantId: string }>) {
    const { evaluationId, runId, tenantId } = job.data;
    this.logger.log(`Starting evaluation run: ${runId} for evaluation: ${evaluationId}`);

    try {
      // Update run status to running
      await this.runRepo.update(runId, { status: 'running' });

      const evaluation = await this.evalRepo.findOne({
        where: { id: evaluationId, tenantId },
        relations: ['dataset'],
      });

      if (!evaluation) {
        throw new Error(`Evaluation ${evaluationId} not found`);
      }

      // Simulate running evaluation examples
      // In production, this would call the AI backend with each example
      const totalExamples = 10; // Would come from dataset
      const results: Partial<EvaluationResult>[] = [];

      for (let i = 0; i < totalExamples; i++) {
        const score = Math.min(0.95, 0.5 + Math.random() * 0.5);
        const passed = score >= 0.7;

        const result = this.resultRepo.create({
          runId,
          exampleId: `example_${i}`,
          input: `Test input ${i}`,
          expected: `Expected output ${i}`,
          actual: `Generated output ${i}`,
          metrics: [
            { metricName: 'correctness', score, passed, details: {} },
            { metricName: 'relevance', score: Math.min(0.9, 0.4 + Math.random() * 0.5), passed: true, details: {} },
          ],
          overallScore: score,
          passed,
          latency: Math.floor(200 + Math.random() * 800),
          tokensUsed: Math.floor(50 + Math.random() * 200),
        });

        results.push(result);
        // Update progress every 20% of examples
        if (i % Math.ceil(totalExamples / 5) === 0) {
          const progress = Math.round((i / totalExamples) * 100);
          await job.progress(progress);
        }

        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate processing time
      }

      // Save results
      await this.resultRepo.save(results);

      const passed = results.filter(r => r.passed).length;
      const failed = results.filter(r => !r.passed).length;

      // Update run as completed
      await this.runRepo.update(runId, {
        status: 'completed',
        finishedAt: new Date(),
      });

      // Update evaluation status
      await this.evalRepo.update(evaluationId, {
        status: 'completed',
        completedAt: new Date(),
      });

      this.logger.log(`Evaluation run ${runId} completed: ${passed} passed, ${failed} failed`);
      await job.progress(100);

    } catch (error: any) {
      this.logger.error(`Evaluation run ${runId} failed: ${error.message}`);
      await this.runRepo.update(runId, {
        status: 'failed',
        error: error.message,
        finishedAt: new Date(),
      });
      await this.evalRepo.update(evaluationId, {
        status: 'failed',
        error: error.message,
      });
      throw error;
    }
  }
}