 import React from 'react';
 import Plaza from './plaza';
 import SideControls from './SideControls';
 import usePlazas from '../hooks/usePlazas';

export default function MapaParking() {
    const { plazas, timings, now, libres, ocupados, handleEntrada, handleSalida } = usePlazas();

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-800 to-gray-900 flex items-center justify-center pt-2">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl py-2.5 px-5">
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
                                        <div key={p.id} className="flex items-center gap-2 lg:gap-3">
                                            <SideControls p={p} position="left" timings={timings} now={now} handleEntrada={handleEntrada} handleSalida={handleSalida} />
                                            <Plaza {...p} position="left" />
                                        </div>
                                    ))}
                                </div>

                                {/* Rectángulo central */}
                                <div className="w-32 lg:w-40 h-[440px] lg:h-[520px] bg-gray-600 rounded-lg flex items-center justify-center relative border-4 border-gray-500">
                                    <div className="text-white text-6xl lg:text-8xl opacity-20">↑</div>
                                </div>

                                {/* 4 plazas DERECHA */}
                                <div className="flex flex-col gap-2 lg:gap-3">
                                    {plazas.slice(4, 8).map((p) => (
                                        <div key={p.id} className="flex items-center gap-2 lg:gap-3">
                                            <Plaza {...p} position="right" />
                                            <SideControls p={p} position="right" timings={timings} now={now} handleEntrada={handleEntrada} handleSalida={handleSalida} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 2 plazas ABAJO */}
                            <div className="flex gap-2 lg:gap-3 mt-4 lg:mt-6">
                                {plazas.slice(8, 10).map((p) => (
                                    <div key={p.id} className="flex flex-col items-center gap-1">
                                        <Plaza {...p} position="bottom" />
                                        <SideControls p={p} position="bottom" timings={timings} now={now} handleEntrada={handleEntrada} handleSalida={handleSalida} />
                                    </div>
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