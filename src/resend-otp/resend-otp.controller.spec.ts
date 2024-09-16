import { Test, TestingModule } from '@nestjs/testing';
import { ResendOtpController } from './resend-otp.controller';
import { ResendOtpService } from './resend-otp.service';

describe('ResendOtpController', () => {
  let controller: ResendOtpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResendOtpController],
      providers: [ResendOtpService],
    }).compile();

    controller = module.get<ResendOtpController>(ResendOtpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
