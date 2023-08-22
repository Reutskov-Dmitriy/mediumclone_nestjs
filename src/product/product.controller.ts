import { Controller, Get, Post, Body, UseGuards, UsePipes } from '@nestjs/common';
import { ProductService } from './product.service';
import { User } from '@app/decorators/user.decorator';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { CreateProductDto } from './dto/createProduct.dto';
import { ProductResponseInterface } from './types/productResponse.interface';
import { UserEntity } from '@app/user/user.entity';
import { BackendValidationPipe } from '@app/shared/backendValidation.pipe';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) { }

  @Get()
  async findAll(): Promise<any> {
    return await this.productService.findAll()
  }

  @Post('product-form')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async createProduct(@User() currentUser: UserEntity, @Body('product') createProductDto: CreateProductDto): Promise<ProductResponseInterface> {
    const product = await this.productService.createProduct(currentUser, createProductDto);
    return
  }
}
