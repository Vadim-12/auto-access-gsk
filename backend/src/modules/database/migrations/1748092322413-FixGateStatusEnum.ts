import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixGateStatusEnum1748092322413 implements MigrationInterface {
  name = 'FixGateStatusEnum1748092322413';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Удаляем дефолтное значение
    await queryRunner.query(
      `ALTER TABLE "gates" ALTER COLUMN "status" DROP DEFAULT`,
    );

    // Создаем новый тип enum
    await queryRunner.query(
      `CREATE TYPE "public"."garage_gate_status_enum_new" AS ENUM('opened', 'closed')`,
    );

    // Обновляем существующие значения
    await queryRunner.query(`
      ALTER TABLE "gates"
      ALTER COLUMN "status" TYPE "public"."garage_gate_status_enum_new"
      USING CASE
        WHEN "status"::text = 'open' THEN 'opened'::garage_gate_status_enum_new
        WHEN "status"::text = 'closed' THEN 'closed'::garage_gate_status_enum_new
        ELSE 'closed'::garage_gate_status_enum_new
      END
    `);

    // Удаляем старый тип enum
    await queryRunner.query(`DROP TYPE "public"."garage_gate_status_enum"`);

    // Переименовываем новый тип enum
    await queryRunner.query(
      `ALTER TYPE "public"."garage_gate_status_enum_new" RENAME TO "garage_gate_status_enum"`,
    );

    // Возвращаем дефолтное значение
    await queryRunner.query(
      `ALTER TABLE "gates" ALTER COLUMN "status" SET DEFAULT 'closed'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем дефолтное значение
    await queryRunner.query(
      `ALTER TABLE "gates" ALTER COLUMN "status" DROP DEFAULT`,
    );

    // Создаем старый тип enum
    await queryRunner.query(
      `CREATE TYPE "public"."garage_gate_status_enum_old" AS ENUM('open', 'closed', 'error')`,
    );

    // Обновляем существующие значения
    await queryRunner.query(`
      ALTER TABLE "gates"
      ALTER COLUMN "status" TYPE "public"."garage_gate_status_enum_old"
      USING CASE
        WHEN "status"::text = 'opened' THEN 'open'::garage_gate_status_enum_old
        WHEN "status"::text = 'closed' THEN 'closed'::garage_gate_status_enum_old
        ELSE 'closed'::garage_gate_status_enum_old
      END
    `);

    // Удаляем новый тип enum
    await queryRunner.query(`DROP TYPE "public"."garage_gate_status_enum"`);

    // Переименовываем старый тип enum
    await queryRunner.query(
      `ALTER TYPE "public"."garage_gate_status_enum_old" RENAME TO "garage_gate_status_enum"`,
    );

    // Возвращаем дефолтное значение
    await queryRunner.query(
      `ALTER TABLE "gates" ALTER COLUMN "status" SET DEFAULT 'closed'`,
    );
  }
}
