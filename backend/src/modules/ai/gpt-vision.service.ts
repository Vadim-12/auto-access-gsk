import { Injectable, Logger } from '@nestjs/common';
import { CarEntity } from '../car/entities/car.entity';
import OpenAI from 'openai';

interface CarAnalysisResult {
  message: string;
  confidence: number;
  isAccessGranted: boolean;
  detectedCarDetails: {
    number: string;
    color: string;
    brand?: string;
    model?: string;
    year?: number;
  };
}

@Injectable()
export class GptVisionService {
  private readonly logger = new Logger(GptVisionService.name);
  private readonly openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      this.logger.error('OPENAI_API_KEY не найден в конфигурации');
      throw new Error('OPENAI_API_KEY не настроен');
    }

    this.openai = new OpenAI({
      apiKey,
    });
  }

  async analyzeCarImage(
    imageBase64: string,
    cars: CarEntity[],
  ): Promise<CarAnalysisResult> {
    this.logger.log('Начинаем анализ изображения с помощью GPT-4 Vision');

    try {
      const systemMessage = `Ты - система контроля доступа к гаражам. Твоя задача - определить, разрешен ли доступ автомобилю на изображении.

Приоритеты при оценке:
1. Номер автомобиля - самый важный параметр
2. Цвет автомобиля - второй по важности
3. Остальные параметры (марка, модель, год) - дополнительная информация

Список известных автомобилей:
${cars
  .map(
    (car) =>
      `- Номер: ${car.licensePlate}, Цвет: ${car.color}, Марка: ${car.brand}, Модель: ${car.model}, Год: ${car.year}`,
  )
  .join('\n')}

Правила доступа:
1. Если номер автомобиля четко виден и совпадает с одним из известных - доступ разрешен
2. Если номер не виден или не совпадает - доступ запрещен
3. Цвет автомобиля используется как дополнительное подтверждение

Верни ответ в формате JSON:
{
  "message": "Подробное описание автомобиля и решение о доступе",
  "confidence": число от 0 до 1,
  "isAccessGranted": true/false,
  "detectedCarDetails": {
    "number": "номер автомобиля",
    "color": "цвет",
    "brand": "марка (если видна)",
    "model": "модель (если видна)",
    "year": год (если виден)
  }
}

ВАЖНО: В поле message обязательно укажи решение о доступе (разрешен/запрещен) и причину.`;

      const userPrompt = `Проанализируй изображение и определи:
1. Номер автомобиля (самый важный параметр)
2. Цвет автомобиля (второй по важности)
3. Другие параметры (марка, модель, год)

Верни четкий ответ в формате JSON с полями:
- message: описание изображения
- confidence: уверенность в распознавании (0-1)
- isAccessGranted: true/false (разрешен ли доступ)
- detectedCarDetails: детали автомобиля (номер, цвет, марка, модель, год)`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4.1-nano',
        messages: [
          {
            role: 'system',
            content: systemMessage,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPrompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      });

      const result = JSON.parse(response.choices[0].message.content);
      this.logger.log('Результат анализа:', result);
      return result;
    } catch (error) {
      this.logger.error('Ошибка при анализе изображения:', error);
      throw new Error('Не удалось проанализировать изображение');
    }
  }
}
