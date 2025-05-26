import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveCameraStatus1748092322401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Проверяем существование таблицы cameras
    const camerasTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'cameras'
      );
    `);

    if (camerasTableExists[0].exists) {
      await queryRunner.query(`
        ALTER TABLE "cameras" DROP COLUMN IF EXISTS "status";
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Проверяем существование таблицы cameras
    const camerasTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'cameras'
      );
    `);

    if (camerasTableExists[0].exists) {
      await queryRunner.query(`
        ALTER TABLE "cameras" ADD COLUMN IF NOT EXISTS "status" enum NOT NULL DEFAULT 'inactive';
      `);
    }
  }
}
