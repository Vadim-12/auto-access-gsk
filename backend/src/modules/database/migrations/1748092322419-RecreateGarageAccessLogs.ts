import { MigrationInterface, QueryRunner } from 'typeorm';

export class RecreateGarageAccessLogs1748092322419
  implements MigrationInterface
{
  name = 'RecreateGarageAccessLogs1748092322419';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Сначала удаляем существующую таблицу
    await queryRunner.query(`DROP TABLE IF EXISTS "garage_access_logs"`);

    // Создаем таблицу заново с правильной структурой
    await queryRunner.query(`
      CREATE TABLE "garage_access_logs" (
        "log_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "garage_id" uuid NOT NULL,
        "detected_car_id" uuid,
        "ai_description" text,
        "confidence" float NOT NULL,
        "is_access_granted" boolean NOT NULL DEFAULT false,
        "detected_car_number" varchar,
        "detected_car_color" varchar,
        "detected_car_details" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_garage_access_logs" PRIMARY KEY ("log_id"),
        CONSTRAINT "FK_garage_access_logs_garage" FOREIGN KEY ("garage_id") REFERENCES "garages"("garage_id") ON DELETE CASCADE,
        CONSTRAINT "FK_garage_access_logs_car" FOREIGN KEY ("detected_car_id") REFERENCES "cars"("car_id") ON DELETE SET NULL
      )
    `);

    // Создаем индексы
    await queryRunner.query(`
      CREATE INDEX "IDX_garage_access_logs_garage" ON "garage_access_logs" ("garage_id");
      CREATE INDEX "IDX_garage_access_logs_detected_car" ON "garage_access_logs" ("detected_car_id");
      CREATE INDEX "IDX_garage_access_logs_created_at" ON "garage_access_logs" ("created_at");
    `);

    // Добавляем комментарии
    await queryRunner.query(`
      COMMENT ON COLUMN "garage_access_logs"."log_id" IS 'Log entry UUID';
      COMMENT ON COLUMN "garage_access_logs"."garage_id" IS 'Garage UUID';
      COMMENT ON COLUMN "garage_access_logs"."detected_car_id" IS 'Detected car UUID';
      COMMENT ON COLUMN "garage_access_logs"."ai_description" IS 'AI analysis description';
      COMMENT ON COLUMN "garage_access_logs"."confidence" IS 'AI confidence level';
      COMMENT ON COLUMN "garage_access_logs"."is_access_granted" IS 'Флаг разрешения доступа';
      COMMENT ON COLUMN "garage_access_logs"."detected_car_number" IS 'Номер обнаруженного автомобиля';
      COMMENT ON COLUMN "garage_access_logs"."detected_car_color" IS 'Цвет обнаруженного автомобиля';
      COMMENT ON COLUMN "garage_access_logs"."detected_car_details" IS 'Detected car details';
      COMMENT ON COLUMN "garage_access_logs"."created_at" IS 'Created at timestamp';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "garage_access_logs"`);
  }
}
