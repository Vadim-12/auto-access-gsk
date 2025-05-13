import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);
  private twilioClient: Twilio;
  private fromPhone: string;
  private smsVerifyingServiceSid: string;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.smsVerifyingServiceSid = this.configService.get<string>(
      'TWILIO_SMS_VERIFY_SERVICE_SID',
    );
    this.fromPhone = this.configService.get('TWILIO_PHONE_FROM');
    this.twilioClient = new Twilio(accountSid, authToken);
  }

  // либо отправляем код вручкую и храним verification-сессии в БД
  async sendSms(to: string, message: string): Promise<void> {
    const sendedMessage = await this.twilioClient.messages.create({
      body: message,
      from: this.fromPhone,
      to,
    });
    this.logger.log('Sended message:' + JSON.stringify(sendedMessage));
    console.log('Sended message:', sendedMessage);
  }

  // либо пользуемся готовым сервисом twilio verify
  // создаем verification-сессию
  async createVerification(phoneNumber: string): Promise<string> {
    const verification = await this.twilioClient.verify.v2
      .services(this.smsVerifyingServiceSid)
      .verifications.create({ channel: 'sms', to: phoneNumber });
    this.logger.debug(
      'Created verification status:' + JSON.stringify(verification.status),
    );
    console.log('Created verification status:', verification.status);
    return verification.status;
  }

  // проверяем код
  async checkVerification(
    phoneNumber: string,
    verificationCode: string,
  ): Promise<string> {
    const verificationCheck = await this.twilioClient.verify.v2
      .services(this.smsVerifyingServiceSid)
      .verificationChecks.create({ to: phoneNumber, code: verificationCode });
    this.logger.debug(
      'Verification check:' + JSON.stringify(verificationCheck),
    );
    console.log('Verification check:', verificationCheck);
    return verificationCheck.status;
  }
}
