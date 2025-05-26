import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GptVisionService } from './gpt-vision.service';

@Module({
  imports: [ConfigModule],
  providers: [GptVisionService],
  exports: [GptVisionService],
})
export class AiModule {}
