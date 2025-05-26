import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDescriptionToGarageRequests1748092322409
  implements MigrationInterface
{
  name = 'AddDescriptionToGarageRequests1748092322409';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Проверяем существование таблицы garage_requests
    const garageRequestTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'garage_requests'
      );
    `);

    if (garageRequestTableExists[0].exists) {
      await queryRunner.query(`
        ALTER TABLE "garage_requests" 
        ADD COLUMN IF NOT EXISTS "description" varchar(255);
      `);

      await queryRunner.query(`
        COMMENT ON COLUMN "garage_requests"."description" IS 'Request description';
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Проверяем существование таблицы garage_requests
    const garageRequestTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'garage_requests'
      );
    `);

    if (garageRequestTableExists[0].exists) {
      await queryRunner.query(`
        ALTER TABLE "garage_requests" 
        DROP COLUMN IF EXISTS "description";
      `);
    }
  }
}
