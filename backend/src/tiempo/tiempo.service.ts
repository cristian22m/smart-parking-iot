import { Injectable } from '@nestjs/common';
import axios from 'axios';

const PLAZA_API = 'http://localhost:3001/plaza';
const TIEMPO_API = 'http://localhost:3001/tiempo';

@Injectable()
export class TiempoService {
    async registrarEntrada(id_plaza: number) {
        const { data: plaza } = await axios.get(`${PLAZA_API}/${id_plaza}`);

        if (plaza.estado) {
            throw new Error('La plaza está ocupada. No se puede crear un nuevo tiempo.');
        }

        await axios.patch(`${PLAZA_API}/${id_plaza}`, { estado: true });

        const { data } = await axios.post(TIEMPO_API, {
            id_plaza,
            entrada: new Date().toISOString(),
            salida: null,
            duracion: null
        });

        return data;
    }

    async registrarSalida(id_plaza: number) {
        const { data: plaza } = await axios.get(`${PLAZA_API}/${id_plaza}`);
        if (!plaza.estado) {
            throw new Error('La plaza ya está libre. No se puede registrar salida.');
        }
        await axios.patch(`${PLAZA_API}/${id_plaza}`, { estado: false });

        const { data: tiempos } = await axios.get(`${TIEMPO_API}?id_plaza=${id_plaza}&salida=null`);
        if (!tiempos.length) throw new Error('No se encontró registro de tiempo pendiente.');

        const tiempo = tiempos[0];
        const salida = new Date();
        const duracionSegundos = (salida.getTime() - new Date(tiempo.entrada).getTime()) / 1000;
        const duracionMinutos = Math.round(duracionSegundos / 60);
        const { data } = await axios.patch(`${TIEMPO_API}/${tiempo.id}`, {
            salida: salida.toISOString(),
            duracion: duracionMinutos
        });

        return data;
    }
}
