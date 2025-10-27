import { Test, TestingModule } from '@nestjs/testing';
import { TiempoService } from './tiempo.service';

describe('TiempoService', () => {
  let service: TiempoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TiempoService],
    }).compile();

    service = module.get<TiempoService>(TiempoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
