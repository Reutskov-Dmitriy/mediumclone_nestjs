import { ProductEntity } from '@app/product/product.entity';
import { BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdCat: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedCat: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedCat = new Date();
  }

  @OneToMany(() => ProductEntity, product => product.category)
  products: ProductEntity[];

}