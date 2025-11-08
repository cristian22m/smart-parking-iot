import React from 'react';
import Plaza from '../Plaza';
import SideControls from '../SideControls';

const RightPlaces = ({ plazas, timings, now, handleEntrada, handleSalida }) => (
  <div className="flex flex-col gap-2 lg:gap-3">
    {plazas.slice(4, 8).map(p => (
      <div key={p.id} className="flex items-center gap-2 lg:gap-3">
        <Plaza {...p} position="right" />
        <SideControls
          p={p}
          position="right"
          timings={timings}
          now={now}
          handleEntrada={handleEntrada}
          handleSalida={handleSalida}
        />
      </div>
    ))}
  </div>
);

export default RightPlaces;
