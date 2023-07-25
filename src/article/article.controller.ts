import { ArticleService } from './article.service';
import { Controller, Post, Body } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticle.dto';

@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService
  ) { }

  @Post()
  async createArticle(
    @Body('article') createArticleDto: CreateArticleDto
  ) {
    return this.articleService.createArticle(createArticleDto)
  }
}
