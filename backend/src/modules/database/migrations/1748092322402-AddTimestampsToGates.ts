import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimestampsToGates1748092322402 implements MigrationInterface {
  name = 'AddTimestampsToGates1748092322402';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "gates" 
      ADD COLUMN "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "gates" 
      DROP COLUMN "createdAt",
      DROP COLUMN "updatedAt"
    `);
  }
}
