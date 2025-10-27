import React, { useEffect, useState } from 'react';
import Plaza from './plaza';
import axios from 'axios';

import car1 from '../assets/cars/car1.png';
import car2 from '../assets/cars/car2.png';
import car3 from '../assets/cars/car3.png';

const autos = [car1, car2, car3];

export default function MapaParking() {
    const [plazas, setPlazas] = useState([]);

    const fetchPlazas = async () => {
        try {
            const res = await axios.get('http://localhost:3000/plaza');

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
    };

    useEffect(() => {
        fetchPlazas();
        const interval = setInterval(fetchPlazas, 5000); // refresca cada 5s
        return () => clearInterval(interval);
    }, []);

    const handleEntrada = async (id) => {
        try {
            await axios.post(`http://localhost:3000/tiempo/entrada/${id}`);
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
    };

    const handleSalida = async (id) => {
        try {
            await axios.post(`http://localhost:3000/tiempo/salida/${id}`);
            setPlazas(prev =>
                prev.map(p =>
                    p.id === id ? { ...p, estado: false, auto: null } : p
                )
            );
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="flex flex-col items-center">
            {}
            <div className="flex">
                {plazas.slice(0, 4).map((p) => (
                    <Plaza
                        key={p.id}
                        {...p}
                        onEntrada={handleEntrada}
                        onSalida={handleSalida}
                    />
                ))}
            </div>

            {}
            <div className="flex mt-4">
                {plazas.slice(4, 8).map((p) => (
                    <Plaza
                        key={p.id}
                        {...p}
                        onEntrada={handleEntrada}
                        onSalida={handleSalida}
                    />
                ))}
            </div>

            {}
            <div className="flex mt-4">
                {plazas.slice(8, 10).map((p) => (
                    <Plaza
                        key={p.id}
                        {...p}
                        onEntrada={handleEntrada}
                        onSalida={handleSalida}
                    />
                ))}
            </div>
        </div>
    );
}
