import { ArticleService } from './article.service';
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticle.dto';
import { AuthGuard } from '@app/user/guards/auth.guard';

@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  async createArticle(
    @Body('article') createArticleDto: CreateArticleDto
  ) {
    return this.articleService.createArticle(createArticleDto)
  }
}
