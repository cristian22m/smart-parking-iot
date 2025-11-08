import React, { memo } from 'react';

function Plaza({ id, estado, auto, position }) {
    const getImageClass = () => {
        if (position === 'right') return 'scale-x-[-1]';
        if (position === 'bottom') return 'rotate-90';
        return '';
    };

    const isHorizontal = position === 'left' || position === 'right';
    const sizeClasses = isHorizontal
        ? 'w-32 lg:w-36 h-20 lg:h-24'
        : 'w-28 lg:w-32 h-32 lg:h-36';

    return (
        <div
            className={`${sizeClasses} m-1 lg:m-2 rounded-lg shadow-lg flex flex-col items-center justify-center relative ${estado ? 'bg-red-500' : 'bg-green-400'
                } border-2 lg:border-4 border-white transition-all duration-300`}
        >
            {estado && auto ? (
                <img
                    src={auto}
                    alt="auto"
                    className={`w-full h-full object-contain ${getImageClass()}`}
                />
            ) : (
                <span className="text-gray-800 font-bold text-xl lg:text-2xl">{id}</span>
            )}
        </div>
    );
}

function areEqual(prevProps, nextProps) {
   return (
     prevProps.id === nextProps.id &&
     prevProps.estado === nextProps.estado &&
     prevProps.auto === nextProps.auto &&
     prevProps.position === nextProps.position
   );
 }

export default memo(Plaza, areEqual);