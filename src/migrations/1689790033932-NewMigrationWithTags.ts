import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigrationWithTags1689790033932 implements MigrationInterface {
  name = 'NewMigrationWithTags1689790033932'

  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "quantity" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tags"`);

  }

}
