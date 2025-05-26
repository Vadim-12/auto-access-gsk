import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCarEntity1747603467123 implements MigrationInterface {
  name = 'AddCarEntity1747603467123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "cars" (
        "car_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "brand" character varying(50) NOT NULL,
        "model" character varying(50) NOT NULL,
        "year" integer NOT NULL,
        "license_plate" character varying(20) NOT NULL,
        "color" character varying(30) NOT NULL,
        "vin" character varying(17) NOT NULL,
        "description" character varying(255),
        "garage_id" uuid,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_car" PRIMARY KEY ("car_id"),
        CONSTRAINT "UQ_car_license_plate" UNIQUE ("license_plate"),
        CONSTRAINT "UQ_car_vin" UNIQUE ("vin"),
        CONSTRAINT "FK_car_garage" FOREIGN KEY ("garage_id") REFERENCES "garages"("garage_id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`COMMENT ON COLUMN "cars"."car_id" IS 'Car UUID'`);
    await queryRunner.query(`COMMENT ON COLUMN "cars"."brand" IS 'Car brand'`);
    await queryRunner.query(`COMMENT ON COLUMN "cars"."model" IS 'Car model'`);
    await queryRunner.query(`COMMENT ON COLUMN "cars"."year" IS 'Car year'`);
    await queryRunner.query(
      `COMMENT ON COLUMN "cars"."license_plate" IS 'License plate number'`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "cars"."color" IS 'Car color'`);
    await queryRunner.query(
      `COMMENT ON COLUMN "cars"."vin" IS 'Vehicle Identification Number'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "cars"."description" IS 'Car description'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "cars"."garage_id" IS 'Garage UUID'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "cars"."created_at" IS 'Created at'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "cars"."updated_at" IS 'Updated at'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cars"`);
  }
}
