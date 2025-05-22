import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GarageEntity } from './entities/garage.entity';
import { Repository } from 'typeorm';
import { GarageRequestService } from '../garage-request/garage-request.service';
import { UserEntity } from '../user/entities/user.entity';
import { CreateGarageDto } from './dto/create-garage.dto';
import { CameraEntity } from '../camera/entities/camera.entity';
import { CameraStatusEnum } from '../../consts';

@Injectable()
export class GarageService {
  constructor(
    @InjectRepository(GarageEntity)
    private readonly garageRepository: Repository<GarageEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CameraEntity)
    private readonly cameraRepository: Repository<CameraEntity>,
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
    const garage = this.garageRepository.create({
      ...createGarageDto,
      number: createGarageDto.name, // Используем name как number
      gateIp: createGarageDto.gateIp,
      gatePort: createGarageDto.gatePort,
    });
    const savedGarage = await this.garageRepository.save(garage);
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
      .leftJoinAndSelect('garage.users', 'users')
      .where('admin.userId = :userId', { userId })
      .getMany();

    console.log('Admin garages:', adminGarages);

    // Затем проверим гаражи, где пользователь является арендатором
    const userGarages = await this.garageRepository
      .createQueryBuilder('garage')
      .leftJoinAndSelect('garage.users', 'user')
      .leftJoinAndSelect('garage.camera', 'camera')
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
      relations: ['admin'],
    });

    if (!garage) {
      throw new NotFoundException('Гараж не найден');
    }

    if (garage.admin.userId !== userId) {
      throw new ForbiddenException('Вы можете удалять только свои гаражи');
    }

    await this.garageRepository.remove(garage);
  }

  async updateCameraSettings(
    adminId: string,
    garageId: string,
    settings: { ip: string; port: number },
  ): Promise<GarageEntity> {
    console.log('Service: updateCameraSettings called with:', {
      adminId,
      garageId,
      settings,
    });

    const garage = await this.garageRepository.findOne({
      where: { garageId },
      relations: ['camera', 'admin'],
    });

    console.log('Service: Found garage:', {
      garageId: garage?.garageId,
      hasCamera: !!garage?.camera,
      cameraIp: garage?.camera?.ip,
      cameraPort: garage?.camera?.port,
      adminId: garage?.admin?.userId,
    });

    if (!garage) {
      console.log('Service: Garage not found');
      throw new NotFoundException('Гараж не найден');
    }

    if (garage.admin.userId !== adminId) {
      console.log('Service: Permission denied', {
        garageAdminId: garage.admin.userId,
        requestAdminId: adminId,
      });
      throw new ForbiddenException(
        'У вас нет прав для изменения настроек этого гаража',
      );
    }

    if (!garage.camera) {
      console.log('Service: Creating new camera');
      // Создаем новую камеру, если она не существует
      const camera = this.cameraRepository.create({
        ip: settings.ip,
        port: settings.port,
        name: `Камера гаража №${garage.number}`,
        status: CameraStatusEnum.INACTIVE,
        garage: garage,
      });

      console.log('Service: Created camera entity:', {
        ip: camera.ip,
        port: camera.port,
        name: camera.name,
        status: camera.status,
      });

      // Сохраняем камеру
      const savedCamera = await this.cameraRepository.save(camera);
      console.log('Service: Saved camera:', {
        cameraId: savedCamera.cameraId,
        ip: savedCamera.ip,
        port: savedCamera.port,
      });

      // Обновляем связь в гараже
      garage.camera = savedCamera;
    } else {
      console.log('Service: Updating existing camera:', {
        cameraId: garage.camera.cameraId,
        oldIp: garage.camera.ip,
        oldPort: garage.camera.port,
        newIp: settings.ip,
        newPort: settings.port,
      });

      // Обновляем существующую камеру
      garage.camera.ip = settings.ip;
      garage.camera.port = settings.port;

      // Сохраняем камеру
      const savedCamera = await this.cameraRepository.save(garage.camera);
      console.log('Service: Updated camera:', {
        cameraId: savedCamera.cameraId,
        ip: savedCamera.ip,
        port: savedCamera.port,
      });
    }

    // Сохраняем гараж
    const savedGarage = await this.garageRepository.save(garage);
    console.log('Service: Saved garage:', {
      garageId: savedGarage.garageId,
      hasCamera: !!savedGarage.camera,
      cameraIp: savedGarage.camera?.ip,
      cameraPort: savedGarage.camera?.port,
    });

    // Получаем обновленный гараж со всеми связями
    const updatedGarage = await this.garageRepository.findOne({
      where: { garageId },
      relations: ['camera', 'admin'],
    });

    console.log('Service: Final garage state:', {
      garageId: updatedGarage.garageId,
      hasCamera: !!updatedGarage.camera,
      cameraIp: updatedGarage.camera?.ip,
      cameraPort: updatedGarage.camera?.port,
    });

    return updatedGarage;
  }

  async updateGateSettings(
    adminId: string,
    garageId: string,
    settings: { ip: string; port: number },
  ): Promise<GarageEntity> {
    const garage = await this.garageRepository.findOne({
      where: { garageId },
      relations: ['admin'],
    });

    if (!garage) {
      throw new NotFoundException('Гараж не найден');
    }

    if (garage.admin.userId !== adminId) {
      throw new ForbiddenException(
        'У вас нет прав для изменения настроек этого гаража',
      );
    }

    garage.gateIp = settings.ip;
    garage.gatePort = settings.port;

    await this.garageRepository.save(garage);
    return garage;
  }
}
