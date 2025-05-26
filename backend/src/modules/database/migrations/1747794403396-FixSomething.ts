import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixSomething1747794403396 implements MigrationInterface {
  name = 'FixSomething1747794403396';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Проверяем существование таблицы cameras перед выполнением операций
    const camerasTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'cameras'
      );
    `);

    if (camerasTableExists[0].exists) {
      await queryRunner.query(
        `ALTER TABLE "cameras" DROP CONSTRAINT IF EXISTS "FK_camera_garage"`,
      );
      await queryRunner.query(
        `ALTER TABLE "cameras" DROP COLUMN IF EXISTS "last_connection_time"`,
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
        `ALTER TABLE "garage_request" DROP CONSTRAINT IF EXISTS "FK_garage_request_user"`,
      );
      await queryRunner.query(
        `ALTER TABLE "garage_request" DROP CONSTRAINT IF EXISTS "FK_garage_request_garage"`,
      );
      await queryRunner.query(`
        DO $$ 
        BEGIN
          IF EXISTS (
            SELECT 1 
            FROM information_schema.table_constraints 
            WHERE constraint_name = 'FK_garage_request_gsk'
          ) THEN
            ALTER TABLE "garage_request" DROP CONSTRAINT "FK_garage_request_gsk";
          END IF;
        END $$;
      `);
      await queryRunner.query(
        `ALTER TABLE "garage_request" DROP COLUMN IF EXISTS "created_at"`,
      );
      await queryRunner.query(
        `ALTER TABLE "garage_request" DROP COLUMN IF EXISTS "updated_at"`,
      );
      await queryRunner.query(
        `ALTER TABLE "garage_request" DROP COLUMN IF EXISTS "gsk_id"`,
      );
      await queryRunner.query(
        `ALTER TABLE "garage_request" DROP COLUMN IF EXISTS "description"`,
      );
      await queryRunner.query(
        `ALTER TABLE "garage_request" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
      );
      await queryRunner.query(
        `ALTER TABLE "garage_request" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
      );
      await queryRunner.query(
        `ALTER TABLE "garage_request" ADD "description" character varying(255)`,
      );
      await queryRunner.query(
        `COMMENT ON COLUMN "garage_request"."description" IS 'Request description'`,
      );
    }

    // Проверяем существование таблицы garages
    const garagesTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'garages'
      );
    `);

    if (garagesTableExists[0].exists) {
      await queryRunner.query(`
        DO $$ 
        BEGIN
          IF EXISTS (
            SELECT 1 
            FROM information_schema.table_constraints 
            WHERE constraint_name = 'FK_garage_gsk'
          ) THEN
            ALTER TABLE "garages" DROP CONSTRAINT "FK_garage_gsk";
          END IF;
        END $$;
      `);
      await queryRunner.query(
        `ALTER TABLE "garages" DROP COLUMN IF EXISTS "camera_ip"`,
      );
      await queryRunner.query(
        `ALTER TABLE "garages" DROP COLUMN IF EXISTS "camera_port"`,
      );
      await queryRunner.query(
        `ALTER TABLE "garages" DROP COLUMN IF EXISTS "gate_ip"`,
      );
      await queryRunner.query(
        `ALTER TABLE "garages" DROP COLUMN IF EXISTS "gate_port"`,
      );
      await queryRunner.query(
        `ALTER TABLE "garages" DROP COLUMN IF EXISTS "gsk_id"`,
      );
      await queryRunner.query(
        `ALTER TABLE "garages" DROP COLUMN IF EXISTS "number"`,
      );
      await queryRunner.query(
        `ALTER TABLE "garages" ADD "description" character varying(255)`,
      );
      await queryRunner.query(
        `COMMENT ON COLUMN "garages"."description" IS 'Garage description'`,
      );
      await queryRunner.query(
        `ALTER TABLE "garages" ADD "gate_ip" character varying(15) NOT NULL`,
      );
      await queryRunner.query(
        `COMMENT ON COLUMN "garages"."gate_ip" IS 'Gate IP address'`,
      );
      await queryRunner.query(
        `ALTER TABLE "garages" ADD "gate_port" integer NOT NULL`,
      );
      await queryRunner.query(
        `COMMENT ON COLUMN "garages"."gate_port" IS 'Gate port'`,
      );
      await queryRunner.query(
        `ALTER TABLE "garages" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
      );
      await queryRunner.query(
        `ALTER TABLE "garages" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
      );
      await queryRunner.query(`ALTER TABLE "garages" ADD "admin_user_id" uuid`);
      await queryRunner.query(
        `COMMENT ON COLUMN "garages"."admin_user_id" IS 'User UUID'`,
      );
      await queryRunner.query(
        `ALTER TABLE "garages" ADD "number" character varying(10) NOT NULL`,
      );
      await queryRunner.query(
        `COMMENT ON COLUMN "garages"."number" IS 'Garage number'`,
      );
      await queryRunner.query(
        `ALTER TABLE "garages" ADD "gate_status" VARCHAR(255) DEFAULT 'closed'`,
      );
    }

    // Проверяем существование таблицы car
    const carTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'car'
      );
    `);

    if (carTableExists[0].exists) {
      await queryRunner.query(
        `ALTER TABLE "car" DROP CONSTRAINT IF EXISTS "FK_car_user"`,
      );
      await queryRunner.query(
        `ALTER TABLE "car" DROP CONSTRAINT IF EXISTS "UQ_car_license_plate"`,
      );
      await queryRunner.query(
        `ALTER TABLE "car" DROP COLUMN IF EXISTS "license_plate"`,
      );
      await queryRunner.query(
        `ALTER TABLE "car" DROP CONSTRAINT IF EXISTS "UQ_car_vin"`,
      );
      await queryRunner.query(`ALTER TABLE "car" DROP COLUMN IF EXISTS "vin"`);
      await queryRunner.query(
        `ALTER TABLE "car" DROP COLUMN IF EXISTS "description"`,
      );
      await queryRunner.query(`ALTER TABLE "car" ADD "year" integer NOT NULL`);
      await queryRunner.query(`COMMENT ON COLUMN "car"."year" IS 'Car year'`);
      await queryRunner.query(
        `ALTER TABLE "car" ADD "license_plate" character varying(20) NOT NULL`,
      );
      await queryRunner.query(
        `ALTER TABLE "car" ADD CONSTRAINT "UQ_376f481e04705afcf4a2bc0aa9b" UNIQUE ("license_plate")`,
      );
      await queryRunner.query(
        `COMMENT ON COLUMN "car"."license_plate" IS 'Car license plate'`,
      );
    }

    // Проверяем существование таблицы user_garage
    const userGarageTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'user_garage'
      );
    `);

    if (userGarageTableExists[0].exists) {
      await queryRunner.query(
        `ALTER TABLE "user_garage" DROP CONSTRAINT IF EXISTS "FK_user_garage_user"`,
      );
      await queryRunner.query(
        `ALTER TABLE "user_garage" DROP CONSTRAINT IF EXISTS "FK_user_garage_garage"`,
      );
      await queryRunner.query(
        `CREATE INDEX IF NOT EXISTS "IDX_84b91f6db98b87acbebee80680" ON "user_garage" ("garage_id")`,
      );
      await queryRunner.query(
        `CREATE INDEX IF NOT EXISTS "IDX_7235f0d6ba59300683af41d30c" ON "user_garage" ("user_id")`,
      );
    }

    // Проверяем существование таблицы user
    const userTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'user'
      );
    `);

    if (userTableExists[0].exists) {
      await queryRunner.query(
        `ALTER TABLE "user" DROP COLUMN IF EXISTS "password_hash"`,
      );
      await queryRunner.query(
        `ALTER TABLE "user" ADD "password_hash" character varying(100) NOT NULL`,
      );
      await queryRunner.query(
        `COMMENT ON COLUMN "user"."password_hash" IS 'User password hash'`,
      );
      await queryRunner.query(
        `ALTER TABLE "user" ALTER COLUMN "phone_number" DROP NOT NULL`,
      );
      await queryRunner.query(
        `ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "UQ_f2578043e491921209f5dadd080"`,
      );
    }

    // Добавляем внешние ключи только если соответствующие таблицы существуют
    if (camerasTableExists[0].exists && garagesTableExists[0].exists) {
      await queryRunner.query(
        `ALTER TABLE "cameras" ADD CONSTRAINT "FK_48cf73254a0f2e1ebc986cfbc32" FOREIGN KEY ("garage_id") REFERENCES "garages"("garage_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
    }

    if (garageRequestTableExists[0].exists && userTableExists[0].exists) {
      await queryRunner.query(
        `ALTER TABLE "garage_request" ADD CONSTRAINT "FK_garage_request_user" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      );
    }

    if (garageRequestTableExists[0].exists && garagesTableExists[0].exists) {
      await queryRunner.query(
        `ALTER TABLE "garage_request" ADD CONSTRAINT "FK_garage_request_garage" FOREIGN KEY ("garage_id") REFERENCES "garages"("garage_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      );
    }

    if (carTableExists[0].exists && userTableExists[0].exists) {
      await queryRunner.query(
        `ALTER TABLE "car" ADD CONSTRAINT "FK_car_user" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      );
    }

    if (userGarageTableExists[0].exists && userTableExists[0].exists) {
      await queryRunner.query(
        `ALTER TABLE "user_garage" ADD CONSTRAINT "FK_user_garage_user" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      );
    }

    if (userGarageTableExists[0].exists && garagesTableExists[0].exists) {
      await queryRunner.query(
        `ALTER TABLE "user_garage" ADD CONSTRAINT "FK_user_garage_garage" FOREIGN KEY ("garage_id") REFERENCES "garages"("garage_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cameras" DROP CONSTRAINT IF EXISTS "FK_48cf73254a0f2e1ebc986cfbc32"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" DROP CONSTRAINT IF EXISTS "FK_garage_request_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" DROP CONSTRAINT IF EXISTS "FK_garage_request_garage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" DROP CONSTRAINT IF EXISTS "FK_car_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_garage" DROP CONSTRAINT IF EXISTS "FK_user_garage_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_garage" DROP CONSTRAINT IF EXISTS "FK_user_garage_garage"`,
    );

    await queryRunner.query(
      `ALTER TABLE "garages" DROP COLUMN IF EXISTS "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garages" DROP COLUMN IF EXISTS "gate_ip"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garages" DROP COLUMN IF EXISTS "gate_port"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garages" DROP COLUMN IF EXISTS "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garages" DROP COLUMN IF EXISTS "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garages" DROP COLUMN IF EXISTS "admin_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garages" DROP COLUMN IF EXISTS "number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garages" DROP COLUMN IF EXISTS "gate_status"`,
    );

    await queryRunner.query(`ALTER TABLE "car" DROP COLUMN IF EXISTS "year"`);
    await queryRunner.query(
      `ALTER TABLE "car" DROP COLUMN IF EXISTS "license_plate"`,
    );

    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN IF EXISTS "password_hash"`,
    );
  }
}
