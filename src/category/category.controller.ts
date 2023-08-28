import { Controller, Get, Post, UsePipes, UseGuards, Body, Put, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryEntity } from './category.entity';
import { BackendValidationPipe } from '@app/shared/backendValidation.pipe';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { CategoriesResponseInterface } from './types/categoriesResponse.interface';
import { CategoryResponseInterface } from './types/categoryResponse.interface';
import { DeleteResult } from 'typeorm';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService
  ) { }

  @Get()
  async findAllCategories(): Promise<CategoriesResponseInterface> {
    return this.categoryService.findAll()
  }

  @Post('category-form')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async createCategory(@Body('category') createCategoryDto: CreateCategoryDto): Promise<CategoryResponseInterface> {
    const category = await this.categoryService.createCategory(createCategoryDto);
    return this.categoryService.buildCategoryResponse(category)
  }
  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async updateCategory(
    @Param('slug') slug: string, @Body('category') createCategoryDto: CreateCategoryDto): Promise<CategoryResponseInterface> {
    const category = await this.categoryService.updateCategory(slug, createCategoryDto);
    return this.categoryService.buildCategoryResponse(category)
  }
  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteCategoryById(
    @Param('slug') slug: string): Promise<DeleteResult> {
    return await this.categoryService.deleteCategory(slug);
  }
}
