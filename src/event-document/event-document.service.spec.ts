import { Test, TestingModule } from '@nestjs/testing';
import { EventDocumentService } from './event-document.service';

describe('EventDocumentService', () => {
  let service: EventDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventDocumentService],
    }).compile();

    service = module.get<EventDocumentService>(EventDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
