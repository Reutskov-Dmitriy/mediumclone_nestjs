import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTags1689693626557 implements MigrationInterface {
    name = 'CreateTags1689693626557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" ADD "quantity" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "quantity"`);
    }

}
