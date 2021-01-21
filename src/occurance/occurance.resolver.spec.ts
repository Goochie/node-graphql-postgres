import { Test, TestingModule } from '@nestjs/testing';
import { OccuranceResolver } from './occurance.resolver';

describe('OccuranceResolver', () => {
  let resolver: OccuranceResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OccuranceResolver],
    }).compile();

    resolver = module.get<OccuranceResolver>(OccuranceResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
