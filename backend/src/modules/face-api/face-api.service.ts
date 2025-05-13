import { Injectable } from '@nestjs/common';
import * as faceapi from 'face-api.js';
import { Canvas, Image, ImageData } from 'canvas';
import * as path from 'path';
import canvas from 'canvas';

@Injectable()
export class FaceApiService {
  constructor() {
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData } as any);
    const modelPath = path.resolve(__dirname, 'weights');
    faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  }

  async detectFaces(imagePath: string) {
    // Загружаем изображение
    const img = await canvas.loadImage(imagePath);

    // Загружаем модели
    const modelPath = path.resolve(__dirname, 'weights');
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);

    // Детектируем лица
    const detections = await faceapi
      .detectAllFaces(img as any)
      .withFaceLandmarks()
      .withFaceDescriptors();

    console.log('detections', detections);
    return detections;
  }
}
