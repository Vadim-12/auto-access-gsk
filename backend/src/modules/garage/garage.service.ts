import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GarageEntity } from './entities/garage.entity';
import { Repository } from 'typeorm';
import { GarageRequestService } from '../garage-request/garage-request.service';
import { UserEntity } from '../user/entities/user.entity';
import { CreateGarageDto } from './dto/create-garage.dto';
import { CameraEntity } from '../camera/entities/camera.entity';
import { GateEntity, GateStatusEnum } from '../gate/entities/gate.entity';
import { UpdateCameraSettingsDto } from './dto/update-camera-settings.dto';
import { GarageAccessLogEntity } from './entities/garage-access-log.entity';
import { CarAnalysisResult } from '../ai/interfaces/car-analysis-result.interface';

@Injectable()
export class GarageService {
  private readonly logger = new Logger(GarageService.name);

  constructor(
    @InjectRepository(GarageEntity)
    private readonly garageRepository: Repository<GarageEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CameraEntity)
    private readonly cameraRepository: Repository<CameraEntity>,
    @InjectRepository(GateEntity)
    private readonly gateRepository: Repository<GateEntity>,
    @InjectRepository(GarageAccessLogEntity)
    private readonly accessLogRepository: Repository<GarageAccessLogEntity>,
    private readonly requestService: GarageRequestService,
  ) {}

  async findUserById(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createGarage(
    createGarageDto: CreateGarageDto & { admin: UserEntity },
  ): Promise<GarageEntity> {
    console.log('Creating garage with data:', createGarageDto);

    // Проверяем, существуют ли уже ворота с такими IP и портом
    const existingGate = await this.gateRepository.findOne({
      where: {
        ip: createGarageDto.gateIp,
        port: createGarageDto.gatePort,
      },
    });

    if (existingGate) {
      throw new ForbiddenException(
        'Ворота с таким IP-адресом и портом уже существуют',
      );
    }

    // Создаем ворота
    const gate = this.gateRepository.create({
      ip: createGarageDto.gateIp,
      port: createGarageDto.gatePort,
      status: GateStatusEnum.CLOSED,
    });
    const savedGate = await this.gateRepository.save(gate);

    // Создаем гараж
    const garage = this.garageRepository.create({
      number: createGarageDto.name,
      description: createGarageDto.description,
      admin: createGarageDto.admin,
      gate: savedGate,
      users: [],
      requests: [],
    });

    const savedGarage = await this.garageRepository.save(garage);

    // Создаем камеру, если указан IP
    if (createGarageDto.cameraIp) {
      const camera = this.cameraRepository.create({
        ip: createGarageDto.cameraIp,
        streamPort: createGarageDto.cameraStreamPort || 81, // MJPEG порт по умолчанию
        snapshotPort: createGarageDto.cameraSnapshotPort || 80, // HTTP порт по умолчанию
        garage: savedGarage,
      });
      const savedCamera = await this.cameraRepository.save(camera);
      savedGarage.camera = savedCamera;
      await this.garageRepository.save(savedGarage);
    }

    console.log('Created garage:', savedGarage);
    return savedGarage;
  }

  async findMyGarages(userId: string) {
    console.log('Finding garages for user:', userId);

    // Сначала проверим, есть ли у пользователя гаражи как владельца
    const adminGarages = await this.garageRepository
      .createQueryBuilder('garage')
      .leftJoinAndSelect('garage.admin', 'admin')
      .leftJoinAndSelect('garage.camera', 'camera')
      .leftJoinAndSelect('garage.gate', 'gate')
      .leftJoinAndSelect('garage.users', 'users')
      .where('admin.userId = :userId', { userId })
      .getMany();

    console.log('Admin garages:', adminGarages);

    // Затем проверим гаражи, где пользователь является арендатором
    const userGarages = await this.garageRepository
      .createQueryBuilder('garage')
      .leftJoinAndSelect('garage.users', 'user')
      .leftJoinAndSelect('garage.camera', 'camera')
      .leftJoinAndSelect('garage.gate', 'gate')
      .leftJoinAndSelect('garage.admin', 'admin')
      .where('user.userId = :userId', { userId })
      .getMany();

    console.log('User garages:', userGarages);

    // Объединяем результаты
    const allGarages = [...adminGarages, ...userGarages];

    // Удаляем дубликаты по garageId
    const uniqueGarages = Array.from(
      new Map(allGarages.map((garage) => [garage.garageId, garage])).values(),
    );

    console.log('Final unique garages:', uniqueGarages);
    return uniqueGarages;
  }

  async findAvailableGarages() {
    const garages = await this.garageRepository.find({
      relations: ['users', 'admin'],
    });

    return garages.map((garage) => ({
      ...garage,
      isAvailable: garage.users.length === 0,
      occupant: garage.users[0] || null,
    }));
  }

  async findAccessRequests(userId: string) {
    return this.requestService.findByUser(userId);
  }

  async createAccessRequest(userId: string, garageId: string) {
    const garage = await this.garageRepository.findOne({
      where: { garageId },
    });

    if (!garage) {
      throw new NotFoundException('Гараж не найден');
    }

    return this.requestService.create(userId, garageId);
  }

  async deleteGarage(userId: string, garageId: string): Promise<void> {
    const garage = await this.garageRepository.findOne({
      where: { garageId },
      relations: ['admin', 'camera'],
    });

    if (!garage) {
      throw new NotFoundException('Гараж не найден');
    }

    if (garage.admin.userId !== userId) {
      throw new ForbiddenException('Вы можете удалять только свои гаражи');
    }

    // Сначала удаляем камеру, если она есть
    if (garage.camera) {
      await this.cameraRepository.remove(garage.camera);
    }

    // Затем удаляем гараж
    await this.garageRepository.remove(garage);
  }

  async updateCameraSettings(
    userId: string,
    garageId: string,
    settings: UpdateCameraSettingsDto,
  ): Promise<GarageEntity> {
    this.logger.log('Service: updateCameraSettings called with:', {
      userId,
      garageId,
      settings,
    });

    const garage = await this.garageRepository.findOne({
      where: { garageId },
      relations: ['camera', 'admin', 'users'],
    });

    this.logger.log('Service: Found garage:', {
      garageId: garage?.garageId,
      hasCamera: !!garage?.camera,
      cameraIp: garage?.camera?.ip,
      cameraPort: garage?.camera?.streamPort,
      adminId: garage?.admin?.userId,
      users: garage?.users?.map((u) => u.userId),
    });

    if (!garage) {
      this.logger.warn('Service: Garage not found');
      throw new NotFoundException('Гараж не найден');
    }

    // Проверяем, является ли пользователь администратором или пользователем гаража
    const isAdmin = garage.admin.userId === userId;
    const isUser = garage.users.some((user) => user.userId === userId);

    this.logger.log('Service: Access check details:', {
      userId,
      garageAdminId: garage.admin.userId,
      isAdmin,
      isUser,
      usersCount: garage.users.length,
      users: garage.users.map((u) => u.userId),
    });

    if (!isAdmin && !isUser) {
      this.logger.warn('Service: Permission denied', {
        garageId,
        userId,
        garageAdminId: garage.admin.userId,
        isAdmin,
        isUser,
        usersCount: garage.users.length,
        users: garage.users.map((u) => u.userId),
      });
      throw new ForbiddenException(
        'У вас нет прав для изменения настроек этого гаража',
      );
    }

    if (!garage.camera) {
      // Создаем новую камеру, если она не существует
      const camera = this.cameraRepository.create({
        ip: settings.ip,
        streamPort: settings.streamPort,
        snapshotPort: settings.snapshotPort,
      });

      const savedCamera = await this.cameraRepository.save(camera);
      garage.camera = savedCamera;
    } else {
      // Обновляем существующую камеру
      garage.camera.ip = settings.ip;
      garage.camera.streamPort = settings.streamPort;
      if (settings.snapshotPort) {
        garage.camera.snapshotPort = settings.snapshotPort;
      }
      await this.cameraRepository.save(garage.camera);
    }

    // Сохраняем гараж
    await this.garageRepository.save(garage);

    // Получаем обновленный гараж со всеми связями
    return await this.garageRepository.findOne({
      where: { garageId },
      relations: ['camera', 'admin', 'users'],
    });
  }

  async updateGateSettings(
    userId: string,
    garageId: string,
    settings: { ip: string; port: number },
  ): Promise<GarageEntity> {
    const garage = await this.garageRepository.findOne({
      where: { garageId },
      relations: ['gate', 'admin', 'users'],
    });

    if (!garage) {
      throw new NotFoundException('Гараж не найден');
    }

    // Проверяем, является ли пользователь администратором или пользователем гаража
    const isAdmin = garage.admin.userId === userId;
    const isUser = garage.users.some((user) => user.userId === userId);

    if (!isAdmin && !isUser) {
      throw new ForbiddenException(
        'У вас нет прав для изменения настроек этого гаража',
      );
    }

    if (!garage.gate) {
      // Создаем новые ворота, если они не существуют
      const gate = this.gateRepository.create({
        ip: settings.ip,
        port: settings.port,
        status: GateStatusEnum.CLOSED,
      });

      const savedGate = await this.gateRepository.save(gate);
      garage.gate = savedGate;
    } else {
      // Обновляем существующие ворота
      garage.gate.ip = settings.ip;
      garage.gate.port = settings.port;
      await this.gateRepository.save(garage.gate);
    }

    // Сохраняем гараж
    await this.garageRepository.save(garage);

    // Получаем обновленный гараж со всеми связями
    return await this.garageRepository.findOne({
      where: { garageId },
      relations: ['gate', 'admin', 'users'],
    });
  }

  async toggleGate(userId: string, garageId: string): Promise<GarageEntity> {
    console.log('Service: toggleGate called with:', { userId, garageId });

    const garage = await this.garageRepository.findOne({
      where: { garageId },
      relations: ['gate', 'admin', 'users'],
    });

    console.log('Service: Found garage:', {
      garageId: garage?.garageId,
      hasGate: !!garage?.gate,
      gateStatus: garage?.gate?.status,
      adminId: garage?.admin?.userId,
      requestUserId: userId,
      users: garage?.users?.map((u) => u.userId),
    });

    if (!garage) {
      console.log('Service: Garage not found');
      throw new NotFoundException('Гараж не найден');
    }

    // Проверяем, является ли пользователь администратором или пользователем гаража
    const isAdmin = garage.admin.userId === userId;
    const isUser = garage.users.some((user) => user.userId === userId);

    if (!isAdmin && !isUser) {
      console.log('Service: Permission denied', {
        garageAdminId: garage.admin.userId,
        requestUserId: userId,
        isAdmin,
        isUser,
      });
      throw new ForbiddenException(
        'У вас нет прав для управления этим гаражом',
      );
    }

    if (!garage.gate) {
      console.log('Service: Gate not found');
      throw new NotFoundException('Ворота не настроены для этого гаража');
    }

    // Переключаем статус ворот
    const newStatus =
      garage.gate.status === GateStatusEnum.OPENED
        ? GateStatusEnum.CLOSED
        : GateStatusEnum.OPENED;

    console.log('Service: Toggling gate status:', {
      from: garage.gate.status,
      to: newStatus,
    });

    garage.gate.status = newStatus;

    // Сохраняем изменения
    const savedGate = await this.gateRepository.save(garage.gate);
    console.log('Service: Saved gate:', {
      gateId: savedGate.gateId,
      status: savedGate.status,
    });

    // Получаем обновленный гараж со всеми связями
    const updatedGarage = await this.garageRepository.findOne({
      where: { garageId },
      relations: ['gate', 'admin', 'users'],
    });

    console.log('Service: Final garage state:', {
      garageId: updatedGarage.garageId,
      hasGate: !!updatedGarage.gate,
      gateStatus: updatedGarage.gate?.status,
    });

    return updatedGarage;
  }

  async findOne(garageId: string, userId: string): Promise<GarageEntity> {
    this.logger.log('Finding garage:', {
      garageId,
      userId,
    });

    const garage = await this.garageRepository.findOne({
      where: { garageId },
      relations: ['admin', 'users'],
    });

    this.logger.log('Found garage:', {
      garageId: garage?.garageId,
      hasAdmin: !!garage?.admin,
      adminId: garage?.admin?.userId,
      usersCount: garage?.users?.length,
    });

    if (!garage) {
      this.logger.warn('Garage not found:', { garageId });
      throw new NotFoundException('Гараж не найден');
    }

    // Проверяем, является ли пользователь администратором или пользователем гаража
    const isAdmin = garage.admin.userId === userId;
    const isUser = garage.users.some((user) => user.userId === userId);

    this.logger.log('Access check:', {
      garageId,
      userId,
      isAdmin,
      isUser,
    });

    if (!isAdmin && !isUser) {
      this.logger.warn('Access denied:', {
        garageId,
        userId,
        garageAdminId: garage.admin.userId,
      });
      throw new ForbiddenException('У вас нет доступа к этому гаражу');
    }

    return garage;
  }

  async logGarageAccess(
    garageId: string,
    aiResult: CarAnalysisResult,
    detectedCarId?: string,
  ): Promise<void> {
    const log = this.accessLogRepository.create({
      garage: { garageId },
      aiDescription: aiResult.message,
      confidence: aiResult.confidence,
      isAccessGranted: aiResult.isAccessGranted,
      detectedCarNumber: aiResult.detectedCarDetails.number,
      detectedCarColor: aiResult.detectedCarDetails.color,
      detectedCar: detectedCarId ? { carId: detectedCarId } : null,
    });

    await this.accessLogRepository.save(log);
  }

  async getGarageAccessLogs(
    garageId: string,
    page: number = 1,
    limit: number = 10,
    userId: string,
  ) {
    this.logger.log('Getting access logs:', { garageId, userId, page, limit });

    try {
      const garage = await this.garageRepository.findOne({
        where: { garageId },
        relations: ['admin', 'users'],
      });

      if (!garage) {
        this.logger.warn('Garage not found:', { garageId });
        throw new NotFoundException(`Гараж с ID ${garageId} не найден`);
      }

      // Проверяем, является ли пользователь администратором или пользователем гаража
      const isAdmin = garage.admin.userId === userId;
      const isUser = garage.users.some((user) => user.userId === userId);

      this.logger.log('Access check:', {
        garageId,
        userId,
        isAdmin,
        isUser,
        adminId: garage.admin.userId,
      });

      if (!isAdmin && !isUser) {
        this.logger.warn('Access denied:', {
          garageId,
          userId,
          adminId: garage.admin.userId,
        });
        throw new ForbiddenException(
          'У вас нет доступа к журналу этого гаража',
        );
      }

      const [logs, total] = await this.accessLogRepository.findAndCount({
        where: { garage: { garageId } },
        relations: ['detectedCar'],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      this.logger.log('Found logs:', {
        garageId,
        total,
        page,
        limit,
        logsCount: logs.length,
      });

      return {
        logs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error('Error getting access logs:', {
        garageId,
        userId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
