// Cantidad total de sensores (Pines 2 al 11 = 10 sensores)
const int NUM_SENSORES = 10;

// Definimos los pines físicos a utilizar (Omitimos el 0 y 1 por serial)
// El índice 0 del array corresponde al Pin 2, el índice 1 al Pin 3, etc.
const int pinesSensores[NUM_SENSORES] = {2, 3, 4, 5, 6, 7, 8, 9, 10, 11};

// Array para guardar el estado de cada sensor (true = libre, false = ocupado)
bool estadosLibres[NUM_SENSORES];

void setup() {
  Serial.begin(9600);

  // Configuración automática de todos los pines
  for (int i = 0; i < NUM_SENSORES; i++) {
    pinMode(pinesSensores[i], INPUT);
    
    // Lectura inicial para sincronizar
    // Asumimos HIGH = LIBRE (ajustar a LOW si tu sensor funciona al revés)
    estadosLibres[i] = (digitalRead(pinesSensores[i]) == HIGH);
  }

  // Enviar estado inicial de todos los sensores al arrancar
  enviarEstadoInicial();
}

void loop() {
  // Recorremos todos los sensores en cada ciclo
  for (int i = 0; i < NUM_SENSORES; i++) {
    int pinActual = pinesSensores[i];
    
    // Leemos el estado actual del pin
    bool lecturaActual = (digitalRead(pinActual) == HIGH);

    // Si detectamos un cambio respecto a lo que teníamos guardado
    if (lecturaActual != estadosLibres[i]) {
      estadosLibres[i] = lecturaActual; // Guardamos el nuevo estado
      
      // Enviamos el cambio. 
      // OJO: Enviamos 'pinActual' como ID del sensor (ej: 2, 3... 11)
      enviarCambio(pinActual, lecturaActual); 
    }
  }

  delay(50); // Pequeña pausa para estabilidad y evitar saturar el puerto serie
}

// Función para enviar el JSON: {"sensor": X, "libre": true/false}
void enviarCambio(int sensorId, bool libre) {
  Serial.print("{\"sensor\":");
  Serial.print(sensorId);
  Serial.print(",\"libre\":");
  Serial.print(libre ? "true" : "false");
  Serial.println("}");
}

// Recorre el array y envía el estado de todos los sensores
void enviarEstadoInicial() {
  for (int i = 0; i < NUM_SENSORES; i++) {
    enviarCambio(pinesSensores[i], estadosLibres[i]);
  }
}