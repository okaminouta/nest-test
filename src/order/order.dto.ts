import { IsArray, IsString } from 'class-validator';
import { UserRO } from 'user/user.dto';
import { ProductRo } from '../product/product.dto';
import { ProductEntity } from '../product/product.entity';

export class OrderDto {
  @IsArray()
  readonly products: string[];

  @IsString()
  readonly description: string;
}

export class OrderRo {
  id: string;
  created_at: Date;
  updated_at: Date;
  price: number;
  description: string;
  ordered_by: UserRO;
  products: ProductEntity[];
}
