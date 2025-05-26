import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangePhoneNumberField1748092322408 implements MigrationInterface {
  name = 'ChangePhoneNumberField1748092322408';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Проверяем существование таблицы users
    const usersTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);

    if (usersTableExists[0].exists) {
      // Удаляем существующее ограничение уникальности, если оно есть
      await queryRunner.query(`
        DO $$ 
        BEGIN
          IF EXISTS (
            SELECT 1 
            FROM information_schema.table_constraints 
            WHERE constraint_name = 'UQ_users_phone_number'
          ) THEN
            ALTER TABLE "users" DROP CONSTRAINT "UQ_users_phone_number";
          END IF;
        END $$;
      `);

      // Изменяем тип колонки phone_number
      await queryRunner.query(`
        ALTER TABLE "users" 
        ALTER COLUMN "phone_number" TYPE character varying(20),
        ALTER COLUMN "phone_number" DROP NOT NULL
      `);

      // Добавляем комментарий к колонке
      await queryRunner.query(`
        COMMENT ON COLUMN "users"."phone_number" IS 'User phone number'
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Проверяем существование таблицы users
    const usersTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);

    if (usersTableExists[0].exists) {
      // Возвращаем предыдущий тип колонки
      await queryRunner.query(`
        ALTER TABLE "users" 
        ALTER COLUMN "phone_number" TYPE character varying(15),
        ALTER COLUMN "phone_number" SET NOT NULL
      `);

      // Добавляем ограничение уникальности обратно
      await queryRunner.query(`
        ALTER TABLE "users" 
        ADD CONSTRAINT "UQ_users_phone_number" 
        UNIQUE ("phone_number")
      `);
    }
  }
}
