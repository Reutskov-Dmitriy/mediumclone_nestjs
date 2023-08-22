import { Injectable } from '@nestjs/common';
import { ProductEntity } from './product.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import slugify from 'slugify';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { ProductResponseInterface } from './types/productResponse.interface';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>
  ) { }

  async findAll(): Promise<any> {

  }

  async createProduct(currentUser: UserEntity, createProductDto: CreateProductDto): Promise<ProductEntity> {
    const product = new ProductEntity;
    Object.assign(product, createProductDto);
    product.slug = this.getSlug(createProductDto.title)
    product.author = currentUser;
    return this.productRepository.save(product)
  }

  private getSlug(title: string): string {
    return (slugify(title, { lower: true }) +
      '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
    );
  }

  buildProductResponse(product: ProductEntity): Promise<ProductResponseInterface> {
    return Promise.resolve({ product })
  }
}
