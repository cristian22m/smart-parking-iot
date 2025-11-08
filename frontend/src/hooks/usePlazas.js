import { useCallback, useEffect, useMemo, useState } from 'react';
import { getPlazas, postEntrada, postSalida } from '../services/api';
import autos from '../assets/cars';

export default function usePlazas() {
  const [plazas, setPlazas] = useState([]);
  const [timings, setTimings] = useState({}); 
  const [now, setNow] = useState(Date.now());

  const fetchPlazas = useCallback(async () => {
    try {
      const res = await getPlazas();
      setPlazas(prevPlazas =>
        res.data.map(p => {
          const plazaLocal = prevPlazas.find(pl => pl.id === p.id);
          if (p.estado && (!plazaLocal || !plazaLocal.auto)) {
            return { ...p, auto: autos[Math.floor(Math.random() * autos.length)] };
          } else if (!p.estado) {
            return { ...p, auto: null };
          } else {
            return { ...p, auto: plazaLocal?.auto || null };
          }
        })
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchPlazas();
    const interval = setInterval(fetchPlazas, 5000);
    return () => clearInterval(interval);
  }, [fetchPlazas]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleEntrada = useCallback(async (id) => {
    try {
      await postEntrada(id);
      setTimings(prev => ({ ...prev, [id]: { start: Date.now(), lastSeconds: null } }));
      setPlazas(prev =>
        prev.map(p =>
          p.id === id
            ? { ...p, estado: true, auto: p.auto || autos[Math.floor(Math.random() * autos.length)] }
            : p
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }, []);

  const handleSalida = useCallback(async (id) => {
    try {
      const { data } = await postSalida(id);
      setTimings(prev => ({
        ...prev,
        [id]: { start: null, lastSeconds: data?.duracion != null ? Number(data.duracion) : null },
      }));
      setPlazas(prev => prev.map(p => (p.id === id ? { ...p, estado: false, auto: null } : p)));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }, []);

  const libres = useMemo(() => plazas.filter(p => !p.estado).length, [plazas]);
  const ocupados = useMemo(() => plazas.filter(p => p.estado).length, [plazas]);

  return { plazas, timings, now, libres, ocupados, handleEntrada, handleSalida };
}
