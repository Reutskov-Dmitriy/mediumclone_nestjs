import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSlugToCategories1693219930144 implements MigrationInterface {
  name = 'AddSlugToCategories1693219930144'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "categories" ADD "slug" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "slug"`);
  }

}
