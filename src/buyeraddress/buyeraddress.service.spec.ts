import { Test, TestingModule } from '@nestjs/testing';
import { BuyeraddressService } from './buyeraddress.service';

describe('BuyeraddressService', () => {
  let service: BuyeraddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuyeraddressService],
    }).compile();

    service = module.get<BuyeraddressService>(BuyeraddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
