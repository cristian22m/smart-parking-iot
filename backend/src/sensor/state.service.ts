// src/sensor/state.service.ts
import { Injectable } from '@nestjs/common';

export interface PlazaState {
  plaza: number;
  libre: boolean; // true = libre, false = ocupado
}

@Injectable()
export class StateService {
  private estado: PlazaState[] = [
    { plaza: 1, libre: true },
    { plaza: 2, libre: true },
    { plaza: 3, libre: true },
    { plaza: 4, libre: true },
    { plaza: 5, libre: true },
  ];

  private onChangeCallback: ((p: PlazaState) => void) | null = null;

  registerOnChange(cb: (p: PlazaState) => void) {
    this.onChangeCallback = cb;
  }

  getEstadoCompleto(): PlazaState[] {
    return this.estado.map((s) => ({ ...s }));
  }

  actualizarPlaza(plaza: number, libre: boolean): boolean {
    const idx = this.estado.findIndex((p) => p.plaza === plaza);
    if (idx === -1) return false;

    const actual = this.estado[idx];
    if (actual.libre === libre) return false; // sin cambio real

    this.estado[idx] = { plaza, libre };

    // seguridad null-safe: asignamos callback a local antes de usar
    const cb = this.onChangeCallback;
    if (cb) cb(this.estado[idx]);

    console.log(`Cambio: plaza ${plaza} -> libre=${libre}`);
    return true;
  }

  // Si recibes sincronización completa desde Arduino en un solo paquete
  actualizarEstadoCompleto(nuevoEstado: PlazaState[]) {
    this.estado = nuevoEstado.map((s) => ({ ...s }));
    const cb = this.onChangeCallback;
    if (cb) {
      nuevoEstado.forEach((p) => cb(p)); // invoke callback por cada plaza
    }
    console.log('Sincronización inicial recibida del Arduino');
  }
}
