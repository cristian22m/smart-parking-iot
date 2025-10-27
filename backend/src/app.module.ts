import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlazaModule } from './plaza/plaza.module';
import { TiempoModule } from './tiempo/tiempo.module';

@Module({
  imports: [PlazaModule, TiempoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
