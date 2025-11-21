import { useEffect, useState, useMemo } from 'react';
import { socket } from '../services/socket';
import autos from '../assets/cars';

const TOTAL_PLAZAS = 10;

// Generamos 10 plazas vacías por defecto para asegurar que la UI siempre tenga datos
const createInitialPlazas = () =>
  Array.from({ length: TOTAL_PLAZAS }, (_, i) => ({
    id: i + 1,
    estado: false, // libre por defecto
    auto: null,
  }));

export default function usePlazas() {
  // Iniciamos con las 10 plazas generadas
  const [plazas, setPlazas] = useState(createInitialPlazas());
  const [timings, setTimings] = useState({});
  const [now, setNow] = useState(Date.now());
  const [isConnected, setIsConnected] = useState(socket.connected);

  // Helper para obtener auto random (lo sacamos fuera del efecto para usarlo en init si fuera necesario)
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
      console.log('[Socket] Estado Inicial recibido (parcial o total):', dataBackend);

      setPlazas(prevPlazas => {
        // Recorremos las 10 plazas actuales y actualizamos SOLO si viene info del backend
        return prevPlazas.map(p => {
          const datoBackend = dataBackend.find(d => d.plaza === p.id);

          if (datoBackend) {
            const estaOcupado = !datoBackend.libre;
            return {
              ...p,
              estado: estaOcupado,
              // Si ya tenía auto lo mantenemos, si no, asignamos uno nuevo
              auto: estaOcupado ? p.auto || getRandomCar() : null,
            };
          }

          // Si el backend no mandó info de esta plaza (ej: plaza 6-10), la dejamos como está
          return p;
        });
      });
    }

    function onEventoPlaza(data) {
      console.log('[Socket] Cambio en plaza:', data);
      const { plaza, libre } = data;
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

      // Actualizar timers
      if (nuevoEstado) {
        setTimings(prev => ({
          ...prev,
          [plaza]: { start: Date.now(), lastSeconds: null },
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

  // Calcular estadísticas
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
