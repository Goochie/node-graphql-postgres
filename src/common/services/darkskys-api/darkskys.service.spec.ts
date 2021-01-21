import { Test, TestingModule } from '@nestjs/testing';
import { DarkskysService } from './darkskys.service';

describe('DarkskysService', () => {
  let service: DarkskysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DarkskysService],
    }).compile();

    service = module.get<DarkskysService>(DarkskysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
