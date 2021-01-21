import { Test, TestingModule } from '@nestjs/testing';
import { ThemeImagesResolver } from './theme-images.resolver';

describe('ThemeImagesResolver', () => {
  let resolver: ThemeImagesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThemeImagesResolver],
    }).compile();

    resolver = module.get<ThemeImagesResolver>(ThemeImagesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
