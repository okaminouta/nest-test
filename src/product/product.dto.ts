import { IsNumber, IsString } from 'class-validator';
import { UserRO } from 'user/user.dto';
import { OrderRo } from '../order/order.dto';
import { OrderEntity } from '../order/order.entity';

export class ProductDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsNumber()
  readonly price: number;
}

export class ProductRo {
  id: string;
  title: string;
  created_at: Date;
  updated_at: Date;
  description: string;
  price: number;
  created_by: UserRO;
  orders: OrderEntity[];
}
