import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGateStatus1748090870601 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Проверяем существование колонки
    const columnExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'garages' 
        AND column_name = 'gate_status'
      );
    `);

    if (!columnExists[0].exists) {
      await queryRunner.query(
        `ALTER TABLE "garages" ADD COLUMN "gate_status" VARCHAR(255) DEFAULT 'closed'`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Проверяем существование колонки перед удалением
    const columnExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'garages' 
        AND column_name = 'gate_status'
      );
    `);

    if (columnExists[0].exists) {
      await queryRunner.query(
        `ALTER TABLE "garages" DROP COLUMN "gate_status"`,
      );
    }
  }
}
