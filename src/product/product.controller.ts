import { Controller, Get, Inject } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) { }

  @Get()
  async findAll(): Promise<any> {
    return await this.productService.findAll()
  }
}
