import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/core/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  const config = app.get(ConfigService);
  app.setGlobalPrefix(config.get('API_HTTP_PREFIX'));

  const API_HTTP_PROTOCOL = config.get('NODE_ENV') === 'dev' ? 'http' : 'https';
  const API_HTTP_URL = `${API_HTTP_PROTOCOL}://${config.get('API_HTTP_HOST')}:${config.get('API_HTTP_PORT')}${config.get('API_HTTP_PREFIX')}`;
  const API_WS_URL = `${API_HTTP_PROTOCOL}://${config.get('API_HTTP_HOST')}:${config.get('API_HTTP_PORT')}`;

  // Включаем CORS для всех клиентов
  app.enableCors({
    origin: true, // Разрешаем все источники
    credentials: true,
  });

  const configSwagger = new DocumentBuilder()
    .setTitle('Automated access system')
    .setDescription('API for automated access system')
    .setVersion('1.0')
    .addServer(API_HTTP_URL)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup(`${config.get('API_HTTP_PREFIX')}/docs`, app, document);

  const port = config.get('API_HTTP_PORT') || 3000;
  await app.listen(port);
  logger.log(`Server is running on port ${port}`);
  logger.log(`Docs: ${API_HTTP_URL}/docs`);
  logger.log(`WebSocket: ${API_WS_URL}`);
}
bootstrap();
