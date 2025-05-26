import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDescriptionToCamera1748092322411 implements MigrationInterface {
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
        ALTER TABLE "cameras" 
        ADD COLUMN IF NOT EXISTS "description" character varying(255);
      `);

      await queryRunner.query(`
        COMMENT ON COLUMN "cameras"."description" IS 'Camera description';
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
        ALTER TABLE "cameras" 
        DROP COLUMN IF EXISTS "description";
      `);
    }
  }
}
