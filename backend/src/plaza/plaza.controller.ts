import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { PlazaService } from './plaza.service';

@Controller('plaza')
export class PlazaController {
    constructor(private readonly plazaService: PlazaService) { }

    @Get()
    getAll() {
        return this.plazaService.getAll();
    }

    @Get(':id')
    getById(@Param('id') id: string) {
        return this.plazaService.getById(+id);
    }

    @Patch(':id')
    updateState(@Param('id') id: string, @Body() body: { estado: boolean }) {
        return this.plazaService.updateState(+id, body.estado);
    }
}
