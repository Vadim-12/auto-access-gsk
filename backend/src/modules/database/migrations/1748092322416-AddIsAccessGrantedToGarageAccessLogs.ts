import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsAccessGrantedToGarageAccessLogs1748092322416
  implements MigrationInterface
{
  name = 'AddIsAccessGrantedToGarageAccessLogs1748092322416';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "garage_access_logs" 
      ADD COLUMN "is_access_granted" boolean NOT NULL DEFAULT false;
      
      COMMENT ON COLUMN "garage_access_logs"."is_access_granted" IS 'Флаг разрешения доступа';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "garage_access_logs" 
      DROP COLUMN "is_access_granted";
    `);
  }
}
