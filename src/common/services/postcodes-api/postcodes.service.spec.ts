import { Test, TestingModule } from '@nestjs/testing';
import { PostcodesService } from './postcodes.service';

describe('PostcodesService', () => {
  let service: PostcodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostcodesService],
    }).compile();

    service = module.get<PostcodesService>(PostcodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
