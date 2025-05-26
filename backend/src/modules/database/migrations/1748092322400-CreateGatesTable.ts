import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGatesTable1748092322400 implements MigrationInterface {
  name = 'CreateGatesTable1748092322400';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Проверяем существование таблицы user_garages
    const userGaragesTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'user_garages'
      );
    `);

    if (userGaragesTableExists[0].exists) {
      await queryRunner.query(
        `ALTER TABLE "user_garages" DROP CONSTRAINT IF EXISTS "FK_84b91f6db98b87acbebee806802"`,
      );
      await queryRunner.query(
        `ALTER TABLE "user_garages" DROP CONSTRAINT IF EXISTS "FK_7235f0d6ba59300683af41d30ce"`,
      );
    }

    await queryRunner.query(
      `CREATE TYPE "public"."garage_gate_status_enum" AS ENUM('open', 'closed', 'error')`,
    );
    await queryRunner.query(
      `CREATE TABLE "gates" (
        "gate_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "garage_id" uuid NOT NULL,
        "ip" character varying(15) NOT NULL,
        "port" integer NOT NULL,
        "status" "public"."garage_gate_status_enum" NOT NULL DEFAULT 'closed',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_gates" PRIMARY KEY ("gate_id")
      )`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "gates"."gate_id" IS 'Gate UUID'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "gates"."garage_id" IS 'Garage UUID'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "gates"."ip" IS 'Gate IP address'`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "gates"."port" IS 'Gate port'`);
    await queryRunner.query(
      `COMMENT ON COLUMN "gates"."status" IS 'Gate status'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "gates"."created_at" IS 'Created at'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "gates"."updated_at" IS 'Updated at'`,
    );

    // Проверяем существование колонок перед удалением
    const columnsToCheck = ['gateIp', 'gatePort', 'gate_status'];
    for (const column of columnsToCheck) {
      const columnExists = await queryRunner.query(`
        SELECT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'garages' 
          AND column_name = '${column}'
        );
      `);

      if (columnExists[0].exists) {
        await queryRunner.query(
          `ALTER TABLE "garages" DROP COLUMN "${column}"`,
        );
      }
    }

    // Проверяем существование таблицы garage_request
    const garageRequestTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'garage_request'
      );
    `);

    if (garageRequestTableExists[0].exists) {
      await queryRunner.query(
        `COMMENT ON COLUMN "garage_request"."admin_comment" IS 'Admin comment for unlinking'`,
      );
    }

    await queryRunner.query(
      `ALTER TABLE "gates" ADD CONSTRAINT "FK_gates_garage" FOREIGN KEY ("garage_id") REFERENCES "garages"("garage_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    if (userGaragesTableExists[0].exists) {
      await queryRunner.query(
        `ALTER TABLE "user_garages" ADD CONSTRAINT "FK_84b91f6db98b87acbebee806802" FOREIGN KEY ("garage_id") REFERENCES "garages"("garage_id") ON DELETE CASCADE ON UPDATE CASCADE`,
      );

      // Проверяем существование таблицы user
      const userTableExists = await queryRunner.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'user'
        );
      `);

      if (userTableExists[0].exists) {
        await queryRunner.query(
          `ALTER TABLE "user_garages" ADD CONSTRAINT "FK_7235f0d6ba59300683af41d30ce" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
      }
    }

    // Добавляем индексы
    await queryRunner.query(
      `CREATE INDEX "IDX_gates_garage_id" ON "gates" ("garage_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем индексы
    await queryRunner.query(`DROP INDEX "IDX_gates_garage_id"`);

    // Удаляем внешний ключ
    await queryRunner.query(
      `ALTER TABLE "gates" DROP CONSTRAINT "FK_gates_garage"`,
    );

    // Удаляем таблицу gates
    await queryRunner.query(`DROP TABLE "gates"`);

    // Удаляем enum
    await queryRunner.query(`DROP TYPE "public"."garage_gate_status_enum"`);

    // Проверяем существование колонок перед добавлением
    const columnsToAdd = [
      {
        name: 'gate_status',
        type: 'garage_gate_status_enum',
        comment: 'Gate status',
      },
      { name: 'gatePort', type: 'integer', comment: 'Gate port' },
      {
        name: 'gateIp',
        type: 'character varying(15)',
        comment: 'Gate IP address',
      },
    ];

    for (const column of columnsToAdd) {
      const columnExists = await queryRunner.query(`
        SELECT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'garages' 
          AND column_name = '${column.name}'
        );
      `);

      if (!columnExists[0].exists) {
        await queryRunner.query(
          `ALTER TABLE "garages" ADD "${column.name}" ${column.type} NOT NULL DEFAULT 'closed'`,
        );
        await queryRunner.query(
          `COMMENT ON COLUMN "garages"."${column.name}" IS '${column.comment}'`,
        );
      }
    }

    // Проверяем существование таблицы user_garages
    const userGaragesTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'user_garages'
      );
    `);

    if (userGaragesTableExists[0].exists) {
      await queryRunner.query(
        `ALTER TABLE "user_garages" DROP CONSTRAINT IF EXISTS "FK_7235f0d6ba59300683af41d30ce"`,
      );
      await queryRunner.query(
        `ALTER TABLE "user_garages" DROP CONSTRAINT IF EXISTS "FK_84b91f6db98b87acbebee806802"`,
      );
    }

    // Проверяем существование таблицы garage_request
    const garageRequestTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'garage_request'
      );
    `);

    if (garageRequestTableExists[0].exists) {
      await queryRunner.query(
        `COMMENT ON COLUMN "garage_request"."admin_comment" IS NULL`,
      );
    }
  }
}
