import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTablesToPlural1748092322407 implements MigrationInterface {
  name = 'RenameTablesToPlural1748092322407';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Переименовываем таблицы
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "users"`);
    await queryRunner.query(
      `ALTER TABLE "refresh_token" RENAME TO "refresh_tokens"`,
    );
    await queryRunner.query(`ALTER TABLE "car" RENAME TO "cars"`);
    await queryRunner.query(`ALTER TABLE "garage" RENAME TO "garages"`);
    await queryRunner.query(
      `ALTER TABLE "garage_request" RENAME TO "garage_requests"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_garage" RENAME TO "user_garages"`,
    );

    // Обновляем внешние ключи
    await queryRunner.query(`
      ALTER TABLE "refresh_tokens" 
      DROP CONSTRAINT "FK_refresh_token_user",
      ADD CONSTRAINT "FK_refresh_tokens_users" 
      FOREIGN KEY ("userId") 
      REFERENCES "users"("userId") 
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "cars" 
      DROP CONSTRAINT "FK_car_user",
      ADD CONSTRAINT "FK_cars_users" 
      FOREIGN KEY ("userId") 
      REFERENCES "users"("userId") 
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "garages" 
      DROP CONSTRAINT "FK_garage_user",
      ADD CONSTRAINT "FK_garages_users" 
      FOREIGN KEY ("adminUserId") 
      REFERENCES "users"("userId") 
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "garage_requests" 
      DROP CONSTRAINT "FK_garage_request_user",
      ADD CONSTRAINT "FK_garage_requests_users" 
      FOREIGN KEY ("userId") 
      REFERENCES "users"("userId") 
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "garage_requests" 
      DROP CONSTRAINT "FK_garage_request_garage",
      ADD CONSTRAINT "FK_garage_requests_garages" 
      FOREIGN KEY ("garage_id") 
      REFERENCES "garages"("garage_id") 
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "user_garages" 
      DROP CONSTRAINT "FK_user_garage_user",
      ADD CONSTRAINT "FK_user_garages_users" 
      FOREIGN KEY ("userId") 
      REFERENCES "users"("userId") 
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "user_garages" 
      DROP CONSTRAINT "FK_user_garage_garage",
      ADD CONSTRAINT "FK_user_garages_garages" 
      FOREIGN KEY ("garage_id") 
      REFERENCES "garages"("garage_id") 
      ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Возвращаем старые имена таблиц
    await queryRunner.query(`ALTER TABLE "users" RENAME TO "user"`);
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" RENAME TO "refresh_token"`,
    );
    await queryRunner.query(`ALTER TABLE "cars" RENAME TO "car"`);
    await queryRunner.query(`ALTER TABLE "garages" RENAME TO "garage"`);
    await queryRunner.query(
      `ALTER TABLE "garage_requests" RENAME TO "garage_request"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_garages" RENAME TO "user_garage"`,
    );

    // Возвращаем старые внешние ключи
    await queryRunner.query(`
      ALTER TABLE "refresh_token" 
      DROP CONSTRAINT "FK_refresh_tokens_users",
      ADD CONSTRAINT "FK_refresh_token_user" 
      FOREIGN KEY ("userId") 
      REFERENCES "user"("userId") 
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "car" 
      DROP CONSTRAINT "FK_cars_users",
      ADD CONSTRAINT "FK_car_user" 
      FOREIGN KEY ("userId") 
      REFERENCES "user"("userId") 
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "garage" 
      DROP CONSTRAINT "FK_garages_users",
      ADD CONSTRAINT "FK_garage_user" 
      FOREIGN KEY ("adminUserId") 
      REFERENCES "user"("userId") 
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "garage_request" 
      DROP CONSTRAINT "FK_garage_requests_users",
      ADD CONSTRAINT "FK_garage_request_user" 
      FOREIGN KEY ("userId") 
      REFERENCES "user"("userId") 
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "garage_request" 
      DROP CONSTRAINT "FK_garage_requests_garages",
      ADD CONSTRAINT "FK_garage_request_garage" 
      FOREIGN KEY ("garage_id") 
      REFERENCES "garage"("garage_id") 
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "user_garage" 
      DROP CONSTRAINT "FK_user_garages_users",
      ADD CONSTRAINT "FK_user_garage_user" 
      FOREIGN KEY ("userId") 
      REFERENCES "user"("userId") 
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "user_garage" 
      DROP CONSTRAINT "FK_user_garages_garages",
      ADD CONSTRAINT "FK_user_garage_garage" 
      FOREIGN KEY ("garage_id") 
      REFERENCES "garage"("garage_id") 
      ON DELETE CASCADE
    `);
  }
}
