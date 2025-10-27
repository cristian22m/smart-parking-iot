import React from 'react';
import MapaParking from '../components/mapaParking';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Smart Parking IoT</h1>
      <MapaParking />
    </div>
  );
}
