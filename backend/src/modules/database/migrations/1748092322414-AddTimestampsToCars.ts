import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimestampsToCars1748092322414 implements MigrationInterface {
  name = 'AddTimestampsToCars1748092322414';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "cars" 
      ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    `);

    await queryRunner.query(`
      COMMENT ON COLUMN "cars"."created_at" IS 'Created at'
    `);

    await queryRunner.query(`
      COMMENT ON COLUMN "cars"."updated_at" IS 'Updated at'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "cars" 
      DROP COLUMN IF EXISTS "created_at",
      DROP COLUMN IF EXISTS "updated_at"
    `);
  }
}
