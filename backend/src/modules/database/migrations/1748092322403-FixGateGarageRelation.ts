import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixGateGarageRelation1748092322403 implements MigrationInterface {
  name = 'FixGateGarageRelation1748092322403';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Сначала удаляем существующую колонку, если она есть
    await queryRunner.query(`
      ALTER TABLE "gates" 
      DROP COLUMN IF EXISTS "garageGarageId"
    `);

    // Добавляем новую колонку с правильным именем
    await queryRunner.query(`
      ALTER TABLE "gates" 
      ADD COLUMN "garage_id" uuid REFERENCES "garage"("garage_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "gates" 
      DROP COLUMN IF EXISTS "garage_id"
    `);
  }
}
