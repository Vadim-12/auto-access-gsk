import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.setGlobalPrefix(config.get('API_HTTP_PREFIX'));

  const API_HTTP_PROTOCOL = config.get('NODE_ENV') === 'dev' ? 'http' : 'https';
  const API_HTTP_URL = `${API_HTTP_PROTOCOL}://${config.get('API_HTTP_HOST')}:${config.get('API_HTTP_PORT')}${config.get('API_HTTP_PREFIX')}`;

  // Настройка CORS только для веб-интерфейса, если он есть
  app.enableCors({
    origin: config.get('API_CORS_ORIGIN') || false, // false отключает CORS для не-браузерных клиентов
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
  console.log(`Server is running on port ${port}`);
  console.log(`Docs: ${API_HTTP_URL}/docs`);
}
bootstrap();
