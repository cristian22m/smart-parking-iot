import { memo } from 'react';

function SideControls({ p, position, timings, now }) {
  const start = timings[p.id]?.start ?? null;

  const formatElapsed = ms => {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const ss = String(totalSec % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const baseBox = 'flex flex-col justify-center items-center gap-1 text-center';

  const timerBadge =
    p.estado && start ? (
      <div className="bg-black/80 text-white px-2 py-0.5 rounded text-[10px] lg:text-xs border-2 border-black font-mono animate-pulse">
        {formatElapsed(now - start)}
      </div>
    ) : (
      <div className="h-5 lg:h-6"></div>
    );

  if (position === 'left') {
    return <div className={`w-32 lg:w-36 h-20 lg:h-24 ${baseBox} px-3 pr-1`}>{timerBadge}</div>;
  } else if (position === 'right') {
    return <div className={`w-32 lg:w-36 h-20 lg:h-24 ${baseBox} px-3 pl-1`}>{timerBadge}</div>;
  }

  return <div className={`w-20 lg:w-24 h-10 lg:h-12 ${baseBox} pt-1`}>{timerBadge}</div>;
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

  const needsTick = pNext.estado && tNext.start != null;
  if (needsTick && prevProps.now !== nextProps.now) return false;

  return true;
}

export default memo(SideControls, areEqual);
