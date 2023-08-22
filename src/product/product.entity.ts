import { CategoryEntity } from '@app/category/category.entity';
import { UserEntity } from '@app/user/user.entity';
import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @Column()
  currentprice: number;

  @Column()
  oldprice: number;

  @Column()
  image: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
  @ManyToOne(() => UserEntity, (user) => user.products, { eager: true })
  author: UserEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.products, { eager: true })
  category: CategoryEntity;
}