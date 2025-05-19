import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenAndRelations1747603467117
  implements MigrationInterface
{
  name = 'AddRefreshTokenAndRelations1747603467117';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_token" ("refreshToken" character varying(255) NOT NULL, "user_id" uuid, CONSTRAINT "PK_428e14ded7299edfcf58918beaf" PRIMARY KEY ("refreshToken")); COMMENT ON COLUMN "refresh_token"."refreshToken" IS 'Refresh token'; COMMENT ON COLUMN "refresh_token"."user_id" IS 'User UUID'`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "login"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "passwordSalt"`);
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "role" "public"."user_role_enum" NOT NULL DEFAULT 'user'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."role" IS 'Role of user'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "phoneNumber" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_f2578043e491921209f5dadd080" UNIQUE ("phoneNumber")`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."phoneNumber" IS 'User phone number'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "middleName" character varying(50)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."middleName" IS 'User middle name'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."user_id" IS 'User UUID'`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "passwordHash"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "passwordHash" character varying(254) NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."passwordHash" IS 'User password hash'`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstName"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "firstName" character varying(50) NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."firstName" IS 'User first name'`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastName"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "lastName" character varying(50) NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."lastName" IS 'User last name'`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."lastName" IS 'User last name'`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastName"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "lastName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."firstName" IS 'User first name'`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstName"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "firstName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."passwordHash" IS 'User password hash'`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "passwordHash"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "passwordHash" character varying NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."user_id" IS 'Идентификатор пользователя'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."middleName" IS 'User middle name'`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "middleName"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."phoneNumber" IS 'User phone number'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_f2578043e491921209f5dadd080"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phoneNumber"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."role" IS 'Role of user'`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "passwordSalt" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "login" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "phone" character varying(20) NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "refresh_token"`);
  }
}
