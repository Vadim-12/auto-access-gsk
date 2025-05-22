import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixSomething1747794403396 implements MigrationInterface {
  name = 'FixSomething1747794403396';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "camera" DROP CONSTRAINT "FK_camera_garage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" DROP CONSTRAINT "FK_garage_request_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" DROP CONSTRAINT "FK_garage_request_garage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" DROP CONSTRAINT "FK_garage_request_gsk"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage" DROP CONSTRAINT "FK_garage_gsk"`,
    );
    await queryRunner.query(`ALTER TABLE "car" DROP CONSTRAINT "FK_car_user"`);
    await queryRunner.query(
      `ALTER TABLE "user_garage" DROP CONSTRAINT "FK_user_garage_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_garage" DROP CONSTRAINT "FK_user_garage_garage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "camera" DROP COLUMN "last_connection_time"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" DROP COLUMN "gsk_id"`,
    );
    await queryRunner.query(`ALTER TABLE "garage" DROP COLUMN "camera_ip"`);
    await queryRunner.query(`ALTER TABLE "garage" DROP COLUMN "camera_port"`);
    await queryRunner.query(`ALTER TABLE "garage" DROP COLUMN "gate_ip"`);
    await queryRunner.query(`ALTER TABLE "garage" DROP COLUMN "gate_port"`);
    await queryRunner.query(`ALTER TABLE "garage" DROP COLUMN "gsk_id"`);
    await queryRunner.query(
      `ALTER TABLE "car" DROP CONSTRAINT "UQ_car_license_plate"`,
    );
    await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "license_plate"`);
    await queryRunner.query(`ALTER TABLE "car" DROP CONSTRAINT "UQ_car_vin"`);
    await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "vin"`);
    await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "garage_request" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage" ADD "description" character varying(255)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage"."description" IS 'Garage description'`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage" ADD "gateIp" character varying(15) NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage"."gateIp" IS 'Gate IP address'`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage" ADD "gatePort" integer NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage"."gatePort" IS 'Gate port'`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "garage" ADD "adminUserId" uuid`);
    await queryRunner.query(
      `COMMENT ON COLUMN "garage"."adminUserId" IS 'User UUID'`,
    );
    await queryRunner.query(`ALTER TABLE "car" ADD "year" integer NOT NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "car"."year" IS 'Car year'`);
    await queryRunner.query(
      `ALTER TABLE "car" ADD "licensePlate" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD CONSTRAINT "UQ_376f481e04705afcf4a2bc0aa9b" UNIQUE ("licensePlate")`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "car"."licensePlate" IS 'Car license plate'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "camera"."garage_id" IS 'Garage UUID'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage_request"."request_id" IS 'Garage request UUID'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage_request"."status" IS 'Request status'`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" ADD "description" character varying(255)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage_request"."description" IS 'Request description'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage_request"."user_id" IS 'User UUID'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage_request"."garage_id" IS 'Garage UUID'`,
    );
    await queryRunner.query(`ALTER TABLE "garage" DROP COLUMN "number"`);
    await queryRunner.query(
      `ALTER TABLE "garage" ADD "number" character varying(10) NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage"."number" IS 'Garage number'`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "car"."car_id" IS 'Car UUID'`);
    await queryRunner.query(`COMMENT ON COLUMN "car"."brand" IS 'Car brand'`);
    await queryRunner.query(`COMMENT ON COLUMN "car"."model" IS 'Car model'`);
    await queryRunner.query(`COMMENT ON COLUMN "car"."color" IS 'Car color'`);
    await queryRunner.query(`COMMENT ON COLUMN "car"."user_id" IS 'User UUID'`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "passwordHash"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "passwordHash" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."passwordHash" IS 'User password hash'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "phoneNumber" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_f2578043e491921209f5dadd080"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_84b91f6db98b87acbebee80680" ON "user_garage" ("garage_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7235f0d6ba59300683af41d30c" ON "user_garage" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "camera" ADD CONSTRAINT "FK_48cf73254a0f2e1ebc986cfbc32" FOREIGN KEY ("garage_id") REFERENCES "garage"("garage_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" ADD CONSTRAINT "FK_19a8fbe5073e993ea843717ec1e" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" ADD CONSTRAINT "FK_30c280ba35ac1165d34ae942fcc" FOREIGN KEY ("garage_id") REFERENCES "garage"("garage_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage" ADD CONSTRAINT "FK_c3d11bc34b357ef74433efe32bb" FOREIGN KEY ("adminUserId") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD CONSTRAINT "FK_c8d34198d86de9e96aae03b8990" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_garage" ADD CONSTRAINT "FK_84b91f6db98b87acbebee806802" FOREIGN KEY ("garage_id") REFERENCES "garage"("garage_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_garage" ADD CONSTRAINT "FK_7235f0d6ba59300683af41d30ce" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_garage" DROP CONSTRAINT "FK_7235f0d6ba59300683af41d30ce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_garage" DROP CONSTRAINT "FK_84b91f6db98b87acbebee806802"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" DROP CONSTRAINT "FK_c8d34198d86de9e96aae03b8990"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage" DROP CONSTRAINT "FK_c3d11bc34b357ef74433efe32bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" DROP CONSTRAINT "FK_30c280ba35ac1165d34ae942fcc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" DROP CONSTRAINT "FK_19a8fbe5073e993ea843717ec1e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "camera" DROP CONSTRAINT "FK_48cf73254a0f2e1ebc986cfbc32"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7235f0d6ba59300683af41d30c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_84b91f6db98b87acbebee80680"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_f2578043e491921209f5dadd080" UNIQUE ("phoneNumber")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "phoneNumber" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."passwordHash" IS 'User password hash'`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "passwordHash"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "passwordHash" character varying(254) NOT NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "car"."user_id" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "car"."color" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "car"."model" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "car"."brand" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "car"."car_id" IS NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "garage"."number" IS 'Garage number'`,
    );
    await queryRunner.query(`ALTER TABLE "garage" DROP COLUMN "number"`);
    await queryRunner.query(
      `ALTER TABLE "garage" ADD "number" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage_request"."garage_id" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage_request"."user_id" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage_request"."description" IS 'Request description'`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" ADD "description" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage_request"."status" IS NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "garage_request"."request_id" IS NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "camera"."garage_id" IS NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "car"."licensePlate" IS 'Car license plate'`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" DROP CONSTRAINT "UQ_376f481e04705afcf4a2bc0aa9b"`,
    );
    await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "licensePlate"`);
    await queryRunner.query(`COMMENT ON COLUMN "car"."year" IS 'Car year'`);
    await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "year"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "garage"."adminUserId" IS 'User UUID'`,
    );
    await queryRunner.query(`ALTER TABLE "garage" DROP COLUMN "adminUserId"`);
    await queryRunner.query(`ALTER TABLE "garage" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "garage" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "garage"."gatePort" IS 'Gate port'`,
    );
    await queryRunner.query(`ALTER TABLE "garage" DROP COLUMN "gatePort"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "garage"."gateIp" IS 'Gate IP address'`,
    );
    await queryRunner.query(`ALTER TABLE "garage" DROP COLUMN "gateIp"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "garage"."description" IS 'Garage description'`,
    );
    await queryRunner.query(`ALTER TABLE "garage" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "garage_request" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD "description" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD "vin" character varying(17) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD CONSTRAINT "UQ_car_vin" UNIQUE ("vin")`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD "license_plate" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD CONSTRAINT "UQ_car_license_plate" UNIQUE ("license_plate")`,
    );
    await queryRunner.query(`ALTER TABLE "garage" ADD "gsk_id" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "garage" ADD "gate_port" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage" ADD "gate_ip" character varying(15) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "garage" ADD "camera_port" integer`);
    await queryRunner.query(
      `ALTER TABLE "garage" ADD "camera_ip" character varying(15)`,
    );
    await queryRunner.query(`ALTER TABLE "garage_request" ADD "gsk_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "garage_request" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "camera" ADD "last_connection_time" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_garage" ADD CONSTRAINT "FK_user_garage_garage" FOREIGN KEY ("garage_id") REFERENCES "garage"("garage_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_garage" ADD CONSTRAINT "FK_user_garage_user" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD CONSTRAINT "FK_car_user" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage" ADD CONSTRAINT "FK_garage_gsk" FOREIGN KEY ("gsk_id") REFERENCES "gsk"("gsk_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" ADD CONSTRAINT "FK_garage_request_gsk" FOREIGN KEY ("gsk_id") REFERENCES "gsk"("gsk_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" ADD CONSTRAINT "FK_garage_request_garage" FOREIGN KEY ("garage_id") REFERENCES "garage"("garage_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "garage_request" ADD CONSTRAINT "FK_garage_request_user" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "camera" ADD CONSTRAINT "FK_camera_garage" FOREIGN KEY ("garage_id") REFERENCES "garage"("garage_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
