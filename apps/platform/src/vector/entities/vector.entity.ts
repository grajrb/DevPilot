import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Entity('vectors')
export class Vector {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column('uuid')
  tenantId: string;

  @Column('uuid')
  collectionId: string;

  @Column('vector', {
    type: 'vector',
    dimension: 1536,
    nullable: true,
  })
  embedding: number[] | null;

  @Column('text')
  content: string;

  @Column('jsonb', { nullable: true, default: {} })
  metadata: Record<string, any>;

  @Column({ name: 'chunk_count', default: 1, type: 'int' })
  chunkCount: number;

  @CreateDateColumn()
  createdAt: Date;
}
