import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveGskTable1747603467128 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Проверяем существование таблицы gsk
    const tableExists = await queryRunner.hasTable('gsk');

    if (tableExists) {
      // Удаляем внешние ключи, если они есть
      await queryRunner.query(`
        DO $$ 
        BEGIN
          IF EXISTS (
            SELECT 1 
            FROM information_schema.table_constraints 
            WHERE constraint_name IN ('FK_garage_gsk', 'fk_garage_gsk')
          ) THEN
            ALTER TABLE garages DROP CONSTRAINT IF EXISTS FK_garage_gsk;
            ALTER TABLE garages DROP CONSTRAINT IF EXISTS fk_garage_gsk;
          END IF;
        END $$;
      `);

      // Удаляем таблицу gsk с CASCADE
      await queryRunner.query(`DROP TABLE IF EXISTS gsk CASCADE`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Восстанавливаем таблицу gsk
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS gsk (
        gskId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        description TEXT,
        createdAt TIMESTAMP NOT NULL DEFAULT now(),
        updatedAt TIMESTAMP NOT NULL DEFAULT now()
      );
    `);
  }
}
