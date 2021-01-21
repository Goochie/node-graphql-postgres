import { Test, TestingModule } from '@nestjs/testing';
import { CircadianService } from './circadian.service';

describe('CircadianService', () => {
  let service: CircadianService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CircadianService],
    }).compile();

    service = module.get<CircadianService>(CircadianService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
