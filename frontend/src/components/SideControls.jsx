import { memo } from 'react';

function SideControls({ p, position, timings, now, handleEntrada, handleSalida }) {
  const lastSeconds = timings[p.id]?.lastSeconds ?? null;
  const start = timings[p.id]?.start ?? null;

  const formatElapsed = ms => {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const ss = String(totalSec % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const baseBox = 'flex flex-col justify-center gap-1 text-center';
  const buttonBase =
    'border-2 border-black rounded text-xs lg:text-sm font-medium text-white px-2 lg:px-3 py-1 lg:py-1.5';

  const minutesBadge =
    lastSeconds != null && !p.estado ? (
      <div className="mt-1 bg-gray-900 text-white px-2 py-0.5 rounded text-[10px] lg:text-xs border-2 border-black">
        {formatElapsed(lastSeconds * 1000) + ' min'}
      </div>
    ) : null;

  const elapsedBadge =
    p.estado && start ? (
      <div className="mt-1 bg-black/80 text-white px-2 py-0.5 rounded text-[10px] lg:text-xs border-2 border-black">
        {formatElapsed(now - start)}
      </div>
    ) : null;

  if (position === 'left') {
    return (
      <div className={`w-32 lg:w-36 h-20 lg:h-24 ${baseBox} px-3 pr-1`}>
        {!p.estado ? (
          <button
            onClick={() => handleEntrada(p.id)}
            className={`${buttonBase} bg-blue-600 hover:bg-blue-700`}
          >
            Entrada
          </button>
        ) : (
          <button
            onClick={() => handleSalida(p.id)}
            className={`${buttonBase} bg-yellow-500 hover:bg-orange-600`}
          >
            Salida
          </button>
        )}
        {p.estado ? elapsedBadge : minutesBadge}
      </div>
    );
  } else if (position === 'right') {
    return (
      <div className={`lg:w-36 h-20 lg:h-24 ${baseBox} px-3 pl-1`}>
        {!p.estado ? (
          <button
            onClick={() => handleEntrada(p.id)}
            className={`${buttonBase} bg-blue-600 hover:bg-blue-700`}
          >
            Entrada
          </button>
        ) : (
          <button
            onClick={() => handleSalida(p.id)}
            className={`${buttonBase} bg-yellow-500 hover:bg-orange-600`}
          >
            Salida
          </button>
        )}
        {p.estado ? elapsedBadge : minutesBadge}
      </div>
    );
  }

  return (
    <div className={`w-20 lg:w-24 h-10 lg:h-12 ${baseBox}  pt-3.5`}>
      {!p.estado ? (
        <button
          onClick={() => handleEntrada(p.id)}
          className={`${buttonBase} bg-blue-600 hover:bg-blue-700`}
        >
          Entrada
        </button>
      ) : (
        <button
          onClick={() => handleSalida(p.id)}
          className={`${buttonBase} bg-yellow-500 hover:bg-orange-600`}
        >
          Salida
        </button>
      )}
      {p.estado ? elapsedBadge : minutesBadge}
    </div>
  );
}

function areEqual(prevProps, nextProps) {
  const pPrev = prevProps.p;
  const pNext = nextProps.p;

  if (pPrev.id !== pNext.id) return false;
  if (pPrev.estado !== pNext.estado) return false;
  if (pPrev.auto !== pNext.auto) return false;
  if (prevProps.position !== nextProps.position) return false;

  const tPrev = prevProps.timings[pPrev.id] || {};
  const tNext = nextProps.timings[pNext.id] || {};

  if ((tPrev.start || null) !== (tNext.start || null)) return false;
  if ((tPrev.lastSeconds || null) !== (tNext.lastSeconds || null)) return false;

  const needsTick = pNext.estado && tNext.start != null;
  if (needsTick && prevProps.now !== nextProps.now) return false;

  return true;
}

export default memo(SideControls, areEqual);
