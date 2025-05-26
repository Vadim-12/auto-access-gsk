import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserEntity1736710427760 implements MigrationInterface {
  name = 'AddUserEntity1736710427760';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" (
        "user_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "phone" character varying(20) NOT NULL,
        "login" character varying(20) NOT NULL,
        "first_name" character varying NOT NULL,
        "last_name" character varying NOT NULL,
        "password_hash" character varying NOT NULL,
        "password_salt" character varying NOT NULL,
        CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id")
      );
      COMMENT ON COLUMN "users"."user_id" IS 'Идентификатор пользователя';
      COMMENT ON COLUMN "users"."phone" IS 'Номер телефона пользователя';
      COMMENT ON COLUMN "users"."login" IS 'Логин пользователя';
      COMMENT ON COLUMN "users"."first_name" IS 'Имя пользователя';
      COMMENT ON COLUMN "users"."last_name" IS 'Фамилия пользователя';
      COMMENT ON COLUMN "users"."password_hash" IS 'Хеш пароля';
      COMMENT ON COLUMN "users"."password_salt" IS 'Соль пароля'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
