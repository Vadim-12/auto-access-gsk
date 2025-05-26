import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDetectedCarColumns1748092322418 implements MigrationInterface {
  name = 'AddDetectedCarColumns1748092322418';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "garage_access_logs"
      ADD COLUMN "detected_car_number" varchar,
      ADD COLUMN "detected_car_color" varchar;

      COMMENT ON COLUMN "garage_access_logs"."detected_car_number" IS 'Номер обнаруженного автомобиля';
      COMMENT ON COLUMN "garage_access_logs"."detected_car_color" IS 'Цвет обнаруженного автомобиля';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "garage_access_logs"
      DROP COLUMN "detected_car_number",
      DROP COLUMN "detected_car_color";
    `);
  }
}
