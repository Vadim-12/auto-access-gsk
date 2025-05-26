import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveGateIpAndPortFromGarages1748092322410
  implements MigrationInterface
{
  name = 'RemoveGateIpAndPortFromGarages1748092322410';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Проверяем существование колонок перед удалением
    const columnsToCheck = ['gate_ip', 'gate_port'];
    for (const column of columnsToCheck) {
      const columnExists = await queryRunner.query(`
        SELECT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'garages' 
          AND column_name = '${column}'
        );
      `);

      if (columnExists[0].exists) {
        await queryRunner.query(
          `ALTER TABLE "garages" DROP COLUMN "${column}"`,
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Проверяем существование колонок перед добавлением
    const columnsToAdd = [
      {
        name: 'gate_ip',
        type: 'character varying(15)',
        comment: 'Gate IP address',
      },
      {
        name: 'gate_port',
        type: 'integer',
        comment: 'Gate port',
      },
    ];

    for (const column of columnsToAdd) {
      const columnExists = await queryRunner.query(`
        SELECT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'garages' 
          AND column_name = '${column.name}'
        );
      `);

      if (!columnExists[0].exists) {
        await queryRunner.query(
          `ALTER TABLE "garages" ADD "${column.name}" ${column.type} NOT NULL`,
        );
        await queryRunner.query(
          `COMMENT ON COLUMN "garages"."${column.name}" IS '${column.comment}'`,
        );
      }
    }
  }
}
