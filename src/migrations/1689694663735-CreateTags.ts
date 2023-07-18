import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTags1689694663735 implements MigrationInterface {
    name = 'CreateTags1689694663735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" ADD "quantity" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "quantity"`);
    }

}
