import {
  Controller,
  Get,
  Logger,
  Post,
  Param,
  Body,
  Delete,
  Put,
  UsePipes,
  UseGuards,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { ProductDto } from './product.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from 'shared/auth.gaurd';
import { User } from 'user/user.decorator';

@Controller('api/products')
export class ProductController {
  private logger = new Logger('ProductController');

  constructor(private productService: ProductService) {}

  @Get()
  showAllProducts() {
    return this.productService.showAll();
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createProduct(@User('id') user, @Body() body: ProductDto) {
    return this.productService.create(user, body);
  }

  @Get(':id')
  readProduct(@Param('id') id: string) {
    return this.productService.read(id);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  updateProduct(
    @Param('id') id: string,
    @User('id') user,
    @Body() body: Partial<ProductDto>,
  ) {
    return this.productService.update(id, user, body);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  destroyProduct(@Param('id') id: string, @User('id') user) {
    return this.productService.destroy(id, user);
  }
}
