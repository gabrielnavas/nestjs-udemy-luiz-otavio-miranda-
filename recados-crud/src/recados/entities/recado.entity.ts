import { Pessoa } from 'src/pessoas/entities/pessoa.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'recados' })
export class Recado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  text: string;

  @ManyToOne(() => Pessoa, {nullable: false})
  @JoinColumn({ name: 'from_id' })
  from: Pessoa;

  @ManyToOne(() => Pessoa, {nullable: false})
  @JoinColumn({ name: 'to_id' })
  to: Pessoa;

  @Column({ type: 'boolean', default: false })
  read: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
    default: new Date(),
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
