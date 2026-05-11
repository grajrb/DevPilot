import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { User } from '../../users/entities/user.entity';

export type EvaluationStatus = 'pending' | 'running' | 'completed' | 'failed';
export type EvaluationType = 'correctness' | 'relevance' | 'faithfulness' | 'custom';

@Entity('evaluations')
export class Evaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column('uuid')
  tenantId: string;

  @Column({ length: 255 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ length: 100 })
  type: EvaluationType;

  @Column('uuid')
  datasetId: string;

  @Column('jsonb', { default: [] })
  metrics: Array<{
    name: string;
    threshold: number;
    weight: number;
    parameters?: Record<string, any>;
  }>;

  @Column('jsonb', { default: {} })
  config: {
    batchSize: number;
    timeoutSeconds: number;
    concurrency: number;
  };

  @Column({ default: 'pending' })
  status: EvaluationStatus;

  @Column('uuid')
  createdByUserId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date;

  @Column('text', { nullable: true })
  error: string;

  @OneToMany(() => EvaluationRun, (run) => run.evaluation)
  runs: EvaluationRun[];
}

@Entity('evaluation_runs')
export class EvaluationRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Evaluation, (evaluation) => evaluation.runs)
  @JoinColumn({ name: 'evaluation_id' })
  evaluation: Evaluation;

  @Column('uuid')
  evaluationId: string;

  @Column({ default: 'running' })
  status: EvaluationStatus;

  @Column('uuid')
  startedByUserId: string;

  @CreateDateColumn()
  startedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  finishedAt: Date;

  @Column('text', { nullable: true })
  error: string;

  @OneToMany(() => EvaluationResult, (result) => result.run)
  results: EvaluationResult[];
}

@Entity('evaluation_results')
export class EvaluationResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => EvaluationRun, (run) => run.results)
  @JoinColumn({ name: 'run_id' })
  run: EvaluationRun;

  @Column('uuid')
  runId: string;

  @Column({ name: 'example_id' })
  exampleId: string;

  @Column('text')
  input: string;

  @Column('text', { nullable: true })
  expected: string;

  @Column('text')
  actual: string;

  @Column('jsonb', { default: [] })
  metrics: Array<{
    metricName: string;
    score: number;
    passed: boolean;
    details?: Record<string, any>;
  }>;

  @Column({ name: 'overall_score', type: 'decimal', precision: 5, scale: 4 })
  overallScore: number;

  @Column({ default: true })
  passed: boolean;

  @Column({ name: 'latency_ms', type: 'int' })
  latency: number;

  @Column({ name: 'tokens_used', type: 'int' })
  tokensUsed: number;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('datasets')
export class Dataset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column('uuid')
  tenantId: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 50, default: 'csv' })
  type: 'csv' | 'jsonl' | 'api' | 'manual';

  @Column('text', { nullable: true })
  storageLocation: string;

  @Column({ default: 0 })
  rowCount: number;

  @Column('jsonb', { nullable: true, default: {} })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
