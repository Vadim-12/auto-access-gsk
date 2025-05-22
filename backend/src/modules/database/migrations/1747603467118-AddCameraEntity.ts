import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCameraEntity1747603467118 implements MigrationInterface {
  name = 'AddCameraEntity1747603467118';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."camera_status_enum" AS ENUM('active', 'inactive')`,
    );

    await queryRunner.query(
      `CREATE TABLE "camera" (
        "camera_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "garage_id" uuid NOT NULL,
        "ip" character varying(15) NOT NULL,
        "port" integer NOT NULL,
        "status" "public"."camera_status_enum" NOT NULL DEFAULT 'inactive',
        "name" character varying(100) NOT NULL,
        "description" character varying(255),
        "last_connection_time" TIMESTAMP,
        CONSTRAINT "PK_camera" PRIMARY KEY ("camera_id")
      )`,
    );

    await queryRunner.query(
      `COMMENT ON COLUMN "camera"."camera_id" IS 'Camera UUID'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "camera"."garage_id" IS 'Garage UUID'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "camera"."ip" IS 'Camera IP address'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "camera"."port" IS 'Camera port'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "camera"."status" IS 'Camera status'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "camera"."name" IS 'Camera name'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "camera"."description" IS 'Camera description'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "camera"."last_connection_time" IS 'Last connection time'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "camera"`);
    await queryRunner.query(`DROP TYPE "public"."camera_status_enum"`);
  }
}
