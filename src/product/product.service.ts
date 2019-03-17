import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductEntity } from './product.entity';
import { ProductDto, ProductRo } from './product.dto';
import { UserEntity } from 'user/user.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private productToResponseObject(product: ProductEntity): ProductRo {
    return {
      ...product,
      created_by: product.created_by ? product.created_by.toResponseObject() : null,
    };
  }

  private ensureOwnership(product: ProductEntity, userId: string) {
    if (product.created_by.id !== userId) {
      throw new HttpException('Incorrect User', HttpStatus.UNAUTHORIZED);
    }
  }

  async showAll(): Promise<ProductRo[]> {
    const products = await this.productRepository.find({ relations: ['created_by', 'orders'] });
    return products.map(product => this.productToResponseObject(product));
  }

  async read(id: string): Promise<ProductRo> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['created_by', 'orders'],
    });

    if (!product) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return this.productToResponseObject(product);
  }

  async create(userId: string, data: ProductDto): Promise<ProductRo> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const product = await this.productRepository.create({ ...data, created_by: user });
    await this.productRepository.save(product);
    return this.productToResponseObject(product);
  }

  async update(
    id: string,
    userId: string,
    data: Partial<ProductDto>,
  ): Promise<ProductRo> {
    let product = await this.productRepository.findOne({
      where: { id },
      relations: ['created_by', 'orders'],
    });
    if (!product) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(product, userId);
    await this.productRepository.update({ id }, data);
    product = await this.productRepository.findOne({
      where: { id },
      relations: ['created_by', 'orders'],
    });
    return this.productToResponseObject(product);
  }

  async destroy(id: string, userId: string): Promise<ProductRo> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['created_by', 'orders'],
    });
    if (!product) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(product, userId);
    await this.productRepository.remove(product);
    return this.productToResponseObject(product);
  }
}
