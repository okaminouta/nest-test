import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, In, Repository } from 'typeorm';

import { OrderEntity } from './order.entity';
import { OrderDto, OrderRo } from './order.dto';
import { UserEntity } from 'user/user.entity';
import { ProductEntity } from 'product/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  private orderToResponseObject(order: OrderEntity): OrderRo {
    return {
      ...order,
      ordered_by: order.ordered_by ? order.ordered_by.toResponseObject() : null,
    };
  }

  private ensureOwnership(order: OrderEntity, userId: string) {
    if (order.ordered_by.id !== userId) {
      throw new HttpException('Incorrect User', HttpStatus.UNAUTHORIZED);
    }
  }

  async showAll(page = 1, perPage = 10) {
    // TODO refacto this staff
    const skip = (page - 1) * perPage;

    const total = await getRepository(OrderEntity)
      .createQueryBuilder('order')
      .getCount();

    const paginate = await getRepository(OrderEntity)
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.products', 'product')
      .leftJoinAndSelect('order.ordered_by', 'user')
      .skip(skip)
      .take(perPage)
      .getMany();

    // TODO fix selection of password
    const data = paginate.map( (el) => this.orderToResponseObject(el));

    return {
      success: true,
      total,
      data,
      current_page: page,
      last_page: Math.ceil(total / perPage),
      per_page: perPage,
    };
  }

  async read(id: string): Promise<OrderRo> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['ordered_by', 'products'],
    });

    if (!order) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return this.orderToResponseObject(order);
  }

  async create(userId: string, data: OrderDto): Promise<OrderRo> {

    const user = await this.userRepository.findOne({ where: { id: userId } });
    const products = await this.productRepository.find({ where: { id: In(data.products) }});

    if (!products || products.length === 0 ) throw new HttpException('No products was found', HttpStatus.BAD_REQUEST);

    const price = products.map((el) => el.price).reduce((total, current) => total + current);
    const order = await this.orderRepository.create({ ...data, ordered_by: user, products, price });

    await this.orderRepository.save(order);

    return this.orderToResponseObject(order);
  }

  async update(
    id: string,
    userId: string,
    data: Partial<OrderDto>,
  ) {
    let products = [];
    let price = 0;
    let order = await this.orderRepository.findOne({
      where: { id },
      relations: ['ordered_by', 'products'],
    });

    if (!order) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    if (data.products && data.products.length > 0) {
      products = await this.productRepository.find({ where: { id: In(data.products) } });
      price = products.map((el) => el.price).reduce((total, current) => total + current);
    }
    this.ensureOwnership(order, userId);
    await this.orderRepository.update({ id }, {...data, products, price});
    order = await this.orderRepository.findOne({
      where: { id },
      relations: ['ordered_by', 'products'],
    });
    return this.orderToResponseObject(order);
  }

  async destroy(id: string, userId: string): Promise<OrderRo> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['ordered_by', 'products'],
    });
    if (!order) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(order, userId);
    await this.orderRepository.remove(order);
    return this.orderToResponseObject(order);
  }
}
