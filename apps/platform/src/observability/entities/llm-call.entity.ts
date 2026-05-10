import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from '../tenants/entities/tenant.entity';
import { User } from '../users/entities/user.entity';
import { ApiKey } from '../api-keys/entities/api-key.entity';

@Entity('llm_calls')
export class LLMCall {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column('uuid')
  tenantId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('uuid', { nullable: true })
  userId: string;

  @Column('uuid', { nullable: true })
  sessionId: string;

  @ManyToOne(() => ApiKey, { nullable: true })
  @JoinColumn({ name: 'api_key_id' })
  apiKey: ApiKey;

  @Column('uuid', { nullable: true })
  apiKeyId: string;

  @Column({ length: 255 })
  model: string;

  @Column({ length: 100 })
  provider: string;

  @Column({ name: 'prompt_tokens', type: 'int' })
  promptTokens: number;

  @Column({ name: 'completion_tokens', type: 'int' })
  completionTokens: number;

  @Column({ name: 'total_tokens', type: 'int' })
  totalTokens: number;

  @Column('decimal', { precision: 10, scale: 6 })
  cost: number;

  @Column({ name: 'latency_ms', type: 'int' })
  latency: number;

  @Column({ default: true })
  success: boolean;

  @Column('text', { nullable: true })
  error: string;

  @Column('jsonb', { nullable: true, default: {} })
  metadata: Record<string, any>;

  @CreateDateColumn()
  timestamp: Date;
}
