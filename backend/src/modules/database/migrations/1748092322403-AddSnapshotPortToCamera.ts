import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSnapshotPortToCamera1748092322403
  implements MigrationInterface
{
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
        ADD COLUMN IF NOT EXISTS "snapshot_port" integer NOT NULL DEFAULT 80;
      `);

      await queryRunner.query(`
        COMMENT ON COLUMN "cameras"."snapshot_port" IS 'Camera snapshot port';
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
        DROP COLUMN IF EXISTS "snapshot_port";
      `);
    }
  }
}
