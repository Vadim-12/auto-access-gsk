import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserGarageAndGskRelations1747603467121
  implements MigrationInterface
{
  name = 'AddUserGarageAndGskRelations1747603467121';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_garages" (
        "user_garage_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "garage_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_garage" PRIMARY KEY ("user_garage_id"),
        CONSTRAINT "FK_user_garage_user" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_garage_garage" FOREIGN KEY ("garage_id") REFERENCES "garages"("garage_id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "garage_requests" (
        "request_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "garage_id" uuid NOT NULL,
        "status" character varying(20) NOT NULL DEFAULT 'pending',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_garage_request" PRIMARY KEY ("request_id"),
        CONSTRAINT "FK_garage_request_user" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE,
        CONSTRAINT "FK_garage_request_garage" FOREIGN KEY ("garage_id") REFERENCES "garages"("garage_id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `COMMENT ON COLUMN "user_garages"."user_garage_id" IS 'User garage relation UUID'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user_garages"."user_id" IS 'User UUID'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user_garages"."garage_id" IS 'Garage UUID'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user_garages"."created_at" IS 'Created at timestamp'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user_garages"."updated_at" IS 'Updated at timestamp'`,
    );

    await queryRunner.query(
      `COMMENT ON COLUMN "garage_requests"."request_id" IS 'Garage request UUID'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage_requests"."user_id" IS 'User UUID'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage_requests"."garage_id" IS 'Garage UUID'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage_requests"."status" IS 'Request status'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage_requests"."created_at" IS 'Created at timestamp'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage_requests"."updated_at" IS 'Updated at timestamp'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "garage_requests"`);
    await queryRunner.query(`DROP TABLE "user_garages"`);
  }
}
