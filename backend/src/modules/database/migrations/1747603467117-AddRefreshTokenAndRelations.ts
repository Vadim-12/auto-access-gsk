import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenAndRelations1747603467117
  implements MigrationInterface
{
  name = 'AddRefreshTokenAndRelations1747603467117';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_tokens" ("refresh_token" character varying(255) NOT NULL, "user_id" uuid, CONSTRAINT "PK_428e14ded7299edfcf58918beaf" PRIMARY KEY ("refresh_token")); COMMENT ON COLUMN "refresh_tokens"."refresh_token" IS 'Refresh token'; COMMENT ON COLUMN "refresh_tokens"."user_id" IS 'User UUID'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "login"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password_salt"`);
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "role" "public"."user_role_enum" NOT NULL DEFAULT 'user'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."role" IS 'Role of user'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "phone_number" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_f2578043e491921209f5dadd080" UNIQUE ("phone_number")`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."phone_number" IS 'User phone number'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "middle_name" character varying(50)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."middle_name" IS 'User middle name'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."user_id" IS 'User UUID'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password_hash"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "password_hash" character varying(254) NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."password_hash" IS 'User password hash'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "first_name" character varying(50) NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."first_name" IS 'User first name'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "last_name" character varying(50) NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."last_name" IS 'User last name'`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."last_name" IS 'User last name'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "last_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "first_name" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "first_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."password_hash" IS 'User password hash'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password_hash"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "password_hash" character varying NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."user_id" IS 'Идентификатор пользователя'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."middle_name" IS 'User middle name'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "middle_name"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."phone_number" IS 'User phone number'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_f2578043e491921209f5dadd080"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone_number"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."role" IS 'Role of user'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "password_salt" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "login" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "phone" character varying(20) NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
  }
}
