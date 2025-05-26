import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTokenIdToRefreshToken1748092322406
  implements MigrationInterface
{
  name = 'AddTokenIdToRefreshToken1748092322406';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создаем новую таблицу с refresh_token как первичным ключом
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

    // Копируем данные из старой таблицы
    await queryRunner.query(`
      INSERT INTO "refresh_tokens_new" ("refresh_token", "user_id")
      SELECT "refresh_token", "user_id" FROM "refresh_tokens"
    `);

    // Удаляем старую таблицу
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);

    // Переименовываем новую таблицу
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens_new" RENAME TO "refresh_tokens"`,
    );

    // Восстанавливаем внешний ключ
    await queryRunner.query(`
      ALTER TABLE "refresh_tokens" 
      ADD CONSTRAINT "FK_refresh_tokens_users" 
      FOREIGN KEY ("user_id") 
      REFERENCES "users"("user_id") 
      ON DELETE CASCADE 
      ON UPDATE NO ACTION
    `);

    // Комментарии
    await queryRunner.query(
      `COMMENT ON COLUMN "refresh_tokens"."refresh_token_id" IS 'Refresh token ID'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "refresh_tokens"."refresh_token" IS 'Refresh token'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "refresh_tokens"."user_id" IS 'User UUID'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Создаем старую таблицу
    await queryRunner.query(`
      CREATE TABLE "refresh_tokens_old" (
        "refresh_token" character varying(255) NOT NULL,
        "user_id" uuid NOT NULL,
        CONSTRAINT "PK_refresh_tokens_old" PRIMARY KEY ("refresh_token")
      )
    `);

    // Копируем данные обратно
    await queryRunner.query(`
      INSERT INTO "refresh_tokens_old" ("refresh_token", "user_id")
      SELECT "refresh_token", "user_id" FROM "refresh_tokens"
    `);

    // Удаляем новую таблицу
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);

    // Переименовываем обратно
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens_old" RENAME TO "refresh_tokens"`,
    );

    // Восстанавливаем внешний ключ
    await queryRunner.query(`
      ALTER TABLE "refresh_tokens" 
      ADD CONSTRAINT "FK_refresh_tokens_users" 
      FOREIGN KEY ("user_id") 
      REFERENCES "users"("user_id") 
      ON DELETE CASCADE 
      ON UPDATE NO ACTION
    `);
  }
}
