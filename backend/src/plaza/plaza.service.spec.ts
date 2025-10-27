import { Test, TestingModule } from '@nestjs/testing';
import { PlazaService } from './plaza.service';

describe('PlazaService', () => {
  let service: PlazaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlazaService],
    }).compile();

    service = module.get<PlazaService>(PlazaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
