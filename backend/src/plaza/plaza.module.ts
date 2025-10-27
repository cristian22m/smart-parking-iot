import { Module } from '@nestjs/common';
import { PlazaService } from './plaza.service';
import { PlazaController } from './plaza.controller';

@Module({
  providers: [PlazaService],
  controllers: [PlazaController]
})
export class PlazaModule {}
