import { Test, TestingModule } from '@nestjs/testing';
import { OccuranceService } from './occurance.service';

describe('OccuranceService', () => {
  let service: OccuranceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OccuranceService],
    }).compile();

    service = module.get<OccuranceService>(OccuranceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
