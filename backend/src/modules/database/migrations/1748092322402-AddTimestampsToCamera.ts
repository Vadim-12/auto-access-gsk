import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimestampsToCamera1748092322402 implements MigrationInterface {
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
        ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP NOT NULL DEFAULT now();
      `);

      await queryRunner.query(`
        COMMENT ON COLUMN "cameras"."created_at" IS 'Created at timestamp';
      `);

      await queryRunner.query(`
        COMMENT ON COLUMN "cameras"."updated_at" IS 'Updated at timestamp';
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
        DROP COLUMN IF EXISTS "created_at",
        DROP COLUMN IF EXISTS "updated_at";
      `);
    }
  }
}
