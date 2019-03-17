import { IsNotEmpty } from 'class-validator';
import { ProductEntity } from 'product/product.entity';

export class UserDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class UserRO {
  id: string;
  username: string;
  created_at: Date;
  token?: string;
  products?: ProductEntity[];
}
