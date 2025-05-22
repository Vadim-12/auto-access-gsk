import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGarageRequests1747603467125 implements MigrationInterface {
  name = 'AddGarageRequests1747603467125';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."garage_request_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED')
    `);

    await queryRunner.query(`
      CREATE TABLE "garage_request" (
        "request_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "description" character varying,
        "status" "public"."garage_request_status_enum" NOT NULL DEFAULT 'PENDING',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "user_id" uuid,
        "garage_id" uuid,
        "gsk_id" uuid,
        CONSTRAINT "PK_garage_request" PRIMARY KEY ("request_id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "garage_request"
      ADD CONSTRAINT "FK_garage_request_user"
      FOREIGN KEY ("user_id")
      REFERENCES "user"("user_id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "garage_request"
      ADD CONSTRAINT "FK_garage_request_garage"
      FOREIGN KEY ("garage_id")
      REFERENCES "garage"("garage_id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "garage_request"
      ADD CONSTRAINT "FK_garage_request_gsk"
      FOREIGN KEY ("gsk_id")
      REFERENCES "gsk"("gsk_id")
      ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "garage_request"
      DROP CONSTRAINT "FK_garage_request_gsk"
    `);

    await queryRunner.query(`
      ALTER TABLE "garage_request"
      DROP CONSTRAINT "FK_garage_request_garage"
    `);

    await queryRunner.query(`
      ALTER TABLE "garage_request"
      DROP CONSTRAINT "FK_garage_request_user"
    `);

    await queryRunner.query(`DROP TABLE "garage_request"`);

    await queryRunner.query(`DROP TYPE "public"."garage_request_status_enum"`);
  }
}
