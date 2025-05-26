import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenEntity1747603467121 implements MigrationInterface {
  name = 'AddRefreshTokenEntity1747603467121';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Проверяем существование таблицы refresh_tokens
    const refreshTokensExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'refresh_tokens'
      );
    `);

    if (!refreshTokensExists[0].exists) {
      // Если таблицы нет, просто создаем новую
      await queryRunner.query(`
        CREATE TABLE "refresh_tokens" (
          "refresh_token_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "refresh_token" character varying(255) NOT NULL,
          "user_id" uuid NOT NULL,
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_refresh_tokens" PRIMARY KEY ("refresh_token_id")
        )
      `);
    } else {
      // Если таблица существует, создаем новую и переносим данные
      await queryRunner.query(`
        CREATE TABLE "refresh_tokens_new" (
          "refresh_token_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "refresh_token" character varying(255) NOT NULL,
          "user_id" uuid NOT NULL,
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_refresh_tokens_new" PRIMARY KEY ("refresh_token_id")
        )
      `);

      await queryRunner.query(`
        INSERT INTO "refresh_tokens_new" ("refresh_token", "user_id")
        SELECT "refresh_token", "user_id" FROM "refresh_tokens"
      `);

      await queryRunner.query(`DROP TABLE "refresh_tokens"`);

      await queryRunner.query(
        `ALTER TABLE "refresh_tokens_new" RENAME TO "refresh_tokens"`,
      );
    }

    await queryRunner.query(`
      ALTER TABLE "refresh_tokens" 
      ADD CONSTRAINT "FK_refresh_tokens_user" 
      FOREIGN KEY ("user_id") 
      REFERENCES "user"("user_id") 
      ON DELETE CASCADE 
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "refresh_tokens_old" (
        "refresh_token" character varying(255) NOT NULL,
        "user_id" uuid,
        CONSTRAINT "PK_refresh_tokens_old" PRIMARY KEY ("refresh_token")
      )
    `);

    await queryRunner.query(`
      INSERT INTO "refresh_tokens_old" ("refresh_token", "user_id")
      SELECT "refresh_token", "user_id" FROM "refresh_tokens"
    `);

    await queryRunner.query(`DROP TABLE "refresh_tokens"`);

    await queryRunner.query(
      `ALTER TABLE "refresh_tokens_old" RENAME TO "refresh_tokens"`,
    );

    await queryRunner.query(`
      ALTER TABLE "refresh_tokens" 
      ADD CONSTRAINT "FK_refresh_tokens_user" 
      FOREIGN KEY ("user_id") 
      REFERENCES "user"("user_id") 
      ON DELETE CASCADE 
      ON UPDATE NO ACTION
    `);
  }
}
