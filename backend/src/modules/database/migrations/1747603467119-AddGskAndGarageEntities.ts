import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGskAndGarageEntities1747603467119
  implements MigrationInterface
{
  name = 'AddGskAndGarageEntities1747603467119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "gsk" (
        "gsk_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(100) NOT NULL,
        "address" character varying(255) NOT NULL,
        CONSTRAINT "PK_gsk" PRIMARY KEY ("gsk_id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "garage" (
        "garage_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "number" character varying(20) NOT NULL,
        "camera_ip" character varying(15),
        "camera_port" integer,
        "gate_ip" character varying(15) NOT NULL,
        "gate_port" integer NOT NULL,
        "gsk_id" uuid NOT NULL,
        CONSTRAINT "PK_garage" PRIMARY KEY ("garage_id"),
        CONSTRAINT "FK_garage_gsk" FOREIGN KEY ("gsk_id") REFERENCES "gsk"("gsk_id") ON DELETE CASCADE
      )`,
    );

    await queryRunner.query(`COMMENT ON COLUMN "gsk"."gsk_id" IS 'GSK UUID'`);
    await queryRunner.query(`COMMENT ON COLUMN "gsk"."name" IS 'GSK name'`);
    await queryRunner.query(
      `COMMENT ON COLUMN "gsk"."address" IS 'GSK address'`,
    );

    await queryRunner.query(
      `COMMENT ON COLUMN "garage"."garage_id" IS 'Garage UUID'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage"."number" IS 'Garage number'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage"."camera_ip" IS 'Camera IP address'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage"."camera_port" IS 'Camera port'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage"."gate_ip" IS 'Gate IP address'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage"."gate_port" IS 'Gate port'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "garage"`);
    await queryRunner.query(`DROP TABLE "gsk"`);
  }
}
