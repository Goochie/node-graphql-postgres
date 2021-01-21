import { Test, TestingModule } from '@nestjs/testing';
import { BuyeraddressResolver } from './buyeraddress.resolver';

describe('BuyeraddressResolver', () => {
  let resolver: BuyeraddressResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuyeraddressResolver],
    }).compile();

    resolver = module.get<BuyeraddressResolver>(BuyeraddressResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
