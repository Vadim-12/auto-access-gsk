import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGarageRequests1747603467125 implements MigrationInterface {
  name = 'AddGarageRequests1747603467125';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Добавляем колонку gsk_id в таблицу garage_requests
    await queryRunner.query(`
      ALTER TABLE "garage_requests"
      ADD COLUMN "gsk_id" uuid
    `);

    // Проверяем существование таблицы gsk перед добавлением внешнего ключа
    const gskExists = await queryRunner.hasTable('gsk');
    if (gskExists) {
      await queryRunner.query(`
        ALTER TABLE "garage_requests"
        ADD CONSTRAINT "FK_garage_request_gsk"
        FOREIGN KEY ("gsk_id")
        REFERENCES "gsk"("gsk_id")
        ON DELETE CASCADE
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем внешний ключ
    await queryRunner.query(`
      ALTER TABLE "garage_requests"
      DROP CONSTRAINT IF EXISTS "FK_garage_request_gsk"
    `);

    // Удаляем колонку gsk_id
    await queryRunner.query(`
      ALTER TABLE "garage_requests"
      DROP COLUMN "gsk_id"
    `);
  }
}
