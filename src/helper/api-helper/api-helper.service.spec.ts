import { Test, TestingModule } from '@nestjs/testing';
import { ApiHelperService } from './api-helper.service';

describe('ApiHelperService', () => {
  let service: ApiHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiHelperService],
    }).compile();

    service = module.get<ApiHelperService>(ApiHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});