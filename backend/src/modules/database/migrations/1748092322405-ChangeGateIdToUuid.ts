import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeGateIdToUuid1748092322405 implements MigrationInterface {
  name = 'ChangeGateIdToUuid1748092322405';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создаем временную таблицу с UUID
    await queryRunner.query(`
      CREATE TABLE "gates_new" (
        "gate_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "ip" character varying(15) NOT NULL,
        "port" integer NOT NULL,
        "status" "public"."garage_gate_status_enum" NOT NULL DEFAULT 'closed',
        "garage_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_gates_new" PRIMARY KEY ("gate_id")
      )
    `);

    // Копируем данные из старой таблицы в новую
    await queryRunner.query(`
      INSERT INTO "gates_new" ("ip", "port", "status", "garage_id", "created_at", "updated_at")
      SELECT "ip", "port", "status", "garage_id", "created_at", "updated_at"
      FROM "gates"
    `);

    // Удаляем старую таблицу
    await queryRunner.query(`DROP TABLE "gates"`);

    // Переименовываем новую таблицу
    await queryRunner.query(`ALTER TABLE "gates_new" RENAME TO "gates"`);

    // Восстанавливаем внешние ключи и индексы
    await queryRunner.query(`
      ALTER TABLE "gates" 
      ADD CONSTRAINT "FK_gates_garage" 
      FOREIGN KEY ("garage_id") 
      REFERENCES "garages"("garage_id") 
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_gates_ip_port" 
      ON "gates" ("ip", "port")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Создаем временную таблицу с SERIAL
    await queryRunner.query(`
      CREATE TABLE "gates_old" (
        "id" SERIAL NOT NULL,
        "ip" character varying(15) NOT NULL,
        "port" integer NOT NULL,
        "status" "public"."garage_gate_status_enum" NOT NULL DEFAULT 'closed',
        "garage_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_gates_old" PRIMARY KEY ("id")
      )
    `);

    // Копируем данные из новой таблицы в старую
    await queryRunner.query(`
      INSERT INTO "gates_old" ("ip", "port", "status", "garage_id", "created_at", "updated_at")
      SELECT "ip", "port", "status", "garage_id", "created_at", "updated_at"
      FROM "gates"
    `);

    // Удаляем новую таблицу
    await queryRunner.query(`DROP TABLE "gates"`);

    // Переименовываем старую таблицу
    await queryRunner.query(`ALTER TABLE "gates_old" RENAME TO "gates"`);

    // Восстанавливаем внешние ключи и индексы
    await queryRunner.query(`
      ALTER TABLE "gates" 
      ADD CONSTRAINT "FK_gates_garage" 
      FOREIGN KEY ("garage_id") 
      REFERENCES "garages"("garage_id") 
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_gates_ip_port" 
      ON "gates" ("ip", "port")
    `);
  }
}
