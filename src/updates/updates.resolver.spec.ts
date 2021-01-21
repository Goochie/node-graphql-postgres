import { Test, TestingModule } from '@nestjs/testing';
import { UpdateResolver } from './update.resolver';

describe('UpdateResolver', () => {
  let resolver: UpdateResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateResolver],
    }).compile();

    resolver = module.get<UpdateResolver>(UpdateResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
