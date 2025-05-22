import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCarAndRemoveGarageRent1747603467124
  implements MigrationInterface
{
  name = 'UpdateCarAndRemoveGarageRent1747603467124';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Удаляем старую таблицу аренды, если она существует
    await queryRunner.query(`DROP TABLE IF EXISTS "garage_rent"`);

    // Обновляем таблицу автомобилей
    await queryRunner.query(
      `ALTER TABLE "car" DROP CONSTRAINT IF EXISTS "FK_car_garage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" DROP COLUMN IF EXISTS "garage_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD COLUMN IF NOT EXISTS "user_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD CONSTRAINT "FK_car_user" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE`,
    );

    // Создаем таблицу связи пользователей и гаражей, если её нет
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "user_garage" (
        "user_id" uuid NOT NULL,
        "garage_id" uuid NOT NULL,
        CONSTRAINT "PK_user_garage" PRIMARY KEY ("user_id", "garage_id"),
        CONSTRAINT "FK_user_garage_user" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_garage_garage" FOREIGN KEY ("garage_id") REFERENCES "garage"("garage_id") ON DELETE CASCADE
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем таблицу связи пользователей и гаражей
    await queryRunner.query(`DROP TABLE IF EXISTS "user_garage"`);

    // Возвращаем связь автомобиля с гаражем
    await queryRunner.query(
      `ALTER TABLE "car" DROP CONSTRAINT IF EXISTS "FK_car_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" DROP COLUMN IF EXISTS "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD COLUMN IF NOT EXISTS "garage_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD CONSTRAINT "FK_car_garage" FOREIGN KEY ("garage_id") REFERENCES "garage"("garage_id") ON DELETE CASCADE`,
    );

    // Создаем таблицу аренды
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "garage_rent" (
        "rent_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "garage_id" uuid NOT NULL,
        "start_date" timestamp NOT NULL,
        "end_date" timestamp,
        "monthly_price" decimal(10,2) NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'ACTIVE',
        "description" varchar(255),
        CONSTRAINT "PK_garage_rent" PRIMARY KEY ("rent_id"),
        CONSTRAINT "FK_garage_rent_user" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE,
        CONSTRAINT "FK_garage_rent_garage" FOREIGN KEY ("garage_id") REFERENCES "garage"("garage_id") ON DELETE CASCADE
      )`,
    );
  }
}
