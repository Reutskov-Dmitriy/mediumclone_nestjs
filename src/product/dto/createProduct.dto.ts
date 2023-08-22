import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly currentprice: number;

  @IsNotEmpty()
  readonly categoryId: number;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly body: string;

}