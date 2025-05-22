import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCameraGarageRelation1747603467122
  implements MigrationInterface
{
  name = 'UpdateCameraGarageRelation1747603467122';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Удаляем старые ограничения и колонку
    await queryRunner.query(
      `ALTER TABLE "camera" DROP CONSTRAINT IF EXISTS "UQ_camera_garage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "camera" DROP CONSTRAINT IF EXISTS "FK_camera_garage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "camera" DROP COLUMN IF EXISTS "garage_id"`,
    );

    // Добавляем новую колонку с правильными ограничениями
    await queryRunner.query(`ALTER TABLE "camera" ADD COLUMN "garage_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "camera" ADD CONSTRAINT "FK_camera_garage" FOREIGN KEY ("garage_id") REFERENCES "garage"("garage_id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "camera" ADD CONSTRAINT "UQ_camera_garage" UNIQUE ("garage_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "camera" DROP CONSTRAINT "UQ_camera_garage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "camera" DROP CONSTRAINT "FK_camera_garage"`,
    );
    await queryRunner.query(`ALTER TABLE "camera" DROP COLUMN "garage_id"`);
  }
}
