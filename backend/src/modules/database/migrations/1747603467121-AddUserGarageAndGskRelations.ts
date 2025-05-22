import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserGarageAndGskRelations1747603467121
  implements MigrationInterface
{
  name = 'AddUserGarageAndGskRelations1747603467121';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Добавляем связь между ГСК и администратором
    await queryRunner.query(`ALTER TABLE "gsk" ADD COLUMN "admin_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "gsk" ADD CONSTRAINT "FK_gsk_admin" FOREIGN KEY ("admin_id") REFERENCES "user"("user_id") ON DELETE SET NULL`,
    );

    // Создаем таблицу связи между пользователями и гаражами
    await queryRunner.query(
      `CREATE TABLE "user_garage" (
        "user_id" uuid NOT NULL,
        "garage_id" uuid NOT NULL,
        CONSTRAINT "PK_user_garage" PRIMARY KEY ("user_id", "garage_id"),
        CONSTRAINT "FK_user_garage_user" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_garage_garage" FOREIGN KEY ("garage_id") REFERENCES "garage"("garage_id") ON DELETE CASCADE
      )`,
    );

    // Добавляем связь между камерой и гаражем
    await queryRunner.query(`ALTER TABLE "camera" ADD COLUMN "garage_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "camera" ADD CONSTRAINT "FK_camera_garage" FOREIGN KEY ("garage_id") REFERENCES "garage"("garage_id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "camera" ADD CONSTRAINT "UQ_camera_garage" UNIQUE ("garage_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем связь между камерой и гаражем
    await queryRunner.query(
      `ALTER TABLE "camera" DROP CONSTRAINT "UQ_camera_garage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "camera" DROP CONSTRAINT "FK_camera_garage"`,
    );
    await queryRunner.query(`ALTER TABLE "camera" DROP COLUMN "garage_id"`);

    await queryRunner.query(`DROP TABLE "user_garage"`);
    await queryRunner.query(`ALTER TABLE "gsk" DROP CONSTRAINT "FK_gsk_admin"`);
    await queryRunner.query(`ALTER TABLE "gsk" DROP COLUMN "admin_id"`);
  }
}
