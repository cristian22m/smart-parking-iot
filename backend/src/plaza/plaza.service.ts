import { Injectable } from '@nestjs/common';
import axios from 'axios';

const API_URL = 'http://localhost:3001/plaza';

@Injectable()
export class PlazaService {
    async getAll() {
        const { data } = await axios.get(API_URL);
        return data;
    }

    async getById(id: number) {
        const { data } = await axios.get(`${API_URL}/${id}`);
        return data;
    }

    async updateState(id: number, estado: boolean) {
        const { data } = await axios.patch(`${API_URL}/${id}`, { estado });
        return data;
    }
}
