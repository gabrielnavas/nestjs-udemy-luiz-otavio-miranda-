import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'recados' })
export class Recado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  text: string;

  @Column({ type: 'varchar', length: 50 })
  from: string;

  @Column({ type: 'varchar', length: 50 })
  to: string;

  @Column({ type: 'boolean', default: false })
  read: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
    default: new Date(),
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updatedAt?: Date;
}
