import React from 'react';

const Stats = ({ libres, ocupados }) => (
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
      <div className="text-5xl lg:text-6xl font-bold text-blue-600 text-center">10</div>
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
);

export default Stats;
