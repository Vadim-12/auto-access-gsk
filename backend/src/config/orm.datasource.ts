import { DataSource, DataSourceOptions } from 'typeorm';
import { UserEntity } from '../modules/user/entities/user.entity';
import { RefreshTokenEntity } from '../modules/auth/entities/refresh-token.entity';
import { CameraEntity } from '../modules/camera/entities/camera.entity';
import { GarageEntity } from '../modules/garage/entities/garage.entity';
import { GarageRequestEntity } from '../modules/garage-request/entities/garage-request.entity';
import { CarEntity } from '../modules/car/entities/car.entity';
import { GateEntity } from '../modules/gate/entities/gate.entity';
import { GarageAccessLogEntity } from '../modules/garage/entities/garage-access-log.entity';
import migrations from '../modules/database/migrations';

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  synchronize: false,
  entities: [
    UserEntity,
    RefreshTokenEntity,
    CameraEntity,
    GarageEntity,
    GarageRequestEntity,
    CarEntity,
    GateEntity,
    GarageAccessLogEntity,
  ],
  migrations,
  migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
  migrationsTableName: process.env.DB_MIGRATIONS_TABLE_NAME,
};

export default new DataSource(options);
export { options as ormConfig };
