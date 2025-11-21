import { useEffect, useState, useMemo } from 'react';
import { socket } from '../services/socket';
import autos from '../assets/cars';

const TOTAL_PLAZAS = 10;

// 10 plazas vacías por defecto
const createInitialPlazas = () =>
  Array.from({ length: TOTAL_PLAZAS }, (_, i) => ({
    id: i + 1,
    estado: false,
    auto: null,
  }));

export default function usePlazas() {
  const [plazas, setPlazas] = useState(createInitialPlazas());
  const [timings, setTimings] = useState({});
  const [now, setNow] = useState(Date.now());
  const [isConnected, setIsConnected] = useState(socket.connected);

  const getRandomCar = () => autos[Math.floor(Math.random() * autos.length)];

  useEffect(() => {
    socket.connect();

    function onConnect() {
      setIsConnected(true);
      console.log('[Socket] Conectado');
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log('[Socket] Desconectado');
    }

    function onEstadoInicial(dataBackend) {
      console.log('[Socket] Estado Inicial:', dataBackend);

      // 1. Actualizar visualización de Plazas
      setPlazas(prevPlazas => {
        return prevPlazas.map(p => {
          const datoBackend = dataBackend.find(d => d.plaza === p.id);
          if (datoBackend) {
            const estaOcupado = !datoBackend.libre;
            return {
              ...p,
              estado: estaOcupado,
              auto: estaOcupado ? p.auto || getRandomCar() : null,
            };
          }
          return p;
        });
      });

      // 2. Actualizar CRONÓMETROS (Timings) usando el timestamp del servidor
      const nuevosTimings = {};
      dataBackend.forEach(d => {
        if (!d.libre) {
          // Si está ocupado, usamos SU timestamp original
          nuevosTimings[d.plaza] = {
            start: d.timestamp,
            lastSeconds: null,
          };
        }
      });
      setTimings(nuevosTimings);
    }

    function onEventoPlaza(data) {
      // data trae: { plaza, libre, timestamp }
      const { plaza, libre, timestamp } = data;
      const nuevoEstado = !libre;

      setPlazas(prev =>
        prev.map(p => {
          if (p.id === plaza) {
            const auto = nuevoEstado ? p.auto || getRandomCar() : null;
            return { ...p, estado: nuevoEstado, auto };
          }
          return p;
        })
      );

      // Actualizar timers usando el timestamp del evento
      if (nuevoEstado) {
        setTimings(prev => ({
          ...prev,
          [plaza]: { start: timestamp, lastSeconds: null },
        }));
      } else {
        setTimings(prev => {
          const copy = { ...prev };
          delete copy[plaza];
          return copy;
        });
      }
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('estado-inicial', onEstadoInicial);
    socket.on('evento-plaza', onEventoPlaza);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('estado-inicial', onEstadoInicial);
      socket.off('evento-plaza', onEventoPlaza);
      socket.disconnect();
    };
  }, []);

  // Reloj global
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Estadísticas
  const { libres, ocupados } = useMemo(() => {
    const libresCount = plazas.filter(p => !p.estado).length;
    return {
      libres: libresCount,
      ocupados: plazas.length - libresCount,
    };
  }, [plazas]);

  return {
    plazas,
    timings,
    now,
    isConnected,
    libres,
    ocupados,
  };
}
