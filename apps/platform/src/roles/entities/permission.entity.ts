import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  code: string;

  @Column('text')
  description: string;

  @Column({ length: 50, nullable: true })
  category: string;

  @CreateDateColumn()
  createdAt: Date;
}
