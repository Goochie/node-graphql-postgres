import { Test, TestingModule } from '@nestjs/testing';
import { SoulResolver } from './soul.resolver';

describe('SoulResolver', () => {
  let resolver: SoulResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SoulResolver],
    }).compile();

    resolver = module.get<SoulResolver>(SoulResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
