import { Test, TestingModule } from '@nestjs/testing';
import { FundResolver } from './fund.resolver';

describe('FundResolver', () => {
  let resolver: FundResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FundResolver],
    }).compile();

    resolver = module.get<FundResolver>(FundResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
