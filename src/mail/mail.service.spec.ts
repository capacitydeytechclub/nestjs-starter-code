import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

describe('MailService', () => {
  let service: MailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue(true), // Mock the sendMail function
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string | number) => {
              switch (key) {
                case 'SMTP_HOST':
                  return 'sandbox.smtp.mailtrap.io';
                case 'SMTP_PORT':
                  return 2525;
                case 'SMTP_USER':
                  return 'c45de5ddaf419c';
                case 'SMTP_PASS':
                  return '7d87b6631ab01d';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call mailerService.sendMail with correct parameters', async () => {
    const to = 'test@example.com';
    const subject = 'Test Subject';
    const template = 'test-template';
    const context = { name: 'Test' };

    await service.sendMail(to, subject, template, context);

    expect(mailerService.sendMail).toHaveBeenCalledWith({
      to,
      subject,
      template,
      context,
    });
  });
});
