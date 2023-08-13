import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDB690301445867 implements MigrationInterface {
  name = 'SeedDB1690301445867'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES('nodejs'), ('express'), ('nestjs')`,
    );
  }

  public async down(): Promise<void> { }

}
