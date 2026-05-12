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
import { User } from '../../users/entities/user.entity';

@Entity('teams')
export class Team {
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

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column('uuid')
  ownerId: string;

  @Column('uuid', { array: true, default: [] })
  memberIds: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}