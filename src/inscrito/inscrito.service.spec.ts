import { Test, TestingModule } from '@nestjs/testing';
import { InscritoService } from './inscrito.service.js';

describe('InscritoService', () => {
  let service: InscritoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InscritoService],
    }).compile();

    service = module.get<InscritoService>(InscritoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
