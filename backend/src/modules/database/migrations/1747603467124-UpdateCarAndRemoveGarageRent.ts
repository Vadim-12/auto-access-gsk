import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCarAndRemoveGarageRent1747603467124
  implements MigrationInterface
{
  name = 'UpdateCarAndRemoveGarageRent1747603467124';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Удаляем таблицу garage_rent
    await queryRunner.query(`DROP TABLE IF EXISTS "garage_rent"`);

    // Удаляем старые ограничения и колонки из таблицы cars
    await queryRunner.query(
      `ALTER TABLE "cars" DROP CONSTRAINT IF EXISTS "FK_car_garage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" DROP COLUMN IF EXISTS "garage_id"`,
    );

    // Добавляем новые колонки created_at и updated_at
    await queryRunner.query(
      `ALTER TABLE "cars" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`,
    );

    // Добавляем новую колонку user_id
    await queryRunner.query(
      `ALTER TABLE "cars" ADD COLUMN IF NOT EXISTS "user_id" uuid`,
    );

    // Добавляем внешний ключ для связи с пользователем
    await queryRunner.query(
      `ALTER TABLE "cars" ADD CONSTRAINT "FK_car_user" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем колонку user_id и ее ограничения
    await queryRunner.query(`ALTER TABLE "cars" DROP CONSTRAINT "FK_car_user"`);
    await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "user_id"`);

    // Удаляем колонки created_at и updated_at
    await queryRunner.query(
      `ALTER TABLE "cars" DROP COLUMN IF EXISTS "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" DROP COLUMN IF EXISTS "updated_at"`,
    );

    // Восстанавливаем колонку garage_id и ее ограничения
    await queryRunner.query(`ALTER TABLE "cars" ADD COLUMN "garage_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "cars" ADD CONSTRAINT "FK_car_garage" FOREIGN KEY ("garage_id") REFERENCES "garages"("garage_id") ON DELETE SET NULL`,
    );

    // Восстанавливаем таблицу garage_rent
    await queryRunner.query(`
      CREATE TABLE "garage_rent" (
        "rent_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "garage_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "start_date" TIMESTAMP NOT NULL,
        "end_date" TIMESTAMP NOT NULL,
        "status" character varying(20) NOT NULL DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_garage_rent" PRIMARY KEY ("rent_id"),
        CONSTRAINT "FK_garage_rent_garage" FOREIGN KEY ("garage_id") REFERENCES "garages"("garage_id") ON DELETE CASCADE,
        CONSTRAINT "FK_garage_rent_user" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE
      )
    `);
  }
}
