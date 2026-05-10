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

@Entity('audit_logs')
export class AuditLog {
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

  @Column({ length: 100 })
  action: string;

  @Column({ length: 100 })
  resourceType: string;

  @Column('uuid', { nullable: true })
  resourceId: string;

  @Column('jsonb', { nullable: true })
  changes: Record<string, { from: any; to: any }>;

  @Column('jsonb', { nullable: true, default: {} })
  metadata: Record<string, any>;

  @Column({ type: 'inet' })
  ipAddress: string;

  @Column({ type: 'text' })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;
}
