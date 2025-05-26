import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveNameAndDescriptionFromCamera1748092322412
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
        DROP COLUMN IF EXISTS "name",
        DROP COLUMN IF EXISTS "description";
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
        ADD COLUMN IF NOT EXISTS "name" character varying(100),
        ADD COLUMN IF NOT EXISTS "description" character varying(255);
      `);

      await queryRunner.query(`
        COMMENT ON COLUMN "cameras"."name" IS 'Camera name';
        COMMENT ON COLUMN "cameras"."description" IS 'Camera description';
      `);
    }
  }
}
