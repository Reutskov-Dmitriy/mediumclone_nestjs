import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { SharedModule } from '@app/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), SharedModule],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule { }
