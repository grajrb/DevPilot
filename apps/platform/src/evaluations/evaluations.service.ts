import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluation, Dataset, EvaluationRun } from './entities/evaluation.entity';

@Injectable()
export class EvaluationsService {
  constructor(
    @InjectRepository(Evaluation)
    private evalRepo: Repository<Evaluation>,
    @InjectRepository(Dataset)
    private datasetRepo: Repository<Dataset>,
    @InjectRepository(EvaluationRun)
    private runRepo: Repository<EvaluationRun>,
  ) {}

  async create(data: Partial<Evaluation>) {
    const evaluation = this.evalRepo.create(data);
    return this.evalRepo.save(evaluation);
  }

  async findAll(tenantId: string) {
    return this.evalRepo.find({
      where: { tenantId },
      relations: ['dataset', 'runs'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.evalRepo.findOne({
      where: { id },
      relations: ['dataset', 'runs', 'runs.results'],
    });
  }

  async run(id: string, userId: string) {
    const evaluation = await this.evalRepo.findOne({ where: { id } });
    if (!evaluation) {
      throw new Error('Evaluation not found');
    }

    const run = this.runRepo.create({
      evaluationId: id,
      startedByUserId: userId,
      status: 'pending',
    });
    await this.runRepo.save(run);

    return run;
  }

  async getResults(runId: string) {
    return this.runRepo.findOne({
      where: { id: runId },
      relations: ['results'],
    });
  }

  async createDataset(data: Partial<Dataset>) {
    const dataset = this.datasetRepo.create(data);
    return this.datasetRepo.save(dataset);
  }

  async listDatasets(tenantId: string) {
    return this.datasetRepo.find({ where: { tenantId } });
  }
}
