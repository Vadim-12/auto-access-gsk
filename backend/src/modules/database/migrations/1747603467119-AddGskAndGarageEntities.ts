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
        "admin_id" uuid,
        CONSTRAINT "PK_gsk" PRIMARY KEY ("gsk_id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "garages" (
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
      `COMMENT ON COLUMN "gsk"."admin_id" IS 'Admin user UUID'`,
    );

    await queryRunner.query(
      `COMMENT ON COLUMN "garages"."garage_id" IS 'Garage UUID'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garages"."number" IS 'Garage number'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garages"."camera_ip" IS 'Camera IP address'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garages"."camera_port" IS 'Camera port'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garages"."gate_ip" IS 'Gate IP address'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garages"."gate_port" IS 'Gate port'`,
    );

    await queryRunner.query(`
      ALTER TABLE "gsk" 
      ADD CONSTRAINT "FK_gsk_admin" 
      FOREIGN KEY ("admin_id") 
      REFERENCES "users"("user_id") 
      ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "garages"`);
    await queryRunner.query(`DROP TABLE "gsk"`);
  }
}
