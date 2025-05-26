import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGarageEntity1747603467118 implements MigrationInterface {
  name = 'AddGarageEntity1747603467118';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "garage" ("garage_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "number" character varying(10) NOT NULL, "description" character varying(255), "gate_ip" character varying(15) NOT NULL, "gate_port" integer NOT NULL, "adminUserId" uuid, CONSTRAINT "PK_garage" PRIMARY KEY ("garage_id")); COMMENT ON COLUMN "garage"."garage_id" IS 'Garage UUID'; COMMENT ON COLUMN "garage"."number" IS 'Garage number'; COMMENT ON COLUMN "garage"."description" IS 'Garage description'; COMMENT ON COLUMN "garage"."gate_ip" IS 'Gate IP address'; COMMENT ON COLUMN "garage"."gate_port" IS 'Gate port'`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage" ADD CONSTRAINT "FK_garage_admin" FOREIGN KEY ("adminUserId") REFERENCES "user"("userId") ON DELETE SET NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "garage" DROP CONSTRAINT "FK_garage_admin"`,
    );
    await queryRunner.query(`DROP TABLE "garage"`);
  }
}
