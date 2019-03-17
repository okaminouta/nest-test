import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  UpdateDateColumn, JoinTable, ManyToMany,
} from 'typeorm';
import { UserEntity } from 'user/user.entity';
import { OrderEntity } from '../order/order.entity';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'numeric',
    default: 0,
  })
  price: number;

  @ManyToOne(type => UserEntity, user => user.products)
  created_by: UserEntity;

  @ManyToMany(type => OrderEntity, order => order.products)
  @JoinTable()
  orders: OrderEntity[];
}
