import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameCameraPortToStreamPort1748092322404
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "cameras" 
      RENAME COLUMN "port" TO "stream_port";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "cameras" 
      RENAME COLUMN "stream_port" TO "port";
    `);
  }
}
