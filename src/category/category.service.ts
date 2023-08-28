import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CategoryEntity } from './category.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { CategoryResponseInterface } from './types/categoryResponse.interface';
import { CategoriesResponseInterface } from './types/categoriesResponse.interface';
import { SharedService } from '@app/shared/shared.service';
import { cursorTo } from 'readline';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly sharedService: SharedService
  ) { }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const currentCategory = await this.categoryRepository.findOne({
      where: {
        title: createCategoryDto.title
      }
    });
    if (currentCategory) {
      throw new HttpException('Category has already been taken', HttpStatus.FORBIDDEN)
    }
    const category = new CategoryEntity;
    Object.assign(category, createCategoryDto);
    category.slug = this.sharedService.getSlug(createCategoryDto.title);
    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<CategoriesResponseInterface> {
    return { categories: await this.categoryRepository.find() }
  }

  async updateCategory(slug: string, createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: {
        slug
      }
    });
    if (category) {
      Object.assign(category, createCategoryDto)
    } else {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND)
    }
    return await this.categoryRepository.save(category);
  }

  async deleteCategory(slug: string): Promise<DeleteResult> {
    const category = await this.categoryRepository.findOne({
      where: { slug }
    });

    if (!category) {
      throw new HttpException('Article does not exist', HttpStatus.FORBIDDEN)
    }

    return await this.categoryRepository.delete({ slug })
  }
  buildCategoryResponse(category: CategoryEntity): CategoryResponseInterface {
    return { category };
  }
}
