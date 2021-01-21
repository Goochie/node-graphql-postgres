import { Test, TestingModule } from '@nestjs/testing';
import { EventDocumentResolver } from './event-document.resolver';

describe('EventDocumentResolver', () => {
  let resolver: EventDocumentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventDocumentResolver],
    }).compile();

    resolver = module.get<EventDocumentResolver>(EventDocumentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
