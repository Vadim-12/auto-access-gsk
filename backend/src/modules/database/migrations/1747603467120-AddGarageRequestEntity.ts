import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGarageRequestEntity1747603467120 implements MigrationInterface {
  name = 'AddGarageRequestEntity1747603467120';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."garage_request_status_enum" AS ENUM('pending', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."garage_request_type_enum" AS ENUM('access', 'unlink')`,
    );
    await queryRunner.query(
      `CREATE TABLE "garage_request" ("request_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "garage_id" uuid NOT NULL, "status" "public"."garage_request_status_enum" NOT NULL DEFAULT 'pending', "description" character varying(255), "type" "public"."garage_request_type_enum" NOT NULL DEFAULT 'access', "admin_comment" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_garage_request" PRIMARY KEY ("request_id")); COMMENT ON COLUMN "garage_request"."request_id" IS 'Request UUID'; COMMENT ON COLUMN "garage_request"."userId" IS 'User UUID'; COMMENT ON COLUMN "garage_request"."garage_id" IS 'Garage UUID'; COMMENT ON COLUMN "garage_request"."status" IS 'Request status'; COMMENT ON COLUMN "garage_request"."description" IS 'Request description'; COMMENT ON COLUMN "garage_request"."type" IS 'Request type'; COMMENT ON COLUMN "garage_request"."admin_comment" IS 'Admin comment'; COMMENT ON COLUMN "garage_request"."created_at" IS 'Created at'; COMMENT ON COLUMN "garage_request"."updated_at" IS 'Updated at'`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" ADD CONSTRAINT "FK_garage_request_user" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" ADD CONSTRAINT "FK_garage_request_garage" FOREIGN KEY ("garage_id") REFERENCES "garage"("garage_id") ON DELETE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "garage_request" DROP CONSTRAINT "FK_garage_request_garage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" DROP CONSTRAINT "FK_garage_request_user"`,
    );
    await queryRunner.query(`DROP TABLE "garage_request"`);
    await queryRunner.query(`DROP TYPE "public"."garage_request_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."garage_request_status_enum"`);
  }
}
