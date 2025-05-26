import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeGarageNumberToInt1748092322401
  implements MigrationInterface
{
  name = 'ChangeGarageNumberToInt1748092322401';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Сначала удаляем существующие данные, так как они могут быть невалидными
    await queryRunner.query(`DELETE FROM "garages"`);

    // Меняем тип колонки на int
    await queryRunner.query(
      `ALTER TABLE "garages" ALTER COLUMN "number" TYPE integer USING "number"::integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Возвращаем тип колонки обратно на varchar
    await queryRunner.query(
      `ALTER TABLE "garages" ALTER COLUMN "number" TYPE character varying(10)`,
    );
  }
}
