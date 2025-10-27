import { Controller, Post, Param } from '@nestjs/common';
import { TiempoService } from './tiempo.service';

@Controller('tiempo')
export class TiempoController {
    constructor(private readonly tiempoService: TiempoService) { }

    @Post('entrada/:id_plaza')
    async registrarEntrada(@Param('id_plaza') id_plaza: string) {
        return this.tiempoService.registrarEntrada(+id_plaza);
    }

    @Post('salida/:id_plaza')
    async registrarSalida(@Param('id_plaza') id_plaza: string) {
        return this.tiempoService.registrarSalida(+id_plaza);
    }
}
