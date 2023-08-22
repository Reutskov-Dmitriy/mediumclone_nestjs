import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatedProduct1692630141422 implements MigrationInterface {
  name = 'CreatedProduct1692630141422'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "body" character varying NOT NULL, "currentprice" integer NOT NULL, "oldprice" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" integer, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_dddbf2ae70d3f6312a02458837a" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_dddbf2ae70d3f6312a02458837a"`);
    await queryRunner.query(`DROP TABLE "products"`);
  }

}
