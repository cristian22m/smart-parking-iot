import React from 'react';

export default function Plaza({ id, estado, auto, onEntrada, onSalida, position }) {
    const getImageClass = () => {
        if (position === 'right') return 'scale-x-[-1]';
        if (position === 'bottom') return 'rotate-90';
        return '';
    };

    const isHorizontal = position === 'left' || position === 'right';
    const sizeClasses = isHorizontal
        ? 'w-32 lg:w-36 h-20 lg:h-24'
        : 'w-20 lg:w-24 h-32 lg:h-36';

    return (
        <div
            className={`${sizeClasses} m-1 lg:m-2 rounded-lg shadow-lg flex flex-col items-center justify-center relative ${estado ? 'bg-red-500' : 'bg-green-400'
                } border-2 lg:border-4 border-white transition-all duration-300`}
        >
            {estado && auto ? (
                <img
                    src={auto}
                    alt="auto"
                    className={`w-12 lg:w-16 h-12 lg:h-16 object-contain ${getImageClass()}`}
                />
            ) : (
                <span className="text-gray-800 font-bold text-xl lg:text-2xl">{id}</span>
            )}
            <div className="mt-1 lg:mt-2 flex flex-col gap-1">
                {!estado && (
                    <button
                        onClick={() => onEntrada(id)}
                        className="bg-blue-600 text-white px-2 lg:px-3 py-1 lg:py-1.5 rounded text-xs lg:text-sm font-medium hover:bg-blue-700 border-2 border-black"
                    >
                        Entrada
                    </button>
                )}
                {estado && (
                    <button
                        onClick={() => onSalida(id)}
                        className="bg-yellow-500 text-white px-2 lg:px-3 py-1 lg:py-1.5 rounded text-xs lg:text-sm font-medium hover:bg-orange-600 border-2 border-black"
                    >
                        Salida
                    </button>
                )}
            </div>
        </div>
    );
}