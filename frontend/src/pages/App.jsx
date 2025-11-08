import usePlazas from '../hooks/usePlazas';
import Header from '../components/Header';
import LeftPlaces from '../components/ParkingLot/LeftPlaces';
import Center from '../components/ParkingLot/Center';
import RightPlaces from '../components/ParkingLot/RightPlaces';
import BottomPlaces from '../components/ParkingLot/BottomPlaces';
import Stats from '../components/Stats';

export default function App() {
  const { plazas, timings, now, libres, ocupados, handleEntrada, handleSalida } = usePlazas();

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-800 to-gray-900 flex items-center justify-center pt-2">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl py-2.5 px-5">
        <Header />
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start justify-center">
          <div className="flex-1 flex justify-center w-full">
            <div className="flex flex-col items-center bg-gray-700 p-6 lg:p-8 rounded-lg shadow-inner">
              <div className="flex items-center justify-center gap-4 lg:gap-6">
                <LeftPlaces
                  plazas={plazas}
                  timings={timings}
                  now={now}
                  handleEntrada={handleEntrada}
                  handleSalida={handleSalida}
                />
                <Center />
                <RightPlaces
                  plazas={plazas}
                  timings={timings}
                  now={now}
                  handleEntrada={handleEntrada}
                  handleSalida={handleSalida}
                />
              </div>
              <BottomPlaces
                plazas={plazas}
                timings={timings}
                now={now}
                handleEntrada={handleEntrada}
                handleSalida={handleSalida}
              />
            </div>
          </div>
          <Stats libres={libres} ocupados={ocupados} />
        </div>
      </div>
    </div>
  );
}
