import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UserEntity } from '@app/user/user.entity';
import { ArticleResponseInterface } from './dto/articleResponse.interface';
import slugify from 'slugify';
import { ArticlesResponseInterface } from './dto/ariclesResponse.interface';
import { FollowEntity } from '@app/profile/follow.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
    private dataSource: DataSource,

  ) { }

  async findAll(currentUserId: number, query: any): Promise<ArticlesResponseInterface> {
    const queryBuilder = this.dataSource.getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    const articlesCount = await queryBuilder.getCount();
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
      queryBuilder.andWhere('articles.authorId = :id', {
        id: author.id
      })
    }

    if (query.favorited) {
      const author = await this.userRepository.findOne({
        where: {
          name: query.favorited,
        },
        relations: ['favorites'],
      })
      const ids = author.favorites.map((el) => el.id);
      if (ids.length > 0) {
        queryBuilder.andWhere('articles.id IN (:...ids)', { ids })
      } else {
        queryBuilder.andWhere('1=0');
      }
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    let favoriteIds: number[] = [];
    if (currentUserId) {
      const currentUser = await this.userRepository.findOne({
        where: { id: currentUserId },
        relations: ['favorites'],
      });
      favoriteIds = currentUser.favorites.map((favorite) => favorite.id);
    }
    const articles = await queryBuilder.getMany();
    const articlesWithFavorites = articles.map(article => {
      const favorited = favoriteIds.includes(article.id);
      return { ...article, favorited }
    })
    return { articles: articlesWithFavorites, articlesCount }
  }

  async getFeed(currentUser: number, query: any): Promise<ArticlesResponseInterface> {
    const follows = await this.followRepository.find({
      where: {
        followerId: currentUser,
      }
    });
    if (follows.length === 0) {
      return { articles: [], articlesCount: 0 };
    }

    const followingUserIds = follows.map(follow => follow.followingId);

    const queryBuilder = this.dataSource.getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .where('articles.authorId IN (:...ids)', { ids: followingUserIds });

    queryBuilder.orderBy('articles.createdAt', 'DESC');
    const articlesCount = await queryBuilder.getCount();
    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset)
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
    const isNotFavorited = user.favorites.findIndex(articleInFavorites => articleInFavorites.id === article.id) === -1;
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
    const articleIndex = user.favorites.findIndex(articleInFavorites => articleInFavorites.id === article.id);
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