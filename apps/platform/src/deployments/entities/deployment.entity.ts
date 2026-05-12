import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Service } from '../../services/entities/service.entity';
import { User } from '../../users/entities/user.entity';

export type DeploymentStatus = 'pending' | 'deploying' | 'success' | 'failed';

@Entity('deployments')
export class Deployment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, { eager: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column('uuid')
  tenantId: string;

  @ManyToOne(() => Service, { eager: true })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column('uuid')
  serviceId: string;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'deployed_by_id' })
  deployedBy: User;

  @Column('uuid', { nullable: true })
  deployedById: string;

  @Column({ length: 100 })
  version: string;

  @Column({ type: 'enum', enum: ['pending', 'deploying', 'success', 'failed'], default: 'pending' })
  status: DeploymentStatus;

  @Column('text', { nullable: true })
  logs: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}