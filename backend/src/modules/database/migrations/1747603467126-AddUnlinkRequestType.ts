import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUnlinkRequestType1747603467126 implements MigrationInterface {
  name = 'AddUnlinkRequestType1747603467126';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создаем enum тип для типов заявок
    await queryRunner.query(`
      CREATE TYPE "public"."garage_request_type_enum" AS ENUM ('ACCESS', 'UNLINK')
    `);

    // Добавляем колонку type
    await queryRunner.query(`
      ALTER TABLE "garage_requests"
      ADD COLUMN "type" "public"."garage_request_type_enum" NOT NULL DEFAULT 'ACCESS'
    `);

    // Добавляем колонку admin_comment
    await queryRunner.query(`
      ALTER TABLE "garage_requests"
      ADD COLUMN "admin_comment" varchar(255)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем колонку admin_comment
    await queryRunner.query(`
      ALTER TABLE "garage_requests"
      DROP COLUMN "admin_comment"
    `);

    // Удаляем колонку type
    await queryRunner.query(`
      ALTER TABLE "garage_requests"
      DROP COLUMN "type"
    `);

    // Удаляем enum тип
    await queryRunner.query(`
      DROP TYPE "public"."garage_request_type_enum"
    `);
  }
}
