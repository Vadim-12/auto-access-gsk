import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GarageRequestEntity,
  GarageRequestStatusEnum,
  GarageRequestTypeEnum,
} from './entities/garage-request.entity';
import { GarageEntity } from '../garage/entities/garage.entity';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class GarageRequestService {
  constructor(
    @InjectRepository(GarageRequestEntity)
    private readonly requestRepository: Repository<GarageRequestEntity>,
    @InjectRepository(GarageEntity)
    private readonly garageRepository: Repository<GarageEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(
    userId: string,
    garageId: string,
    description?: string,
  ): Promise<GarageRequestEntity> {
    // Проверяем, нет ли уже активной заявки
    const existingRequest = await this.requestRepository.findOne({
      where: {
        user: { userId },
        garage: { garageId },
        status: GarageRequestStatusEnum.PENDING,
      },
    });

    if (existingRequest) {
      throw new ForbiddenException(
        'You already have a pending request for this garage',
      );
    }

    // Проверяем, не одобрена ли уже заявка для этого гаража
    const approvedRequest = await this.requestRepository.findOne({
      where: {
        user: { userId },
        garage: { garageId },
        status: GarageRequestStatusEnum.APPROVED,
      },
    });

    if (approvedRequest) {
      throw new ForbiddenException('You already have access to this garage');
    }

    const newRequest = this.requestRepository.create({
      user: { userId },
      garage: { garageId },
      description,
      status: GarageRequestStatusEnum.PENDING,
    });
    return this.requestRepository.save(newRequest);
  }

  async findAll(): Promise<GarageRequestEntity[]> {
    return this.requestRepository.find({
      relations: ['user', 'garage'],
    });
  }

  async findOne(id: string): Promise<GarageRequestEntity> {
    const request = await this.requestRepository.findOne({
      where: { requestId: id },
      relations: ['user', 'garage'],
    });

    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }

    return request;
  }

  async findByUser(userId: string): Promise<GarageRequestEntity[]> {
    return this.requestRepository.find({
      where: { user: { userId } },
      relations: ['user', 'garage'],
    });
  }

  async findByGarageAdmin(adminId: string): Promise<GarageRequestEntity[]> {
    return this.requestRepository.find({
      where: { garage: { admin: { userId: adminId } } },
      relations: ['user', 'garage'],
    });
  }

  async updateStatus(
    adminId: string,
    requestId: string,
    status: GarageRequestStatusEnum,
  ): Promise<GarageRequestEntity> {
    const request = await this.findOne(requestId);

    if (request.garage.admin.userId !== adminId) {
      throw new ForbiddenException(
        'You can only handle requests for your own garages',
      );
    }

    request.status = status;
    const updatedRequest = await this.requestRepository.save(request);

    // Если заявка одобрена, добавляем пользователя в список пользователей гаража
    if (status === GarageRequestStatusEnum.APPROVED) {
      console.log('Approving request:', {
        requestId,
        userId: request.user.userId,
        garageId: request.garage.garageId,
      });

      // Загружаем полную информацию о пользователе
      const user = await this.userRepository.findOne({
        where: { userId: request.user.userId },
      });

      if (!user) {
        console.error('User not found:', request.user.userId);
        throw new NotFoundException('User not found');
      }

      console.log('Found user:', {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      const garage = await this.garageRepository.findOne({
        where: { garageId: request.garage.garageId },
        relations: ['users'],
      });

      if (!garage) {
        console.error('Garage not found:', request.garage.garageId);
        throw new NotFoundException('Garage not found');
      }

      console.log('Current garage users:', garage.users);

      // Проверяем, нет ли уже пользователя в списке
      const userExists = garage.users.some(
        (user) => user.userId === request.user.userId,
      );

      if (!userExists) {
        console.log('Adding user to garage:', {
          userId: user.userId,
          garageId: garage.garageId,
        });

        // Создаем новый массив пользователей
        const updatedUsers = [...garage.users];
        updatedUsers.push(user);

        // Обновляем гаражи пользователя
        const updatedUserGarages = [...(user.garages || [])];
        updatedUserGarages.push(garage);
        user.garages = updatedUserGarages;

        // Сохраняем обновленного пользователя
        await this.userRepository.save(user);

        // Обновляем гаражи
        garage.users = updatedUsers;
        await this.garageRepository.save(garage);

        console.log('Updated garage users:', garage.users);
      } else {
        console.log('User already exists in garage users list');
      }
    }

    return updatedRequest;
  }

  async remove(userId: string, requestId: string): Promise<void> {
    console.log('Finding request to delete:', {
      requestId,
      userId,
    });
    const request = await this.findOne(requestId);
    console.log('Found request:', {
      requestId: request.requestId,
      requestUserId: request.user.userId,
      garageAdminId: request.garage.admin.userId,
    });

    if (
      request.user.userId !== userId &&
      request.garage.admin.userId !== userId
    ) {
      console.log('Access denied:', {
        requestUserId: request.user.userId,
        currentUserId: userId,
        garageAdminId: request.garage.admin.userId,
      });
      throw new ForbiddenException(
        'You can only delete your own requests or requests for your garages',
      );
    }

    await this.requestRepository.remove(request);
  }

  async removeUserFromGarage(
    adminId: string,
    garageId: string,
    userId: string,
    adminComment?: string,
  ): Promise<void> {
    console.log('Removing user from garage:', {
      adminId,
      garageId,
      userId,
      adminComment,
    });

    // Проверяем, что админ действительно является администратором гаража
    const garage = await this.garageRepository.findOne({
      where: { garageId },
      relations: ['admin', 'users'],
    });

    if (!garage) {
      throw new NotFoundException('Гараж не найден');
    }

    if (garage.admin.userId !== adminId) {
      throw new ForbiddenException(
        'Вы можете управлять только своими гаражами',
      );
    }

    // Проверяем, есть ли пользователь в списке пользователей гаража
    const user = garage.users.find((u) => u.userId === userId);
    if (!user) {
      throw new NotFoundException(
        'Пользователь не найден в списке пользователей гаража',
      );
    }

    // Создаем заявку на отвязку
    const unlinkRequest = this.requestRepository.create({
      user: { userId },
      garage: { garageId },
      type: GarageRequestTypeEnum.UNLINK,
      status: GarageRequestStatusEnum.APPROVED,
      adminComment,
    });

    await this.requestRepository.save(unlinkRequest);

    // Удаляем пользователя из списка пользователей гаража
    garage.users = garage.users.filter((u) => u.userId !== userId);
    await this.garageRepository.save(garage);

    // Обновляем список гаражей пользователя
    const userEntity = await this.userRepository.findOne({
      where: { userId },
      relations: ['garages'],
    });

    if (userEntity) {
      userEntity.garages = userEntity.garages.filter(
        (g) => g.garageId !== garageId,
      );
      await this.userRepository.save(userEntity);
    }

    console.log('User successfully removed from garage');
  }
}
