import { Test, TestingModule } from '@nestjs/testing';
import { TiempoController } from './tiempo.controller';

describe('TiempoController', () => {
  let controller: TiempoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiempoController],
    }).compile();

    controller = module.get<TiempoController>(TiempoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
