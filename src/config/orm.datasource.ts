import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { UserEntity } from '../modules/user/entities/user.entity';
import migrations from '../modules/database/migrations';

const ENV_FILE = '.env';
dotenv.config({ path: ENV_FILE });

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  synchronize: false,
  entities: [UserEntity],
  // entities: ['src/module/user/entities/user.entity.ts'],
  migrations,
  // migrations: ['src/module/database/migrations/index.ts'],
  migrationsRun: process.env.DB_MIGRATIONS_RUN == 'true',
  migrationsTableName: process.env.DB_MIGRATIONS_TABLE_NAME,
});
