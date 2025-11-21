import React from 'react';
import Plaza from '../Plaza';
import SideControls from '../SideControls';

// Eliminamos handleEntrada y handleSalida de las props y del componente SideControls
const LeftPlaces = ({ plazas, timings, now }) => (
  <div className="flex flex-col gap-2 lg:gap-3">
    {plazas.slice(0, 4).map(p => (
      <div key={p.id} className="flex items-center gap-2 lg:gap-3">
        <SideControls p={p} position="left" timings={timings} now={now} />
        <Plaza {...p} position="left" />
      </div>
    ))}
  </div>
);

export default LeftPlaces;
