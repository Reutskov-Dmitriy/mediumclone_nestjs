import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageToProduct1692692770711 implements MigrationInterface {
  name = 'AddImageToProduct1692692770711'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" ADD "image" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "image"`);
  }

}
