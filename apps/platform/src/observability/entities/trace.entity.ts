import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Tenant } from '../tenants/entities/tenant.entity';

export type TraceStatus = 'unset' | 'ok' | 'error';

@Entity('traces')
export class Trace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column('uuid')
  tenantId: string;

  @Column({ name: 'trace_id', length: 255, unique: true })
  traceId: string;

  @Column({ name: 'root_span_name', length: 500 })
  rootSpanName: string;

  @Column('jsonb', { nullable: true, default: {} })
  metadata: Record<string, any>;

  @OneToMany(() => TraceSpan, (span) => span.trace)
  spans: TraceSpan[];

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('trace_spans')
export class TraceSpan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Trace, (trace) => trace.spans)
  @JoinColumn({ name: 'trace_id' })
  trace: Trace;

  @Column({ name: 'span_id', length: 255, unique: true })
  spanId: string;

  @Column({ name: 'parent_span_id', length: 255, nullable: true })
  parentSpanId: string;

  @Column({ length: 500 })
  name: string;

  @Column({ name: 'start_time', type: 'timestamptz' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamptz' })
  endTime: Date;

  @Column('jsonb', { default: {} })
  attributes: Record<string, any>;

  @Column('jsonb', { default: [] })
  events: Array<{
    name: string;
    timestamp: Date;
    attributes: Record<string, any>;
  }>;

  @Column({ length: 50, default: 'ok' })
  status: TraceStatus;
}
