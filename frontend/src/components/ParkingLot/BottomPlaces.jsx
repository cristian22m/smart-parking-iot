import React from 'react';
import Plaza from '../Plaza';
import SideControls from '../SideControls';

const BottomPlaces = ({ plazas, timings, now }) => (
  <div className="flex gap-2 lg:gap-3 mt-4 lg:mt-6">
    {plazas.slice(8, 10).map(p => (
      <div key={p.id} className="flex flex-col items-center gap-1">
        <Plaza {...p} position="bottom" />
        <SideControls p={p} position="bottom" timings={timings} now={now} />
      </div>
    ))}
  </div>
);

export default BottomPlaces;
