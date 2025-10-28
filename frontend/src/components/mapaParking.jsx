import React, { useEffect, useState } from 'react';
import Plaza from './plaza';
import axios from 'axios';

const autos = Object.values(
    import.meta.glob('../assets/cars/*.png', { eager: true, import: 'default' })
);

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
        const interval = setInterval(fetchPlazas, 5000);
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

    const libres = plazas.filter(p => !p.estado).length;
    const ocupados = plazas.filter(p => p.estado).length;

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-800 to-gray-900 flex items-center justify-center pt-2">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl p-7">
                {}
                <h1 className="text-3xl lg:text-4xl font-bold text-center mb-2 text-gray-800">
                    SMART-PARKING-IOT
                </h1>
                <p className="text-center text-gray-600 mb-6 lg:mb-8 text-sm lg:text-base">
                    Monitoreo en Tiempo Real de Espacios
                </p>

                {/* Contenedor principal */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start justify-center">

                    {/* Contenedor de plazas */}
                    <div className="flex-1 flex justify-center w-full">
                        <div className="flex flex-col items-center bg-gray-700 p-6 lg:p-8 rounded-lg shadow-inner">

                            {/* Contenedor de plazas 2 */}
                            <div className="flex items-center justify-center gap-4 lg:gap-6">

                                {/* 4 plazas IZQUIERDA */}
                                <div className="flex flex-col gap-2 lg:gap-3">
                                    {plazas.slice(0, 4).map((p) => (
                                        <Plaza
                                            key={p.id}
                                            {...p}
                                            position="left"
                                            onEntrada={handleEntrada}
                                            onSalida={handleSalida}
                                        />
                                    ))}
                                </div>

                                {/* Rectángulo central */}
                                <div className="w-32 lg:w-40 h-[440px] lg:h-[520px] bg-gray-600 rounded-lg flex items-center justify-center relative border-4 border-gray-500">
                                    <div className="text-white text-6xl lg:text-8xl opacity-20">↑</div>
                                </div>

                                {/* 4 plazas DERECHA */}
                                <div className="flex flex-col gap-2 lg:gap-3">
                                    {plazas.slice(4, 8).map((p) => (
                                        <Plaza
                                            key={p.id}
                                            {...p}
                                            position="right"
                                            onEntrada={handleEntrada}
                                            onSalida={handleSalida}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* 2 plazas ABAJO */}
                            <div className="flex gap-2 lg:gap-3 mt-4 lg:mt-6">
                                {plazas.slice(8, 10).map((p) => (
                                    <Plaza
                                        key={p.id}
                                        {...p}
                                        position="bottom"
                                        onEntrada={handleEntrada}
                                        onSalida={handleSalida}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contenedor de estadísticas */}
                    <div className="w-full lg:w-80 flex flex-col gap-4 lg:gap-6">

                        {/* Estadística: Libres */}
                        <div className="bg-linear-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-lg border-2 border-green-200">
                            <div className="text-5xl lg:text-6xl font-bold text-green-600 text-center">
                                {libres}
                            </div>
                            <div className="text-base lg:text-lg text-gray-700 text-center font-semibold mt-2">
                                Espacios Libres
                            </div>
                        </div>

                        {/* Estadística: Ocupados */}
                        <div className="bg-linear-to-br from-red-50 to-red-100 p-6 rounded-lg shadow-lg border-2 border-red-200">
                            <div className="text-5xl lg:text-6xl font-bold text-red-600 text-center">
                                {ocupados}
                            </div>
                            <div className="text-base lg:text-lg text-gray-700 text-center font-semibold mt-2">
                                Espacios Ocupados
                            </div>
                        </div>

                        {/* Estadística: Total */}
                        <div className="bg-linear-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-lg border-2 border-blue-200">
                            <div className="text-5xl lg:text-6xl font-bold text-blue-600 text-center">
                                10
                            </div>
                            <div className="text-base lg:text-lg text-gray-700 text-center font-semibold mt-2">
                                Total de Espacios
                            </div>
                        </div>

                        {/* Leyenda */}
                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg border-2 border-gray-200">
                            <h3 className="text-base lg:text-lg font-bold text-gray-800 mb-4 text-center">
                                Leyenda
                            </h3>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-400 rounded border-2 border-gray-300"></div>
                                    <span className="text-gray-700 font-medium text-base">Libre</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-red-500 rounded border-2 border-gray-300"></div>
                                    <span className="text-gray-700 font-medium text-base">Ocupado</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}