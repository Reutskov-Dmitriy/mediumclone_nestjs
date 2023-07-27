import { ArticleService } from './article.service';
import { Controller, Post, Get, Body, UseGuards, Param, Delete, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticle.dto';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserEntity } from '@app/user/user.entity';
import { User } from '@app/decorators/user.decorator';
import { ArticleResponseInterface } from './dto/articleResponse.interface';

@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  async createArticle(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Get(':slug')
  async getArticle(@Param('slug') slug: string): Promise<ArticleResponseInterface> {
    const article = await this.articleService.findBySlug(slug);

    return this.articleService.buildArticleResponse(article)

  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string) {
    return await this.articleService.deleteArticle(slug, currentUserId)
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  async updateArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.updateArticle(
      currentUserId,
      slug,
      updateArticleDto,
    )
    return this.articleService.buildArticleResponse(article)
  }

}
