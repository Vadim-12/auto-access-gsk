import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { GarageEntity } from '../garage/entities/garage.entity';
import { CarEntity } from '../car/entities/car.entity';
import { GptVisionService } from '../ai/gpt-vision.service';
import axios from 'axios';
import { GarageService } from '../garage/garage.service';

@Injectable()
export class CameraService implements OnModuleInit {
  private readonly logger = new Logger(CameraService.name);
  private readonly checkInterval = 60000; // 1 минута
  private checkIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(
    @InjectRepository(GarageEntity)
    private readonly garageRepository: Repository<GarageEntity>,
    @InjectRepository(CarEntity)
    private readonly carRepository: Repository<CarEntity>,
    private readonly gptVisionService: GptVisionService,
    private readonly garageService: GarageService,
  ) {}

  async onModuleInit() {
    this.logger.log('Инициализация CameraService...');

    // Проверяем блокировку AI запросов
    const isAiBlocked = process.env.BLOCK_AI_REQUESTS === 'true';
    if (isAiBlocked) {
      this.logger.warn('Запросы к AI заблокированы в режиме разработки');
      return;
    }

    await this.startPeriodicChecks();
    this.logger.log('CameraService инициализирован');
  }

  private async startPeriodicChecks() {
    this.logger.log('Начинаем поиск гаражей с камерами...');
    const garages = await this.garageRepository
      .createQueryBuilder('garage')
      .leftJoinAndSelect('garage.camera', 'camera')
      .leftJoinAndSelect('garage.users', 'users')
      .leftJoinAndSelect('users.cars', 'cars')
      .leftJoinAndSelect('cars.owner', 'owner')
      .where('camera.ip IS NOT NULL')
      .getMany();

    this.logger.log(`Найдено ${garages.length} гаражей с камерами`);

    for (const garage of garages) {
      this.logger.log(`Запускаем проверку для гаража ${garage.garageId}`);
      this.logger.log('Настройки камеры:', {
        ip: garage.camera?.ip,
        streamPort: garage.camera?.streamPort,
        snapshotPort: garage.camera?.snapshotPort,
      });
      this.startCheckingGarage(garage);
    }
  }

  private startCheckingGarage(garage: GarageEntity) {
    if (this.checkIntervals.has(garage.garageId)) {
      clearInterval(this.checkIntervals.get(garage.garageId));
    }

    // Запускаем первую проверку сразу
    this.checkGarageCamera(garage).catch((error) => {
      this.logger.error(
        `Ошибка при первой проверке камеры гаража ${garage.garageId}:`,
        error,
      );
    });

    const interval = setInterval(async () => {
      try {
        await this.checkGarageCamera(garage);
      } catch (error) {
        this.logger.error(
          `Ошибка при проверке камеры гаража ${garage.garageId}:`,
          error,
        );
      }
    }, this.checkInterval);

    this.checkIntervals.set(garage.garageId, interval);
    this.logger.log(
      `Интервал проверки установлен для гаража ${garage.garageId}`,
    );
  }

  private async checkGarageCamera(garage: GarageEntity) {
    if (!garage.camera?.ip || !garage.camera?.snapshotPort) {
      this.logger.warn(
        `[${garage.garageId}] Пропуск проверки: отсутствуют настройки камеры`,
      );
      return;
    }

    try {
      this.logger.log(`[${garage.garageId}] Начинаем проверку камеры...`);
      const startTime = Date.now();

      // Получаем изображение с камеры через /capture эндпоинт
      this.logger.log(
        `[${garage.garageId}] Запрашиваем изображение с камеры ${garage.camera.ip}:${garage.camera.snapshotPort}...`,
      );
      const response = await axios.get(
        `http://${garage.camera.ip}:${garage.camera.snapshotPort}/capture`,
        {
          responseType: 'arraybuffer',
          headers: {
            Accept: 'image/jpeg',
          },
          timeout: 5000, // 5 секунд таймаут
        },
      );
      this.logger.log(
        `[${garage.garageId}] Изображение получено, размер: ${response.data.length} байт`,
      );

      const imageBase64 = Buffer.from(response.data).toString('base64');

      // Получаем все автомобили пользователей гаража
      this.logger.log(
        `[${garage.garageId}] Получаем список автомобилей пользователей гаража...`,
      );
      const cars = await this.carRepository.find({
        where: { owner: { userId: In(garage.users.map((u) => u.userId)) } },
        relations: ['owner'],
      });
      this.logger.log(
        `[${garage.garageId}] Найдено ${cars.length} автомобилей`,
      );

      // Анализируем изображение
      const aiStartTime = Date.now();
      try {
        this.logger.log(
          `[${garage.garageId}] Используем GPT-4 Vision для анализа...`,
        );
        const result = await this.gptVisionService.analyzeCarImage(
          imageBase64,
          cars,
        );
        this.logger.log(
          `[${garage.garageId}] GPT-4 Vision анализ завершен за ${Date.now() - aiStartTime}мс`,
        );

        this.logger.log(`[${garage.garageId}] Результаты анализа:`);
        this.logger.log(`[${garage.garageId}] Сообщение: ${result.message}`);
        this.logger.log(
          `[${garage.garageId}] Доступ: ${result.isAccessGranted ? 'РАЗРЕШЕН' : 'ЗАПРЕЩЕН'}`,
        );
        if (result.detectedCarDetails) {
          this.logger.log(
            `[${garage.garageId}] Обнаружен автомобиль:`,
            result.detectedCarDetails,
          );
        }
        this.logger.log(
          `[${garage.garageId}] Уверенность: ${result.confidence}`,
        );

        // Находим соответствующий автомобиль в базе данных
        let detectedCar: CarEntity | null = null;
        if (result.detectedCarDetails) {
          detectedCar =
            cars.find(
              (car) =>
                car.brand === result.detectedCarDetails.brand &&
                car.model === result.detectedCarDetails.model &&
                car.year === result.detectedCarDetails.year &&
                car.color === result.detectedCarDetails.color &&
                car.licensePlate === result.detectedCarDetails.number,
            ) || null;
        }

        // Логируем результат
        await this.garageService.logGarageAccess(
          garage.garageId,
          result,
          detectedCar?.carId,
        );

        this.logger.log(
          `[${garage.garageId}] Проверка завершена за ${Date.now() - startTime}мс`,
        );
      } catch (error) {
        this.logger.error(
          `[${garage.garageId}] Ошибка при анализе изображения:`,
          error,
        );
      }
    } catch (error) {
      this.logger.error(
        `[${garage.garageId}] Ошибка при получении изображения с камеры:`,
        error,
      );
    }
  }

  async addGarage(garage: GarageEntity) {
    this.startCheckingGarage(garage);
  }

  async removeGarage(garageId: string) {
    if (this.checkIntervals.has(garageId)) {
      clearInterval(this.checkIntervals.get(garageId));
      this.checkIntervals.delete(garageId);
    }
  }
}
