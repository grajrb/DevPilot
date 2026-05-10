import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from '../tenants/entities/tenant.entity';

export type ServiceStatus = 'healthy' | 'degraded' | 'down';
export type ServiceProtocol = 'http' | 'grpc' | 'graphql';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, { eager: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column('uuid')
  tenantId: string;

  @Column({ length: 255 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ length: 50, default: 'http' })
  protocol: ServiceProtocol;

  @Column({ type: 'text', nullable: true })
  healthCheckUrl: string;

  @Column('jsonb', { default: {} })
  metadata: Record<string, any>;

  @OneToMany(() => ServiceEndpoint, (endpoint) => endpoint.service)
  endpoints: ServiceEndpoint[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('service_endpoints')
export class ServiceEndpoint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Service, (service) => service.endpoints)
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column('uuid')
  serviceId: string;

  @Column({ length: 500 })
  path: string;

  @Column({ length: 20 })
  method: string;

  @Column({ default: 30 })
  timeout: number;

  @Column({ default: 3 })
  retries: number;

  @CreateDateColumn()
  createdAt: Date;
}
