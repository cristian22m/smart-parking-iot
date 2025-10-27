import React from 'react';

export default function Plaza({ id, estado, auto, onEntrada, onSalida }) {
    return (
        <div
            className={`w-16 h-28 m-1 rounded shadow flex flex-col items-center justify-center ${estado ? 'bg-red-500' : 'bg-green-400'
                }`}
        >
            {estado && auto ? (
                <img src={auto} alt="auto" className="w-12 h-12 object-contain" />
            ) : (
                <span className="text-white font-bold">{id}</span>
            )}
            <div className="mt-1 flex flex-col gap-1">
                {!estado && (
                    <button
                        onClick={() => onEntrada(id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    >
                        Entrada
                    </button>
                )}
                {estado && (
                    <button
                        onClick={() => onSalida(id)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                    >
                        Salida
                    </button>
                )}
            </div>
        </div>
    );
}
