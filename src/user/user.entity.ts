import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { UserRO } from './user.dto';
import { ProductEntity } from 'product/product.entity';
import { OrderEntity } from '../order/order.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  @OneToMany(type => ProductEntity, product => product.created_by, {
    cascade: true,
  })
  products: ProductEntity[];

  @OneToMany(type => OrderEntity, order => order.ordered_by, {
    cascade: true,
  })
  orders: OrderEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  toResponseObject(showToken: boolean = false): UserRO {
    const { id, created_at, username, token } = this;
    const responseObject: UserRO = {
      id,
      created_at,
      username,
    };

    if (this.products) {
      responseObject.products = this.products;
    }

    if (showToken) {
      responseObject.token = token;
    }

    return responseObject;
  }

  private get token(): string {
    const { id, username } = this;

    return jwt.sign(
      {
        id,
        username,
      },
      process.env.SECRET,
      { expiresIn: '14d' },
    );
  }
}
