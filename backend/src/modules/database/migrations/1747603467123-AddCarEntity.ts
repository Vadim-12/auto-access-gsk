import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCarEntity1747603467123 implements MigrationInterface {
  name = 'AddCarEntity1747603467123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "car" (
        "car_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "brand" character varying(50) NOT NULL,
        "model" character varying(50) NOT NULL,
        "license_plate" character varying(20) NOT NULL,
        "color" character varying(30) NOT NULL,
        "vin" character varying(17) NOT NULL,
        "description" character varying(255),
        "garage_id" uuid,
        CONSTRAINT "PK_car" PRIMARY KEY ("car_id"),
        CONSTRAINT "UQ_car_license_plate" UNIQUE ("license_plate"),
        CONSTRAINT "UQ_car_vin" UNIQUE ("vin"),
        CONSTRAINT "FK_car_garage" FOREIGN KEY ("garage_id") REFERENCES "garage"("garage_id") ON DELETE CASCADE
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "car"`);
  }
}
