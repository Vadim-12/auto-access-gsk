import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCameraEntity1747603467122 implements MigrationInterface {
  name = 'AddCameraEntity1747603467122';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."camera_status_enum" AS ENUM('active', 'inactive')`,
    );

    await queryRunner.query(
      `CREATE TABLE "cameras" (
        "camera_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "garage_id" uuid NOT NULL,
        "ip" character varying(15) NOT NULL,
        "port" integer NOT NULL,
        "status" "public"."camera_status_enum" NOT NULL DEFAULT 'inactive',
        "name" character varying(100) NOT NULL,
        "description" character varying(255),
        "last_connection_time" TIMESTAMP,
        CONSTRAINT "PK_camera" PRIMARY KEY ("camera_id"),
        CONSTRAINT "FK_camera_garage" FOREIGN KEY ("garage_id") REFERENCES "garages"("garage_id") ON DELETE CASCADE,
        CONSTRAINT "UQ_camera_garage" UNIQUE ("garage_id")
      )`,
    );

    await queryRunner.query(
      `COMMENT ON COLUMN "cameras"."camera_id" IS 'Camera UUID'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "cameras"."garage_id" IS 'Garage UUID'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "cameras"."ip" IS 'Camera IP address'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "cameras"."port" IS 'Camera port'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "cameras"."status" IS 'Camera status'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "cameras"."name" IS 'Camera name'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "cameras"."description" IS 'Camera description'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "cameras"."last_connection_time" IS 'Last connection time'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cameras"`);
    await queryRunner.query(`DROP TYPE "public"."camera_status_enum"`);
  }
}
