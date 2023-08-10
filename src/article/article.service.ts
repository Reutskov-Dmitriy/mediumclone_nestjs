import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UserEntity } from '@app/user/user.entity';
import { ArticleResponseInterface } from './dto/articleResponse.interface';
import slugify from 'slugify';
import { ArticlesResponseInterface } from './dto/ariclesResponse.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) { }

  async findAll(currentUserId: number, query: any): Promise<ArticlesResponseInterface> {
    const queryBuilder = this.dataSource.getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    const articlesCount = await queryBuilder.getCount();
    console.log('query', query);
    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`
      })
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        where: {
          name: query.author,
        }
      });
      queryBuilder.andWhere('articles.aurhorId = :id', {
        id: author.id
      })
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }
    const articles = await queryBuilder.getMany();
    return { articles, articlesCount }
  }

  async createArticle(currentUser: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);
    if (!article.tagList) {
      article.tagList = [];
    };
    article.slug = this.getSlug(createArticleDto.title)
    article.author = currentUser;
    return await this.articleRepository.save(article);
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({ where: { slug } });
  }

  async deleteArticle(slug: string, currentUserId: number): Promise<DeleteResult> {
    const article = await this.findBySlug(slug)

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.FORBIDDEN)
    }
    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.NOT_FOUND)
    }
    return await this.articleRepository.delete({ slug })
  }

  async updateArticle(currentUserId: number, slug: string, updateArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug)
    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.FORBIDDEN)
    }
    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.NOT_FOUND)
    }
    Object.assign(article, updateArticleDto);
    return await this.articleRepository.save(article)
  }

  async addArticleToFavorites(currentUserId: number, slug: string): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favorites'],
    });
    const isNotFavorited = user.favorites.findIndex(articleInFavorites => articleInFavorites.id = article.id) === -1;
    if (isNotFavorited) {
      user.favorites.push(article);
      article.favoritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }
    return article;
  }

  async deleteArticleFromFavorites(currentUserId: number, slug: string): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favorites'],
    });
    const articleIndex = user.favorites.findIndex(articleInFavorites => articleInFavorites.id = article.id);
    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1);
      article.favoritesCount--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }
    return article;
  }

  buildArticleResponse(article: ArticleEntity): Promise<ArticleResponseInterface> {
    return Promise.resolve({ article });
  }

  private getSlug(title: string): string {
    return (slugify(title, { lower: true }) +
      '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
    );
  }


}