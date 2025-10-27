import { Test, TestingModule } from '@nestjs/testing';
import { PlazaController } from './plaza.controller';

describe('PlazaController', () => {
  let controller: PlazaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlazaController],
    }).compile();

    controller = module.get<PlazaController>(PlazaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
