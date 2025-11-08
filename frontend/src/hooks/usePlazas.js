import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { getPlazas, postEntrada, postSalida, subscribeToPlazas } from '../services/supabaseService';
import autos from '../assets/cars';

// Función para formatear errores
export const formatError = (error, context) => {
  console.error(`[App Error] ${context}:`, error);
  return error;
};

export default function usePlazas() {
  console.log('[usePlazas] Inicializando hook...');
  const [plazas, setPlazas] = useState([]);
  const [timings, setTimings] = useState({});
  const [now, setNow] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Referencia para el estado de montaje
  const isMounted = useRef(true);

  // Función para actualizar el estado de las plazas
  const updatePlazasState = useCallback(newPlazas => {
    console.log('[usePlazas] Actualizando estado de plazas...');
    setPlazas(prevPlazas => {
      const updatedPlazas = newPlazas.map(p => {
        const plazaLocal = prevPlazas.find(pl => pl.id === p.id);
        if (p.estado && (!plazaLocal || !plazaLocal.auto)) {
          return { ...p, auto: autos[Math.floor(Math.random() * autos.length)] };
        } else if (!p.estado) {
          return { ...p, auto: null };
        } else {
          return { ...p, auto: plazaLocal?.auto || null };
        }
      });

      console.log('[usePlazas] Plazas actualizadas:', updatedPlazas);
      return updatedPlazas;
    });
  }, []);

  // Cargar plazas iniciales
  useEffect(() => {
    console.log('[usePlazas] Cargando plazas iniciales...');

    const loadInitialPlazas = async () => {
      if (!isMounted.current) return;

      try {
        setLoading(true);
        console.log('[usePlazas] Obteniendo plazas de la base de datos...');

        const { data, error } = await getPlazas();

        if (error) {
          throw new Error(error.message || 'Error al obtener las plazas');
        }

        if (!isMounted.current) return;

        console.log('[usePlazas] Plazas obtenidas, actualizando estado...');
        updatePlazasState(data);
        setError(null);
      } catch (err) {
        console.error('[usePlazas] Error al cargar plazas:', err);
        if (isMounted.current) {
          setError(formatError(err, 'Error al cargar las plazas'));
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    loadInitialPlazas();

    return () => {
      console.log('[usePlazas] Limpiando efecto de carga inicial');
      isMounted.current = false;
    };
  }, [updatePlazasState]);

  // Configurar suscripción en tiempo real
  useEffect(() => {
    console.log('[usePlazas] Configurando suscripción en tiempo real...');

    const handleChange = payload => {
      console.log('[usePlazas] Evento recibido:', payload);

      if (!isMounted.current) return;

      if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
        console.log('[usePlazas] Actualizando plaza:', payload.new);

        setPlazas(prev => {
          const plazaExistente = prev.find(p => p.id === payload.new.id);
          const nuevoAuto =
            payload.new.estado && !plazaExistente?.auto
              ? autos[Math.floor(Math.random() * autos.length)]
              : plazaExistente?.auto || null;

          return prev.map(p =>
            p.id === payload.new.id
              ? {
                  ...p,
                  ...payload.new,
                  auto: payload.new.estado ? nuevoAuto : null,
                }
              : p
          );
        });
      }
    };

    const subscription = subscribeToPlazas(handleChange);

    // Actualizar el reloj cada segundo
    const interval = setInterval(() => {
      if (isMounted.current) {
        setNow(Date.now());
      }
    }, 1000);

    return () => {
      console.log('[usePlazas] Limpiando suscripción e intervalo');
      if (subscription) {
        subscription.unsubscribe();
      }
      clearInterval(interval);
    };
  }, []);

  // Manejar entrada de vehículo
  const handleEntrada = useCallback(
    async id => {
      if (!isMounted.current) return;

      const plaza = plazas.find(p => p.id === id);
      if (!plaza) {
        console.error(`[usePlazas] No se encontró la plaza con ID: ${id}`);
        return;
      }

      if (plaza.estado) {
        console.warn(`[usePlazas] La plaza ${id} ya está ocupada`);
        return;
      }

      console.log(`[usePlazas] Intentando registrar entrada para plaza ${id}...`);

      // Guardar el estado anterior para posible rollback
      const prevPlazas = [...plazas];

      try {
        // Actualización optimista
        setPlazas(prev =>
          prev.map(p =>
            p.id === id
              ? {
                  ...p,
                  estado: true,
                  auto: autos[Math.floor(Math.random() * autos.length)],
                }
              : p
          )
        );

        console.log(`[usePlazas] Actualización optimista completada para plaza ${id}`);

        // Registrar la entrada en la base de datos
        console.log(`[usePlazas] Registrando entrada en la base de datos...`);
        const result = await postEntrada(id);
        console.log('[usePlazas] Entrada registrada:', result);

        // Actualizar timers
        setTimings(prev => ({
          ...prev,
          [id]: {
            start: Date.now(),
            lastSeconds: null,
          },
        }));
      } catch (err) {
        console.error('[usePlazas] Error en handleEntrada:', err);

        // Revertir en caso de error
        if (isMounted.current) {
          console.log('[usePlazas] Revirtiendo cambios...');
          setPlazas(prevPlazas);

          // Mostrar error al usuario
          const errorMessage = err.message || 'Error al registrar la entrada';
          console.error(`[usePlazas] ${errorMessage}`);
          alert(errorMessage);
        }
      }
    },
    [plazas]
  );

  // Manejar salida de vehículo
  const handleSalida = useCallback(
    async id => {
      if (!isMounted.current) return;

      const plaza = plazas.find(p => p.id === id);
      if (!plaza) {
        console.error(`[usePlazas] No se encontró la plaza con ID: ${id}`);
        return;
      }

      if (!plaza.estado) {
        console.warn(`[usePlazas] La plaza ${id} ya está libre`);
        return;
      }

      console.log(`[usePlazas] Intentando registrar salida para plaza ${id}...`);

      // Guardar el estado anterior para posible rollback
      const prevPlazas = [...plazas];

      try {
        // Actualización optimista
        setPlazas(prev => prev.map(p => (p.id === id ? { ...p, estado: false, auto: null } : p)));

        console.log(`[usePlazas] Actualización optimista completada para plaza ${id}`);

        // Registrar la salida en la base de datos
        console.log(`[usePlazas] Registrando salida en la base de datos...`);
        const result = await postSalida(id);
        console.log('[usePlazas] Salida registrada:', result);

        // Actualizar timers
        setTimings(prev => {
          const updated = { ...prev };
          if (updated[id]) {
            const duracion = Math.floor((Date.now() - updated[id].start) / 1000);
            console.log(`[usePlazas] Tiempo de estacionamiento: ${duracion} segundos`);
            updated[id] = {
              ...updated[id],
              lastSeconds: duracion,
            };
          }
          return updated;
        });
      } catch (err) {
        console.error('[usePlazas] Error en handleSalida:', err);

        // Revertir en caso de error
        if (isMounted.current) {
          console.log('[usePlazas] Revirtiendo cambios...');
          setPlazas(prevPlazas);

          // Mostrar error al usuario
          const errorMessage = err.message || 'Error al registrar la salida';
          console.error(`[usePlazas] ${errorMessage}`);
          alert(errorMessage);
        }
      }
    },
    [plazas]
  );

  // Calcular estadísticas
  const { libres, ocupados } = useMemo(() => {
    const libres = plazas.filter(p => !p.estado).length;
    const ocupados = plazas.length - libres;
    console.log(`[usePlazas] Estadísticas: ${libres} libres, ${ocupados} ocupadas`);
    return { libres, ocupados };
  }, [plazas]);

  // Efecto para depuración
  useEffect(() => {
    console.log('[usePlazas] Estado actual:', {
      plazas,
      loading,
      error: error?.message,
      timings,
      now: new Date(now).toISOString(),
    });
  }, [plazas, loading, error, timings, now]);

  const api = useMemo(
    () => ({
      plazas,
      timings,
      now,
      loading,
      error,
      libres,
      ocupados,
      handleEntrada,
      handleSalida,
      updatePlazasState,
    }),
    [
      plazas,
      timings,
      now,
      loading,
      error,
      libres,
      ocupados,
      handleEntrada,
      handleSalida,
      updatePlazasState,
    ]
  );

  return api;
}
