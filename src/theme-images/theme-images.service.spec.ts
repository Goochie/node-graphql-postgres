import { Test, TestingModule } from '@nestjs/testing';
import { ThemeImagesService } from './theme-images.service';

describe('ThemeImagesService', () => {
  let service: ThemeImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThemeImagesService],
    }).compile();

    service = module.get<ThemeImagesService>(ThemeImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
