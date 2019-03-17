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
  UseGuards, Query,
} from '@nestjs/common';

import { OrderService } from './order.service';
import { OrderDto } from './order.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from 'shared/auth.gaurd';
import { User } from 'user/user.decorator';

@Controller('admin/orders')
export class OrderController {
  private logger = new Logger('orderController');

  constructor(private orderService: OrderService) {}

  @Get()
  @UseGuards(new AuthGuard())
  showAllOrders(
    @Query('page') page: number,
    @Query('per_page') perPage: number,
  ) {
    console.log(page, perPage)
    return this.orderService.showAll( page, perPage);
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createOrder(@User('id') user, @Body() body: OrderDto) {
    return this.orderService.create(user, body);
  }

  @Get(':id')
  readOrder(@Param('id') id: string) {
    return this.orderService.read(id);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  updateOrder(
    @Param('id') id: string,
    @User('id') user,
    @Body() body: Partial<OrderDto>,
  ) {
    return this.orderService.update(id, user, body);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  destroyOrder(@Param('id') id: string, @User('id') user) {
    return this.orderService.destroy(id, user);
  }
}
