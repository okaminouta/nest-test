import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  UpdateDateColumn, OneToMany, ManyToMany, JoinTable,
} from 'typeorm';
import { UserEntity } from 'user/user.entity';
import { ProductEntity } from '../product/product.entity';

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({
    type: 'numeric',
    default: 0,
  })
  price: number;

  @Column('text')
  description: string;

  @ManyToOne(type => UserEntity, user => user.orders)
  ordered_by: UserEntity;

  @ManyToMany(type => ProductEntity, product => product.orders)
  products: ProductEntity[];
}
