import { Module } from '@nestjs/common';
import { TiempoService } from './tiempo.service';
import { TiempoController } from './tiempo.controller';

@Module({
  providers: [TiempoService],
  controllers: [TiempoController]
})
export class TiempoModule {}
